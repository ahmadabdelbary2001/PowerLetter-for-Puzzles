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

interface TeamConfiguratorProps {
  onTeamsConfigured: (config: { count: number; names: string[] }) => void;
  onBack: () => void;
}

const TeamConfigurator: React.FC<TeamConfiguratorProps> = ({
  onTeamsConfigured,
  onBack,
}) => {
  const { initializeTeams, isRTL } = useGameMode();
  const [teamCount, setTeamCount] = useState<number>(2);
    const [teamNames, setTeamNames] = useState<string[]>(() => {
    return isRTL ? ['فريق 1', 'فريق 2'] : ['Team 1', 'Team 2'];
    });

  const handleTeamCountChange = (newCount: number): void => {
    if (newCount < 2 || newCount > 8) return;

    setTeamCount(newCount);
    const newTeamNames = Array.from({ length: newCount }, (_, i) =>
      teamNames[i] || `${isRTL ? 'فريق' : 'Team'} ${i + 1}`
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {isRTL ? 'إعداد الفرق' : 'Team Setup'}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isRTL ? 'قم بإعداد الفرق للعب التنافسي' : 'Configure teams for competitive play'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className={isRTL ? 'text-right' : ''}>
              {isRTL ? 'عدد الفرق' : 'Number of Teams'}
            </CardTitle>
            <CardDescription className={isRTL ? 'text-right' : ''}>
              {isRTL ? 'اختر عدد الفرق (2-8 فرق)' : 'Choose the number of teams (2-8 teams)'}
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
              <Label className={`text-lg font-semibold ${isRTL ? 'text-right block' : ''}`}>
                {isRTL ? 'أسماء الفرق' : 'Team Names'}
              </Label>

              <div className="grid gap-3">
                {teamNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Label className="min-w-[4rem] text-sm text-gray-600 dark:text-gray-400">
                      {isRTL ? `فريق ${index + 1}` : `Team ${index + 1}`}
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => handleTeamNameChange(index, e.target.value)}
                      placeholder={isRTL ? `فريق ${index + 1}` : `Team ${index + 1}`}
                      className={isRTL ? 'text-right' : ''}
                      dir={isRTL ? 'rtl' : 'ltr'}
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
                <ArrowLeft className="w-4 h-4" />
                {isRTL ? 'رجوع' : 'Back'}
              </Button>

              <Button onClick={handleContinue} className="flex items-center gap-2">
                {isRTL ? 'متابعة' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamConfigurator;
