// src/pages/TeamConfigurator.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from '@/components/organisms/Header';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export const TeamConfigurator: React.FC = () => {
  const { initializeTeams, setGameMode, teams } = useGameMode();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();
  const isOutsideStory = gameType === 'outside-the-story';

  // --- LOGIC TO DETERMINE CONTEXT ---
  // 1. Get the current location
  const location = useLocation();
  // 2. Check if the path indicates we are in "settings change" mode
  const isSettingsChangeMode = location.pathname.includes('/settings/');

  const [teamCount, setTeamCount] = useState<number>(teams.length > 1 ? teams.length : (isOutsideStory ? 3 : 2));
  const [teamNames, setTeamNames] = useState<string[]>(() => Array.from({ length: teamCount }, (_, i) => teams[i]?.name ?? ''));
  const [hintsPerTeam, setHintsPerTeam] = useState<number>(isOutsideStory ? 0 : 3);

  useEffect(() => {
    setTeamNames(currentNames => {
      const newNames = Array.from({ length: teamCount });
      for (let i = 0; i < teamCount; i++) {
        newNames[i] = currentNames[i] ?? `${t.team} ${i + 1}`;
      }
      return newNames as string[];
    });
  }, [teamCount, t.team]);

  const handleTeamCountChange = (newCount: number) => {
    const min = isOutsideStory ? 3 : 2;
    if (newCount >= min && newCount <= 8) {
      setTeamCount(newCount);
    }
  };

  const handleTeamNameChange = (index: number, name: string) => {
    setTeamNames(currentNames => {
      const newNames = [...currentNames];
      newNames[index] = name;
      return newNames;
    });
  };

  const handleContinue = () => {
    setGameMode('competitive');
    initializeTeams(teamCount, teamNames, hintsPerTeam);
    navigate(`/game/${gameType}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
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
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="team-count-display" className="text-lg font-semibold">{t.numTeams}</Label>
                  <div className="flex items-center justify-center gap-4">
                    <Button size="icon" variant="outline" onClick={() => handleTeamCountChange(teamCount - 1)} disabled={teamCount <= (isOutsideStory ? 3 : 2)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div id="team-count-display" className="text-2xl font-bold min-w-[3rem] text-center text-primary">{teamCount}</div>
                    <Button size="icon" variant="outline" onClick={() => handleTeamCountChange(teamCount + 1)} disabled={teamCount >= 8}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">{t.teamNames}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: teamCount }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Label htmlFor={`team-name-${i}`} className="min-w-[4rem] text-sm text-muted-foreground">{t.team} {i + 1}</Label>
                        <Input id={`team-name-${i}`} value={teamNames[i] || ''} onChange={e => handleTeamNameChange(i, e.target.value)} placeholder={`${t.team} ${i + 1}`} dir={dir} />
                      </div>
                    ))}
                  </div>
                </div>
                {!isOutsideStory && (
                  <div className="space-y-4">
                    <Label htmlFor="hints-display" className="text-lg font-semibold">{t.hintsPerTeam}</Label>
                    <div className="flex items-center justify-center gap-4">
                      <Button size="icon" variant="outline" onClick={() => setHintsPerTeam(h => Math.max(0, h - 1))} disabled={hintsPerTeam <= 0}><Minus className="w-4 h-4" /></Button>
                      <div id="hints-display" className="text-2xl font-bold min-w-[3rem] text-center text-primary">{hintsPerTeam}</div>
                      <Button size="icon" variant="outline" onClick={() => setHintsPerTeam(h => Math.min(10, h + 1))} disabled={hintsPerTeam >= 10}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">{t.hintsPerTeamDesc}</p>
                  </div>
                )}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                    {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    {t.back}
                  </Button>
                  <Button onClick={handleContinue} className="flex items-center gap-2">
                    {/* --- DYNAMIC BUTTON TEXT --- */}
                    {/* 3. Use the boolean to choose the correct translation key */}
                    {isSettingsChangeMode ? t.confirm : t.startPlaying}
                    {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
