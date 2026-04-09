//! Data models for Formation game

use serde::{Deserialize, Serialize};

/// A single cell in the crossword grid
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct GridCell {
    pub x: u32,
    pub y: u32,
    pub letter: String,
    pub words: Vec<usize>,
}

/// A word placement on the grid
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WordPlacement {
    pub word: String,
    pub start_x: u32,
    pub start_y: u32,
    pub direction: Direction,
}

/// Direction of word placement
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Direction {
    Horizontal,
    Vertical,
}

/// Complete formation level
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FormationLevel {
    pub id: String,
    pub difficulty: String,
    pub words: Vec<String>,
    pub grid: Vec<GridCell>,
    pub base_letters: String,
    pub solution: String,
}

impl FormationLevel {
    pub fn grid_width(&self) -> u32 {
        self.grid.iter().map(|c| c.x).max().unwrap_or(0) + 1
    }

    pub fn grid_height(&self) -> u32 {
        self.grid.iter().map(|c| c.y).max().unwrap_or(0) + 1
    }
}
