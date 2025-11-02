// src/features/outside-story-game/components/OutsideStoryScreen.tsx
import React, { useState } from 'react';
import { GameLayout } from '@/components/templates/GameLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useOutsideStory } from '@/features/outside-story-game/hooks/useOutsideStory';
import { useInstructions } from '@/hooks/useInstructions';
import { useTranslation } from '@/hooks/useTranslation';
import { useGameMode } from '@/hooks/useGameMode';
import type { GameCategory } from '@/types/game';
import { cn } from '@/lib/utils';

const OutsideStoryScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const gm = useGameMode();
  const language = gm.language;

  // Get localized instructions for this game
  const rawInstructions = useInstructions('outsideStory');

  // Normalize into the shape GameLayout expects (or undefined)
  const instructions = rawInstructions
    ? {
        title: rawInstructions.title ?? '',
        description: rawInstructions.description ?? '',
        steps: rawInstructions.steps ?? [],
      }
    : undefined;

  const {
    players,
    startRound,
    revealSecretToPlayer,
    currentRound,
    submitVote,
    finishVotingAndReveal,
    history,
    availableCategories,
    levels,
    loadingLevels,
  } = useOutsideStory();

  const initialCategory = (availableCategories && availableCategories[0]) ?? 'animals';
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>(initialCategory);
  const [lastRevealFor, setLastRevealFor] = useState<number | null>(null);
  const [localVote, setLocalVote] = useState<Record<number, number>>({});

  const start = () => {
    try {
      startRound(selectedCategory);
      setLastRevealFor(null);
      setLocalVote({});
    } catch (err) {
      // Simple developer-friendly fallback: show the error to the user.
      // In production use a nicer UI notification.
      alert(String(err));
    }
  };

  const handleRevealFor = (playerId: number) => {
    const secret = revealSecretToPlayer(playerId);
    setLastRevealFor(playerId);
    if (secret) {
      // For privacy: show via alert so only the local device/user sees it.
      // Replace with a private modal in production for real multiplayer.
      alert(`${t.secretIs ?? 'Secret is:'} ${secret}`);
    } else {
      alert(t.youAreOutside ?? 'You are Outside the Story (you do NOT know the secret).');
    }
  };

  const handleCastVote = (voterId: number, votedId: number) => {
    submitVote(voterId, votedId);
    setLocalVote(prev => ({ ...prev, [voterId]: votedId }));
  };

  const revealResults = () => {
    const res = finishVotingAndReveal();
    if (res) {
      const msg = res.roundResult?.outsiderIdentified
        ? (t.outsiderIdentified ?? 'Outsider identified!')
        : (t.outsiderNotIdentified ?? 'Outsider was NOT identified');
      alert(msg);
    }
  };

  return (
    <GameLayout
      title={t.outsideTheStoryTitle ?? 'Outside the Story'}
      levelIndex={0}
      onBack={() => window.history.back()}
      layoutType="text"
      instructions={instructions}
    >
      <div className="space-y-4">
        {/* Category / Start */}
        <Card>
          <CardHeader>
            <CardTitle>{t.selectCategory ?? 'Select Category'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as GameCategory)}
                className={cn('px-3 py-2 border rounded-md', i18n.dir() === 'rtl' ? 'text-right' : 'text-left')}
              >
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{t[cat] ?? cat}</option>
                ))}
              </select>

              <Button onClick={start} disabled={loadingLevels}>
                {t.startRound ?? 'Start Round'}
              </Button>

              <div className="text-sm text-muted-foreground ml-auto">
                {t.languages ? `${t.languages}: ${language}` : `Lang: ${language}`}
              </div>
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              {levels.length > 0 ? `${levels.length} ${t.available ?? ''}` : t.loading ?? ''}
            </div>
          </CardContent>
        </Card>

        {/* Current round status (uses currentRound so it's not unused) */}
        <Card>
          <CardHeader>
            <CardTitle>{t.roundStatus ?? 'Round Status'}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentRound ? (
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>{t.category ?? 'Category'}:</strong> {t[currentRound.category] ?? currentRound.category}
                </div>
                <div className="text-sm">
                  <strong>{t.insiders ?? 'Insiders'}:</strong> {currentRound.insiders.length}
                </div>
                <div className="text-sm">
                  <strong>{t.outsider ?? 'Outsider (id)'}:</strong> {currentRound.outsiderId}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentRound.revealed ? (t.roundCompleted ?? 'Round completed') : (t.roundInProgress ?? 'Round in progress')}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">{t.noRounds ?? 'No active round'}</div>
            )}
          </CardContent>
        </Card>

        {/* Players list with reveal control */}
        <Card>
          <CardHeader>
            <CardTitle>{t.players ?? 'Players'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {players.map(p => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-2 border rounded">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{t.points ?? 'Points'}: {p.score}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleRevealFor(p.id)}>{t.revealToPlayer ?? 'Reveal'}</Button>
                    <div className="text-xs text-muted-foreground">
                      {lastRevealFor === p.id ? (t.lastRevealed ?? 'Last revealed') : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Voting */}
        <Card>
          <CardHeader>
            <CardTitle>{t.voting ?? 'Voting'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">{t.votingInstruction ?? 'Each player votes who they think is the Outsider.'}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {players.map(voter => (
                <div key={voter.id} className="p-2 border rounded">
                  <div className="font-medium mb-1">{voter.name}</div>
                  <div className="flex gap-2 flex-wrap">
                    {players.filter(p => p.id !== voter.id).map(opt => (
                      <Button
                        key={opt.id}
                        size="sm"
                        variant={localVote[voter.id] === opt.id ? 'default' : 'outline'}
                        onClick={() => handleCastVote(voter.id, opt.id)}
                      >
                        {t.voteFor ?? 'Vote for'} {opt.name}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={revealResults}>{t.revealResults ?? 'Reveal Results'}</Button>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>{t.history ?? 'Rounds History'}</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-sm text-muted-foreground">{t.noRounds ?? 'No rounds yet'}</div>
            ) : (
              <div className="space-y-2">
                {history.map(r => (
                  <div key={r.id} className="p-2 border rounded">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{t.category ?? 'Category'}: {t[r.category] ?? r.category}</div>
                        <div className="text-sm text-muted-foreground">Secret: {r.secret}</div>
                      </div>
                      <div className="text-sm">
                        {r.roundResult?.outsiderIdentified ? (t.outsiderIdentified ?? 'Outsider identified') : (t.outsiderNotIdentified ?? 'Outsider not identified')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
};

export default OutsideStoryScreen;
