//! Core engine logic for the Outsider game

use crate::models::{OutsiderLevel, RoundConfig};
use rand::seq::SliceRandom;

/// Main engine for the Outsider game
#[derive(Debug, Clone, Default)]
pub struct OutsiderEngine;

impl OutsiderEngine {
    /// Create a new engine instance
    pub fn new() -> Self {
        Self
    }
    
    /// Select random words from a level for a round
    pub fn select_words(&self, level: &OutsiderLevel, count: usize) -> Vec<String> {
        if level.words.len() <= count {
            return level.words.clone();
        }
        
        let mut rng = rand::thread_rng();
        let mut indices: Vec<usize> = (0..level.words.len()).collect();
        indices.shuffle(&mut rng);
        
        indices.into_iter()
            .take(count)
            .map(|i| level.words[i].clone())
            .collect()
    }
    
    /// Select a secret word from the selected words
    pub fn select_secret(&self, words: &[String]) -> Option<String> {
        words.first().cloned()
    }
    
    /// Assign outsider role randomly
    pub fn assign_outsider(&self, player_ids: &[u32]) -> Option<u32> {
        if player_ids.is_empty() {
            return None;
        }
        
        let mut rng = rand::thread_rng();
        player_ids.choose(&mut rng).copied()
    }
    
    /// Create round configuration
    pub fn create_round(
        &self,
        level: &OutsiderLevel,
        player_ids: Vec<u32>,
        word_count: usize,
    ) -> Option<RoundConfig> {
        if player_ids.len() < 3 {
            return None;
        }
        
        if !level.has_enough_words(word_count) {
            return None;
        }
        
        let words = self.select_words(level, word_count);
        let secret = self.select_secret(&words)?;
        let outsider_id = self.assign_outsider(&player_ids)?;
        
        Some(RoundConfig {
            category: level.category.clone(),
            secret,
            words,
            outsider_id,
            player_ids,
        })
    }
    
    /// Shuffle players for question order
    pub fn shuffle_players(&self, player_ids: &[u32]) -> Vec<u32> {
        let mut rng = rand::thread_rng();
        let mut shuffled = player_ids.to_vec();
        shuffled.shuffle(&mut rng);
        shuffled
    }
    
    /// Create question pairs (asker -> askee)
    pub fn create_question_pairs(&self, player_ids: &[u32]) -> Vec<(u32, u32)> {
        if player_ids.len() < 2 {
            return vec![];
        }
        
        let shuffled = self.shuffle_players(player_ids);
        let mut pairs = Vec::new();
        
        for i in 0..shuffled.len() {
            let asker = shuffled[i];
            let askee = shuffled[(i + 1) % shuffled.len()];
            pairs.push((asker, askee));
        }
        
        pairs
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_level() -> OutsiderLevel {
        OutsiderLevel::new(
            "test-1".to_string(),
            "en".to_string(),
            "animals".to_string(),
            vec![
                "cat".to_string(),
                "dog".to_string(),
                "bird".to_string(),
                "fish".to_string(),
                "lion".to_string(),
                "tiger".to_string(),
                "bear".to_string(),
                "wolf".to_string(),
                "fox".to_string(),
                "elephant".to_string(),
            ],
        ).unwrap()
    }

    #[test]
    fn test_select_words() {
        let engine = OutsiderEngine::new();
        let level = create_test_level();
        
        let selected = engine.select_words(&level, 5);
        assert_eq!(selected.len(), 5);
        
        // All selected words should be from the original list
        for word in &selected {
            assert!(level.words.contains(word));
        }
    }

    #[test]
    fn test_select_secret() {
        let engine = OutsiderEngine::new();
        let words = vec!["secret".to_string(), "other".to_string()];
        
        let secret = engine.select_secret(&words);
        assert_eq!(secret, Some("secret".to_string()));
    }

    #[test]
    fn test_assign_outsider() {
        let engine = OutsiderEngine::new();
        let players = vec![1, 2, 3, 4, 5];
        
        let outsider = engine.assign_outsider(&players);
        assert!(outsider.is_some());
        assert!(players.contains(&outsider.unwrap()));
    }

    #[test]
    fn test_create_round() {
        let engine = OutsiderEngine::new();
        let level = create_test_level();
        let players = vec![1, 2, 3, 4];
        
        let round = engine.create_round(&level, players.clone(), 8);
        assert!(round.is_some());
        
        let round = round.unwrap();
        assert_eq!(round.words.len(), 8);
        assert!(players.contains(&round.outsider_id));
    }

    #[test]
    fn test_create_round_not_enough_players() {
        let engine = OutsiderEngine::new();
        let level = create_test_level();
        let players = vec![1, 2]; // Only 2 players
        
        let round = engine.create_round(&level, players, 8);
        assert!(round.is_none());
    }

    #[test]
    fn test_create_question_pairs() {
        let engine = OutsiderEngine::new();
        let players = vec![1, 2, 3, 4];
        
        let pairs = engine.create_question_pairs(&players);
        assert_eq!(pairs.len(), 4); // Same number as players
        
        // Each player should be an asker exactly once
        let askers: Vec<u32> = pairs.iter().map(|(a, _)| *a).collect();
        assert_eq!(askers.len(), 4);
    }
}
