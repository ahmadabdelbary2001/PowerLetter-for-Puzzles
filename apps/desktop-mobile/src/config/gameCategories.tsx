// src/config/gameCategories.ts
/**
 * @description Centralized configuration for game categories.
 * This file acts as a single source of truth for which categories are available
 * for each game, along with their icons and translation keys.
 */
import React from 'react';
import { 
  PawPrint, FlaskConical, Globe, BrainCircuit, Apple, Music, Car, 
  Clapperboard, Utensils, GlassWater, Heart, Swords, Cake, Shirt, Tv, Gamepad, User, Shapes
} from 'lucide-react';
import type { GameCategory } from '@/types/game';

// Define a reusable type for category data
export type CategoryConfig = {
  id: GameCategory;
  icon: React.ReactNode;
  labelKey: string;
};

// Define the kid-friendly categories
export const KIDS_CATEGORIES: readonly CategoryConfig[] = [
  { id: 'general', icon: <BrainCircuit size={48} />, labelKey: 'generalKnowledge' },
  { id: 'animals', icon: <PawPrint size={48} />, labelKey: 'animals' },
  { id: 'fruits-and-vegetables', icon: <Apple size={48} />, labelKey: 'fruits-and-vegetables' },
  { id: 'shapes', icon: <Shapes size={48} />, labelKey: 'shapes' },
];

// Define the categories for adult games
export const CATEGORIES_BY_GAME: Record<string, readonly CategoryConfig[]> = {
  // Clue (adult) - includes "general"
  clue: [
    { id: 'general', icon: <BrainCircuit size={48} />, labelKey: 'generalKnowledge' },
    { id: 'animals', icon: <PawPrint size={48} />, labelKey: 'animals' },
    { id: 'science', icon: <FlaskConical size={48} />, labelKey: 'science' },
    { id: 'geography', icon: <Globe size={48} />, labelKey: 'geography' },
  ],

  // Outside the story (adult) - NO 'general' option
  'outside-the-story': [
    { id: 'animals', icon: <PawPrint size={48} />, labelKey: 'animals' },
    { id: 'anime', icon: <Heart size={48} />, labelKey: 'anime' },
    { id: 'cars', icon: <Car size={48} />, labelKey: 'cars' },
    { id: 'cartoons', icon: <Clapperboard size={48} />, labelKey: 'cartoons' },
    { id: 'characters', icon: <User size={48} />, labelKey: 'characters' },
    { id: 'clothes', icon: <Shirt size={48} />, labelKey: 'clothes' },
    { id: 'drinks', icon: <GlassWater size={48} />, labelKey: 'drinks' },
    { id: 'foods', icon: <Utensils size={48} />, labelKey: 'foods' },
    { id: 'football', icon: <Globe size={48} />, labelKey: 'football' },
    { id: 'fruits-and-vegetables', icon: <Apple size={48} />, labelKey: 'fruits-and-vegetables' },
    { id: 'gamers', icon: <Gamepad size={48} />, labelKey: 'gamers' },
    { id: 'geography', icon: <Globe size={48} />, labelKey: 'geography' },
    { id: 'k-pop', icon: <Music size={48} />, labelKey: 'k-pop' },
    { id: 'science', icon: <FlaskConical size={48} />, labelKey: 'science' },
    { id: 'series', icon: <Tv size={48} />, labelKey: 'series' },
    { id: 'spy', icon: <Swords size={48} />, labelKey: 'spy' },
    { id: 'sweets', icon: <Cake size={48} />, labelKey: 'sweets' },
  ],

  // Default (fallback)
  default: [
    { id: 'general', icon: <BrainCircuit size={48} />, labelKey: 'generalKnowledge' },
    { id: 'animals', icon: <PawPrint size={48} />, labelKey: 'animals' },
    { id: 'science', icon: <FlaskConical size={48} />, labelKey: 'science' },
    { id: 'geography', icon: <Globe size={48} />, labelKey: 'geography' },
  ],
};
