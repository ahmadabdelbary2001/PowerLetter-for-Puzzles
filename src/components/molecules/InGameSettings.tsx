// src/components/molecules/InGameSettings.tsx
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings, Users, Layers, BarChart3 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate, useParams } from "react-router-dom";

export const InGameSettings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();

  if (!gameType) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">{t.gameSettings ?? 'Game Settings'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t.gameSettings ?? 'Game Settings'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate(`/team-config/${gameType}`)}>
          <Users className="mr-2 h-4 w-4" />
          <span>{t.changeTeams ?? 'Change Teams'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate(`/change-difficulty/${gameType}`)}>
          <BarChart3 className="mr-2 h-4 w-4" />
          <span>{t.changeLevel ?? 'Change Level'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate(`/change-category/${gameType}`)}>
          <Layers className="mr-2 h-4 w-4" />
          <span>{t.changeCategory ?? 'Change Category'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
