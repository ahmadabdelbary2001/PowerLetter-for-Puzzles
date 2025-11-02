// src/features/outside-story-game/hooks/useOutsideStory.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import { outsideStoryGameEngine, type OutsideStoryLevel } from '@/features/outside-story-game/engine';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import type { GameCategory } from '@/types/game';

export type Player = {
  id: number;
  name: string;
  score: number;
};

export type RoundInfo = {
  id: string;
  category: GameCategory;
  secret: string;
  outsiderId: number;
  insiders: number[];
  votes: Record<number, number>;
  revealed: boolean;
  roundResult?: {
    outsiderIdentified: boolean;
    votedPlayerId?: number;
    pointsAwarded: Record<number, number>;
  };
};

export function useOutsideStory(initialPlayers?: string[]) {
  const gm = useGameMode();
  const { language: appLanguage } = gm;
  const { t } = useTranslation();

  const seededPlayers = useMemo(() => {
    const teams = gm.teams;
    if (teams && teams.length > 0) {
      return teams.map((tm, i) => ({ id: i, name: tm.name ?? `Team ${i + 1}` }));
    }
    if (initialPlayers && initialPlayers.length > 0) {
      return initialPlayers.map((n, i) => ({ id: i, name: n }));
    }
    return ['Alice', 'Bob', 'Carol'].map((n, i) => ({ id: i, name: n }));
  }, [gm.teams, initialPlayers]);

  const [players, setPlayers] = useState<Player[]>(seededPlayers.map(p => ({ ...p, score: 0 })));
  const [levels, setLevels] = useState<OutsideStoryLevel[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [currentRound, setCurrentRound] = useState<RoundInfo | null>(null);
  const [history, setHistory] = useState<RoundInfo[]>([]);
  const [availableCategories, setAvailableCategories] = useState<GameCategory[]>(['animals']);

  useEffect(() => {
    let mounted = true;
    setLoadingLevels(true);
    (async () => {
      try {
        const loaded = await outsideStoryGameEngine.loadLevels({
          language: (appLanguage ?? 'en'),
          categories: availableCategories,
        });
        if (!mounted) return;
        setLevels(loaded);
      } finally {
        if (mounted) setLoadingLevels(false);
      }
    })();
    return () => { mounted = false; };
  }, [appLanguage, availableCategories]);

  const setPlayerNames = useCallback((names: string[]) => {
    setPlayers(prev => names.map((n, i) => ({ id: i, name: n, score: prev[i]?.score ?? 0 })));
  }, []);

  const addPlayer = useCallback((name: string) => {
    setPlayers(prev => [...prev, { id: prev.length, name, score: 0 }]);
  }, []);

  const removePlayer = useCallback((id: number) => {
    setPlayers(prev => prev.filter(p => p.id !== id).map((p, i) => ({ ...p, id: i })));
  }, []);

  const startRound = useCallback((category: GameCategory) => {
    const level = levels.find(l => l.category === category);
    if (!level || level.words.length === 0) {
      throw new Error(t.noLevelsFound || 'No words found for category');
    }
    if (players.length < 3) {
      throw new Error('Need at least 3 players to start Outside the Story');
    }

    const secret = level.words[Math.floor(Math.random() * level.words.length)];
    const outsiderIndex = Math.floor(Math.random() * players.length);
    const insiders = players.map(p => p.id).filter(id => id !== outsiderIndex);

    const round: RoundInfo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      category,
      secret,
      outsiderId: outsiderIndex,
      insiders,
      votes: {},
      revealed: false,
    };

    setCurrentRound(round);
    return round;
  }, [levels, players, t.noLevelsFound]);

  const revealSecretToPlayer = useCallback((playerId: number) => {
    if (!currentRound) return null;
    if (playerId === currentRound.outsiderId) return null;
    return currentRound.secret;
  }, [currentRound]);

  const submitVote = useCallback((voterId: number, votedPlayerId: number) => {
    setCurrentRound(prev => {
      if (!prev) return prev;
      return { ...prev, votes: { ...prev.votes, [voterId]: votedPlayerId } };
    });
  }, []);

  const finishVotingAndReveal = useCallback(() => {
    if (!currentRound) return null;

    const votes = currentRound.votes;
    const tally = new Map<number, number>();
    for (const voterIdStr in votes) {
      const voted = votes[Number(voterIdStr)];
      tally.set(voted, (tally.get(voted) || 0) + 1);
    }

    let maxVotes = -1;
    let topCandidate: number | undefined;
    for (const [playerId, count] of tally.entries()) {
      if (count > maxVotes || (count === maxVotes && (topCandidate === undefined || playerId < topCandidate))) {
        maxVotes = count;
        topCandidate = playerId;
      }
    }

    const outsiderIdentified = topCandidate === currentRound.outsiderId;

    const pointsAwarded: Record<number, number> = {};
    players.forEach(p => (pointsAwarded[p.id] = 0));

    if (outsiderIdentified) {
      currentRound.insiders.forEach(id => (pointsAwarded[id] += 1));
      pointsAwarded[currentRound.outsiderId] += 0;
    } else {
      pointsAwarded[currentRound.outsiderId] += 2;
    }

    setPlayers(prev => prev.map(p => ({ ...p, score: p.score + (pointsAwarded[p.id] || 0) })));

    const completed: RoundInfo = {
      ...currentRound,
      votes: { ...currentRound.votes },
      revealed: true,
      roundResult: {
        outsiderIdentified,
        votedPlayerId: topCandidate,
        pointsAwarded,
      },
    };

    setHistory(prev => [completed, ...prev]);
    setCurrentRound(completed);

    return completed;
  }, [currentRound, players]);

  const resetGame = useCallback(() => {
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
    setCurrentRound(null);
    setHistory([]);
  }, []);

  return {
    players,
    setPlayerNames,
    addPlayer,
    removePlayer,
    levels,
    loadingLevels,
    availableCategories,
    setAvailableCategories,
    currentRound,
    history,
    startRound,
    revealSecretToPlayer,
    submitVote,
    finishVotingAndReveal,
    resetGame,
  } as const;
}
