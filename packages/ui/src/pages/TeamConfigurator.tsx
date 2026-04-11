"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/atoms/Card';
import { Input } from '@/atoms/Input';
import { Label } from '@/atoms/Label';
import { Header } from '@/organisms/Header';
import { Users, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useGameMode, useTranslation } from '@powerletter/core';
import { useAppParams, useAppLocation, useAppRouter } from '../contexts/RouterContext';

export interface TeamConfiguratorProps {
  gameType?: string;
}

export const TeamConfigurator: React.FC<TeamConfiguratorProps> = ({ gameType: propGameType }) => {
  const { initializeTeams, setGameMode, teams } = useGameMode();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const router = useAppRouter();
  const location = useAppLocation();
  const { gameType: paramGameType } = useAppParams<{ gameType?: string }>();
  const gameType = propGameType || paramGameType;
  const isOutsideStory = gameType === 'outside-the-story';

  const isSettingsChangeMode = location.pathname.includes('/settings/');

  const [teamCount, setTeamCount] = useState<number>(teams.length > 1 ? teams.length : (isOutsideStory ? 3 : 2));
  const [teamNames, setTeamNames] = useState<string[]>(() => Array.from({ length: teamCount }, (_, i) => teams[i]?.name ?? ''));
  const [hintsPerTeam, setHintsPerTeam] = useState<number>(isOutsideStory ? 0 : 3);

  useEffect(() => {
    setTeamNames(currentNames => {
      const newNames = Array.from({ length: teamCount });
      for (let i = 0; i < teamCount; i++) {
        newNames[i] = currentNames[i] ?? `${t('team', { ns: 'selection' })} ${i + 1}`;
      }
      return newNames as string[];
    });
  }, [teamCount, t]);

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
    router.push(`/game/${gameType}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <Header />
      <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-2xl" dir={dir}>
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl">{t('teamSetup', { ns: 'team' })}</CardTitle>
              <CardDescription>{t('teamSetupDesc', { ns: 'team' })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="team-count-display" className="text-lg font-semibold">{t('numTeams', { ns: 'team' })}</Label>
                  <div className="flex items-center justify-center gap-4">
                    <Button size="icon" variant="outline" onClick={() => handleTeamCountChange(teamCount - 1)} disabled={teamCount <= (isOutsideStory ? 3 : 2)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div id="team-count-display" className="text-2xl font-bold min-w-12 text-center text-primary">{teamCount}</div>
                    <Button size="icon" variant="outline" onClick={() => handleTeamCountChange(teamCount + 1)} disabled={teamCount >= 8}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">{t('teamNames', { ns: 'team' })}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: teamCount }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Label htmlFor={`team-name-${i}`} className="min-w-16 text-sm text-muted-foreground">{t('team', { ns: 'selection' })} {i + 1}</Label>
                        <Input id={`team-name-${i}`} value={teamNames[i] || ''} onChange={e => handleTeamNameChange(i, e.target.value)} placeholder={`${t('team', { ns: 'selection' })} ${i + 1}`} dir={dir} />
                      </div>
                    ))}
                  </div>
                </div>
                {!isOutsideStory && (
                  <div className="space-y-4">
                    <Label htmlFor="hints-display" className="text-lg font-semibold">{t('hintsPerTeam', { ns: 'team' })}</Label>
                    <div className="flex items-center justify-center gap-4">
                      <Button size="icon" variant="outline" onClick={() => setHintsPerTeam(h => Math.max(0, h - 1))} disabled={hintsPerTeam <= 0}><Minus className="w-4 h-4" /></Button>
                      <div id="hints-display" className="text-2xl font-bold min-w-12 text-center text-primary">{hintsPerTeam}</div>
                      <Button size="icon" variant="outline" onClick={() => setHintsPerTeam(h => Math.min(10, h + 1))} disabled={hintsPerTeam >= 10}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">{t('hintsPerTeamDesc', { ns: 'team' })}</p>
                  </div>
                )}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                    {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    {t('back')}
                  </Button>
                  <Button onClick={handleContinue} className="flex items-center gap-2">
                    {isSettingsChangeMode ? t('confirm') : t('startPlaying', { ns: 'landing' })}
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
