//! Round management and scoring logic

use crate::models::{RoundConfig, RoundResult, VoteRecord};
use std::collections::HashMap;

/// Manages a single round of the Outsider game
#[derive(Debug, Clone)]
pub struct RoundManager {
    config: RoundConfig,
    votes: VoteRecord,
    current_turn: usize,
}

impl RoundManager {
    /// Create a new round manager
    pub fn new(config: RoundConfig) -> Self {
        Self {
            config,
            votes: VoteRecord::default(),
            current_turn: 0,
        }
    }
    
    /// Get the round configuration
    pub fn config(&self) -> &RoundConfig {
        &self.config
    }
    
    /// Record a vote
    pub fn record_vote(&mut self, voter_id: u32, voted_for_id: u32) {
        self.votes.votes.push((voter_id, voted_for_id));
    }
    
    /// Check if a player has voted
    pub fn has_voted(&self, voter_id: u32) -> bool {
        self.votes.votes.iter().any(|(v, _)| *v == voter_id)
    }
    
    /// Get current vote count
    pub fn vote_count(&self) -> usize {
        self.votes.votes.len()
    }
    
    /// Calculate vote tally (excluding outsider votes)
    pub fn calculate_tally(&self) -> HashMap<u32, u32> {
        let mut tally: HashMap<u32, u32> = HashMap::new();
        
        for (voter_id, voted_for_id) in &self.votes.votes {
            // Outsider doesn't vote in tally
            if *voter_id != self.config.outsider_id {
                *tally.entry(*voted_for_id).or_insert(0) += 1;
            }
        }
        
        tally
    }
    
    /// Determine who was voted out
    pub fn determine_voted_player(&self) -> Option<u32> {
        let tally = self.calculate_tally();
        
        if tally.is_empty() {
            return None;
        }
        
        tally.into_iter()
            .max_by_key(|(_, count)| *count)
            .map(|(player_id, _)| player_id)
    }
    
    /// Check if outsider's guess is correct
    pub fn check_outsider_guess(&self, guess: &str) -> bool {
        guess.to_lowercase() == self.config.secret.to_lowercase()
    }
    
    /// Calculate final scores
    pub fn calculate_scores(&self, voted_player_id: Option<u32>, outsider_guess: &str) -> Vec<(u32, i32)> {
        let mut scores: Vec<(u32, i32)> = Vec::new();
        let outsider_guessed_correctly = self.check_outsider_guess(outsider_guess);
        
        // Award points to outsider if guessed correctly
        if outsider_guessed_correctly {
            scores.push((self.config.outsider_id, 10));
        }
        
        // Award points to players who correctly identified the outsider
        for (voter_id, voted_for_id) in &self.votes.votes {
            if *voter_id != self.config.outsider_id && *voted_for_id == self.config.outsider_id {
                scores.push((*voter_id, 10));
            }
        }
        
        scores
    }
    
    /// Finish the round and get result
    pub fn finish_round(&self, outsider_guess: &str) -> RoundResult {
        let voted_player_id = self.determine_voted_player();
        let outsider_guessed_correctly = self.check_outsider_guess(outsider_guess);
        let points_awarded = self.calculate_scores(voted_player_id, outsider_guess);
        
        RoundResult {
            voted_player_id,
            outsider_guessed_correctly,
            points_awarded,
        }
    }
    
    /// Advance to next turn
    pub fn next_turn(&mut self) {
        self.current_turn += 1;
    }
    
    /// Get current turn number
    pub fn current_turn(&self) -> usize {
        self.current_turn
    }
    
    /// Check if all players have voted (except outsider)
    pub fn all_players_voted(&self) -> bool {
        let expected_votes = self.config.player_ids.len().saturating_sub(1);
        let actual_votes = self.votes.votes.iter()
            .filter(|(voter_id, _)| *voter_id != self.config.outsider_id)
            .count();
        actual_votes >= expected_votes
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_config() -> RoundConfig {
        RoundConfig {
            category: "animals".to_string(),
            secret: "lion".to_string(),
            words: vec!["lion".to_string(), "tiger".to_string(), "bear".to_string()],
            outsider_id: 3,
            player_ids: vec![1, 2, 3, 4, 5],
        }
    }

    #[test]
    fn test_record_vote() {
        let config = create_test_config();
        let mut manager = RoundManager::new(config);
        
        manager.record_vote(1, 3); // Player 1 votes for outsider (3)
        assert!(manager.has_voted(1));
        assert!(!manager.has_voted(2));
        assert_eq!(manager.vote_count(), 1);
    }

    #[test]
    fn test_calculate_tally() {
        let config = create_test_config();
        let mut manager = RoundManager::new(config);
        
        // Insiders voting
        manager.record_vote(1, 3); // Vote for outsider
        manager.record_vote(2, 3); // Vote for outsider
        manager.record_vote(4, 2); // Vote for player 2
        manager.record_vote(5, 3); // Vote for outsider
        
        let tally = manager.calculate_tally();
        assert_eq!(tally.get(&3), Some(&3)); // Outsider got 3 votes
        assert_eq!(tally.get(&2), Some(&1)); // Player 2 got 1 vote
    }

    #[test]
    fn test_determine_voted_player() {
        let config = create_test_config();
        let mut manager = RoundManager::new(config);
        
        manager.record_vote(1, 3);
        manager.record_vote(2, 3);
        manager.record_vote(4, 2);
        
        let voted = manager.determine_voted_player();
        assert_eq!(voted, Some(3));
    }

    #[test]
    fn test_check_outsider_guess_correct() {
        let config = create_test_config();
        let manager = RoundManager::new(config);
        
        assert!(manager.check_outsider_guess("lion"));
        assert!(manager.check_outsider_guess("LION"));
    }

    #[test]
    fn test_check_outsider_guess_incorrect() {
        let config = create_test_config();
        let manager = RoundManager::new(config);
        
        assert!(!manager.check_outsider_guess("tiger"));
    }

    #[test]
    fn test_calculate_scores_outsider_wins() {
        let config = create_test_config();
        let mut manager = RoundManager::new(config);
        
        // Outsider (3) guessed correctly
        let scores = manager.calculate_scores(Some(3), "lion");
        
        // Outsider should get 10 points
        assert!(scores.iter().any(|(id, points)| *id == 3 && *points == 10));
    }

    #[test]
    fn test_calculate_scores_insiders_win() {
        let config = create_test_config();
        let mut manager = RoundManager::new(config);
        
        // Players correctly identify outsider
        manager.record_vote(1, 3);
        manager.record_vote(2, 3);
        manager.record_vote(4, 2); // Wrong vote
        
        // Outsider guesses wrong
        let scores = manager.calculate_scores(Some(3), "wrong");
        
        // Players 1 and 2 should get points for correct identification
        assert!(scores.iter().any(|(id, points)| *id == 1 && *points == 10));
        assert!(scores.iter().any(|(id, points)| *id == 2 && *points == 10));
    }

    #[test]
    fn test_all_players_voted() {
        let config = create_test_config();
        let mut manager = RoundManager::new(config);
        
        // 5 players, outsider (3) doesn't vote -> 4 votes needed
        assert!(!manager.all_players_voted());
        
        manager.record_vote(1, 3);
        manager.record_vote(2, 3);
        manager.record_vote(4, 3);
        manager.record_vote(5, 3);
        
        assert!(manager.all_players_voted());
    }

    #[test]
    fn test_finish_round() {
        let config = create_test_config();
        let mut manager = RoundManager::new(config);
        
        manager.record_vote(1, 3);
        manager.record_vote(2, 3);
        manager.record_vote(4, 3);
        manager.record_vote(5, 3);
        
        let result = manager.finish_round("wrong");
        
        assert_eq!(result.voted_player_id, Some(3));
        assert!(!result.outsider_guessed_correctly);
    }
}
