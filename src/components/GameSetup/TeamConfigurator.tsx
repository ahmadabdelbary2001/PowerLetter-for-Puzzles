// src/components/TeamConfigurator.tsx
import React, { useState } from 'react';
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
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useNavigate, useParams } from 'react-router-dom';

interface TeamConfiguratorProps {
  onTeamsConfigured?: (config: { count: number; names: string[] }) => void;
  onBack?: () => void;
}

const TeamConfigurator: React.FC<TeamConfiguratorProps> = ({ onTeamsConfigured }) => {
  const { initializeTeams, setGameMode } = useGameMode();
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();

  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState<string[]>(
    Array.from({ length: 2 }, (_, i) => `${t.team} ${i + 1}`)
  );
  // New: hints per team (global setting for the whole game)
  const [hintsPerTeam, setHintsPerTeam] = useState<number>(3);

  const handleTeamCountChange = (newCount: number) => {
    if (newCount < 2 || newCount > 8) return;
    setTeamCount(newCount);
    setTeamNames((prev) =>
      Array.from({ length: newCount }, (_, i) => prev[i] || `${t.team} ${i + 1}`)
    );
  };

  const handleTeamNameChange = (index: number, name: string) => {
    const copy = [...teamNames];
    copy[index] = name;
    setTeamNames(copy);
  };

  const handleContinue = () => {
    // Set game mode to competitive
    setGameMode('competitive');
    // Initialize teams in context with hintsPerTeam included
    initializeTeams(teamCount, teamNames, hintsPerTeam);
    if (onTeamsConfigured) onTeamsConfigured({ count: teamCount, names: teamNames });
    // Navigate to the game
    navigate(`/game/${gameType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header currentView="selection" />
      <main className="min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8 max-w-6xl flex items-center justify-center" dir={dir}>
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`flex items-center justify-center mb-4`}>
              <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              <h1 className={`text-3xl font-bold dark:text-white ${dir === 'rtl' ? 'mr-3' : 'ml-3'}`}>
                {t.teamSetup}
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t.teamSetupDesc}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t.numTeams}</CardTitle>
              <CardDescription>{t.numTeamsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTeamCountChange(teamCount - 1)}
                  disabled={teamCount <= 2}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="text-2xl font-bold min-w-[3rem] text-center">
                  {teamCount}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTeamCountChange(teamCount + 1)}
                  disabled={teamCount >= 8}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">{t.teamNames}</Label>
                <div className="grid gap-3">
                  {teamNames.map((name, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Label className="min-w-[4rem] text-sm text-gray-600 dark:text-gray-400">
                        {t.team} {i + 1}
                      </Label>
                      <Input
                        value={name}
                        onChange={e => handleTeamNameChange(i, e.target.value)}
                        placeholder={`${t.team} ${i + 1}`}
                        dir={dir}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* New: hints per team configurator */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold">{t.hintsPerTeam}</Label>
                <div className="flex items-center gap-4 justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setHintsPerTeam(h => Math.max(0, h - 1))}
                    disabled={hintsPerTeam <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-xl font-medium min-w-[3rem] text-center">{hintsPerTeam}</div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setHintsPerTeam(h => Math.min(99, h + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {t.hintsPerTeamDesc}
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => navigate(`/game-mode/${gameType}`)} className="flex items-center gap-2">
                  {dir === 'rtl' ? (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      {t.back}
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="w-4 h-4" />
                      {t.back}
                    </>
                  )}
                </Button>
                <Button onClick={handleContinue} className="flex items-center gap-2">
                  {dir === 'rtl' ? (
                    <>
                      {t.continue}
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      {t.continue}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeamConfigurator;
