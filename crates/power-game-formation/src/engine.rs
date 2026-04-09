//! Core engine logic for Formation game

use crate::models::{FormationLevel, GridCell};
use rand::seq::SliceRandom;
use rand::thread_rng;

/// Formation game engine
pub struct FormationEngine;

impl FormationEngine {
    /// Create new engine instance
    pub fn new() -> Self {
        Self
    }

    /// Shuffle letters for display
    pub fn shuffle_letters(&self, letters: &str) -> Vec<String> {
        let mut chars: Vec<char> = letters.chars().collect();
        let mut rng = thread_rng();
        chars.shuffle(&mut rng);
        chars.into_iter().map(|c| c.to_string()).collect()
    }

    /// Get grid dimensions
    pub fn get_grid_size(&self, grid: &[GridCell]) -> (u32, u32) {
        if grid.is_empty() {
            return (0, 0);
        }
        let max_x = grid.iter().map(|c| c.x).max().unwrap_or(0);
        let max_y = grid.iter().map(|c| c.y).max().unwrap_or(0);
        (max_x + 1, max_y + 1)
    }

    /// Find cell at position
    pub fn find_cell<'a>(&self, grid: &'a [GridCell], x: u32, y: u32) -> Option<&'a GridCell> {
        grid.iter().find(|c| c.x == x && c.y == y)
    }
}

impl Default for FormationEngine {
    fn default() -> Self {
        Self::new()
    }
}

/// Generate shuffled letters from base string
pub fn generate_letters(base_letters: &str) -> Vec<String> {
    if base_letters.is_empty() {
        return vec![];
    }
    let mut chars: Vec<char> = base_letters.chars().collect();
    let mut rng = thread_rng();
    chars.shuffle(&mut rng);
    chars.into_iter().map(|c| c.to_string()).collect()
}
