// src/domain/outside-story/repository/LevelRepository.ts
/**
 * @description Repository for loading Outside the Story levels.
 * Uses static imports for Webpack/Vite compatibility.
 */

import type { Language, GameCategory } from '@/types/game';
import type { OutsiderLevel, OutsiderLevelData } from '../model';
import { ERROR_LEVEL } from '../model';

// Static imports for all supported categories
import animalsData from "@/data/levels/ar/outside-the-story/animals.json";
import animeData from "@/data/levels/ar/outside-the-story/anime.json";
import carsData from "@/data/levels/ar/outside-the-story/cars.json";
import cartoonsData from "@/data/levels/ar/outside-the-story/cartoons.json";
import charactersData from "@/data/levels/ar/outside-the-story/characters.json";
import clothesData from "@/data/levels/ar/outside-the-story/clothes.json";
import drinksData from "@/data/levels/ar/outside-the-story/drinks.json";
import foodsData from "@/data/levels/ar/outside-the-story/foods.json";
import footballData from "@/data/levels/ar/outside-the-story/football.json";
import fruitsVegData from "@/data/levels/ar/outside-the-story/fruits-and-vegetables.json";
import geographyData from "@/data/levels/ar/outside-the-story/geography.json";
import kpopData from "@/data/levels/ar/outside-the-story/k-pop.json";
import scienceData from "@/data/levels/ar/outside-the-story/science.json";
import spyData from "@/data/levels/ar/outside-the-story/spy.json";
import sweetsData from "@/data/levels/ar/outside-the-story/sweets.json";

const levelMap: Record<string, OutsiderLevelData> = {
  animals: animalsData as OutsiderLevelData,
  anime: animeData as OutsiderLevelData,
  cars: carsData as OutsiderLevelData,
  cartoons: cartoonsData as OutsiderLevelData,
  characters: charactersData as OutsiderLevelData,
  clothes: clothesData as OutsiderLevelData,
  drinks: drinksData as OutsiderLevelData,
  foods: foodsData as OutsiderLevelData,
  football: footballData as OutsiderLevelData,
  'fruits-and-vegetables': fruitsVegData as OutsiderLevelData,
  geography: geographyData as OutsiderLevelData,
  'k-pop': kpopData as OutsiderLevelData,
  science: scienceData as OutsiderLevelData,
  spy: spyData as OutsiderLevelData,
  sweets: sweetsData as OutsiderLevelData,
};

/**
 * Level Repository - handles loading of outside-the-story categories
 */
export class LevelRepository {
  private cache: Map<string, OutsiderLevel[]> = new Map();

  /**
   * Load levels for given categories
   */
  async loadLevels(
    language: Language,
    categories: GameCategory[]
  ): Promise<OutsiderLevel[]> {
    const cacheKey = `${language}-${categories.join(',')}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const results: OutsiderLevel[] = [];

    for (const cat of categories) {
      const level = this.loadCategory(language, cat);
      if (level) {
        results.push(level);
      }
    }

    if (results.length === 0) {
      return [ERROR_LEVEL];
    }

    this.cache.set(cacheKey, results);
    return results;
  }

  /**
   * Load a single category
   */
  private loadCategory(language: Language, category: GameCategory): OutsiderLevel | null {
    // For now only Arabic is supported
    if (language !== 'ar') {
      console.warn(`Language ${language} not supported for outside-the-story, falling back to Arabic`);
    }

    let data = levelMap[category];
    if (!data) {
      console.warn(`Category ${category} not found for outside-the-story, falling back to 'animals'`);
      data = levelMap['animals'];
    }

    if (!data) {
      // Final fallback if animals is also missing
      data = Object.values(levelMap)[0];
    }

    if (!data) {
      console.warn(`No categories found for outside-the-story`);
      return null;
    }

    if (!data.words || data.words.length === 0) {
      console.warn(`Category ${category} has no words`);
      return null;
    }

    return {
      id: `${language}-${category}`,
      language,
      category,
      words: data.words.map(String),
      solution: data.words[0],
      meta: data.meta ?? {},
    };
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const levelRepository = new LevelRepository();
