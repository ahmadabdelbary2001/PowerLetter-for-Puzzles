//! Data models for the Outsider game

use serde::{Deserialize, Serialize};

/// Represents a level/category in the Outsider game
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutsiderLevel {
    pub id: String,
    pub language: String,
    pub category: String,
    pub words: Vec<String>,
    pub solution: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub meta: Option<serde_json::Value>,
}

/// Player role in the game
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum PlayerRole {
    Insider,
    Outsider,
}

/// Configuration for a game round
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RoundConfig {
    pub category: String,
    pub secret: String,
    pub words: Vec<String>,
    pub outsider_id: u32,
    pub player_ids: Vec<u32>,
}

/// Vote record
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct VoteRecord {
    pub votes: Vec<(u32, u32)>, // (voter_id, voted_for_id)
}

/// Round result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RoundResult {
    pub voted_player_id: Option<u32>,
    pub outsider_guessed_correctly: bool,
    pub points_awarded: Vec<(u32, i32)>, // (player_id, points)
}

impl OutsiderLevel {
    /// Create a new level with validation
    pub fn new(
        id: String,
        language: String,
        category: String,
        words: Vec<String>,
    ) -> Option<Self> {
        if words.is_empty() {
            return None;
        }
        
        let solution = words.first()?.clone();
        
        Some(Self {
            id,
            language,
            category,
            words,
            solution,
            meta: None,
        })
    }
    
    /// Check if level has enough words for a round
    pub fn has_enough_words(&self, min_count: usize) -> bool {
        self.words.len() >= min_count
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_outsider_level_creation() {
        let level = OutsiderLevel::new(
            "test-1".to_string(),
            "en".to_string(),
            "general".to_string(),
            vec!["apple".to_string(), "banana".to_string(), "cherry".to_string()],
        );
        
        assert!(level.is_some());
        let level = level.unwrap();
        assert_eq!(level.solution, "apple");
        assert!(level.has_enough_words(2));
        assert!(!level.has_enough_words(5));
    }

    #[test]
    fn test_outsider_level_empty_words() {
        let level = OutsiderLevel::new(
            "test-1".to_string(),
            "en".to_string(),
            "general".to_string(),
            vec![],
        );
        
        assert!(level.is_none());
    }
}
