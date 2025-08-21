// src/pages/TeamConfigurator.tsx
/**
 * @description This page provides a user interface for setting up a competitive multiplayer game.
 * Users can configure the number of teams, assign custom names to each team, and set the
 * number of hints available per team for the entire game session.
 */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { Header } from '@/components/organisms/Header';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * The TeamConfigurator component is a form-like wizard for multiplayer setup.
 * It captures team settings and initializes the game state before navigating to the game screen.
 *
 * @returns {JSX.Element} The rendered team configuration page.
 */
const TeamConfigurator: React.FC = () => {
  // Hooks for global state, translation, navigation, and URL parameters
  const { initializeTeams, setGameMode } = useGameMode();
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();

  // Local state for managing the form inputs
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const [hintsPerTeam, setHintsPerTeam] = useState<number>(3);

  // Determine if the current game is a kids' game to adjust UI context (e.g., Header)
  const isKidsGame = gameType === 'image-clue' || gameType === 'word-choice' || gameType === 'picture-choice';

  /**
   * Effect to initialize or update team names whenever the team count changes.
   * It preserves existing names and generates default names for new teams.
   */
  useEffect(() => {
    setTeamNames(prev => 
      Array.from({ length: teamCount }, (_, i) => prev[i] || `${t.team} ${i + 1}`)
    );
  }, [teamCount, t.team]);

  /**
   * Handles changes to the number of teams, constrained between 2 and 8.
   * @param {number} newCount - The desired new number of teams.
   */
  const handleTeamCountChange = (newCount: number) => {
    if (newCount >= 2 && newCount <= 8) {
      setTeamCount(newCount);
    }
  };

  /**
   * Updates the name for a specific team.
   * @param {number} index - The index of the team to update.
   * @param {string} name - The new name for the team.
   */
  const handleTeamNameChange = (index: number, name: string) => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  /**
   * Finalizes the configuration, updates the global state, and navigates to the game screen.
   */
  const handleContinue = () => {
    setGameMode('competitive');
    initializeTeams(teamCount, teamNames, hintsPerTeam);
    navigate(`/game/${gameType}`);
  };

  /**
   * Navigates the user back to the previous screen (game mode selection).
   */
  const handleBack = () => {
    navigate(`/game-mode/${gameType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Pass the correct 'currentView' to the Header based on the game type */}
      <Header currentView={isKidsGame ? "kids" : "selection"} />
      <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-2xl" dir={dir}>
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl">{t.teamSetup}</CardTitle>
              <CardDescription>{t.teamSetupDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Number of Teams Input */}
              <div className="space-y-4">
                <Label htmlFor="team-count-display" className="text-lg font-semibold">{t.numTeams}</Label>
                <div className="flex items-center justify-center gap-4">
                  <Button size="icon" variant="outline" onClick={() => handleTeamCountChange(teamCount - 1)} disabled={teamCount <= 2}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div id="team-count-display" className="text-2xl font-bold min-w-[3rem] text-center text-primary">
                    {teamCount}
                  </div>
                  <Button size="icon" variant="outline" onClick={() => handleTeamCountChange(teamCount + 1)} disabled={teamCount >= 8}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Team Names Inputs */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">{t.teamNames}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: teamCount }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Label htmlFor={`team-name-${i}`} className="min-w-[4rem] text-sm text-muted-foreground">
                        {t.team} {i + 1}
                      </Label>
                      <Input
                        id={`team-name-${i}`}
                        value={teamNames[i] || ''}
                        onChange={e => handleTeamNameChange(i, e.target.value)}
                        placeholder={`${t.team} ${i + 1}`}
                        dir={dir}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Hints per Team Input */}
              <div className="space-y-4">
                <Label htmlFor="hints-display" className="text-lg font-semibold">{t.hintsPerTeam}</Label>
                <div className="flex items-center justify-center gap-4">
                  <Button size="icon" variant="outline" onClick={() => setHintsPerTeam(h => Math.max(0, h - 1))} disabled={hintsPerTeam <= 0}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div id="hints-display" className="text-2xl font-bold min-w-[3rem] text-center text-primary">{hintsPerTeam}</div>
                  <Button size="icon" variant="outline" onClick={() => setHintsPerTeam(h => Math.min(10, h + 1))} disabled={hintsPerTeam >= 10}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center">{t.hintsPerTeamDesc}</p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                  {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  {t.back}
                </Button>
                <Button onClick={handleContinue} className="flex items-center gap-2">
                  {t.startPlaying}
                  {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeamConfigurator;
