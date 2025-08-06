import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useGameMode } from '../../contexts/GameModeContext';
import { useTranslation } from '@/hooks/useTranslation';

interface TeamConfiguratorProps {
  onTeamsConfigured: (config: { count: number; names: string[] }) => void;
  onBack: () => void;
}

const TeamConfigurator: React.FC<TeamConfiguratorProps> = ({
  onTeamsConfigured,
  onBack,
}) => {
  const { initializeTeams } = useGameMode();
  const { t, dir } = useTranslation();
  const [teamCount, setTeamCount] = useState<number>(2);
  const [teamNames, setTeamNames] = useState<string[]>(() => {
    return Array.from({ length: 2 }, (_, i) => `${t.team} ${i + 1}`);
  });

  const handleTeamCountChange = (newCount: number): void => {
    if (newCount < 2 || newCount > 8) return;

    setTeamCount(newCount);
    const newTeamNames = Array.from({ length: newCount }, (_, i) =>
      teamNames[i] || `${t.team} ${i + 1}`
    );
    setTeamNames(newTeamNames);
  };

  const handleTeamNameChange = (index: number, name: string): void => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  const handleContinue = (): void => {
    initializeTeams(teamCount);
    onTeamsConfigured({
      count: teamCount,
      names: teamNames,
    });
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
      dir={dir}
    >
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`flex items-center justify-center mb-4`}>
            <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className={`text-3xl font-bold text-gray-800 dark:text-white ${dir === 'rtl' ? 'mr-3' : 'ml-3'}`}>
              {t.teamSetup}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t.teamSetupDesc}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {t.numTeams}
            </CardTitle>
            <CardDescription>
              {t.numTeamsDesc}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Team Count Selector */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTeamCountChange(teamCount - 1)}
                disabled={teamCount <= 2}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <div className="text-2xl font-bold text-center min-w-[3rem]">
                {teamCount}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTeamCountChange(teamCount + 1)}
                disabled={teamCount >= 8}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Team Names */}
            <div className="space-y-4">
              <Label className={`text-lg font-semibold`}>
                {t.teamNames}
              </Label>

              <div className="grid gap-3">
                {teamNames.map((name, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3`}
                  >
                    <Label className="min-w-[4rem] text-sm text-gray-600 dark:text-gray-400">
                      {t.team} {index + 1}
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => handleTeamNameChange(index, e.target.value)}
                      placeholder={`${t.team} ${index + 1}`}
                      dir={dir}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
            {/* Reverse arrow direction for RTL */}
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
              {/* Reverse arrow direction for RTL */}
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
  );
};

export default TeamConfigurator;