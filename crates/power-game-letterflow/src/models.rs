//! Core data models for Letter Flow game

use serde::{Deserialize, Serialize};

/// Represents a single cell on the game board
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct BoardCell {
    pub x: i32,
    pub y: i32,
    pub letter: String,
    #[serde(rename = "isUsed")]
    pub is_used: bool,
    pub color: Option<String>,
}

/// Represents a point/endpoint on the board
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PathPoint {
    pub x: i32,
    pub y: i32,
    pub letter: String,
    pub color: Option<String>,
}

/// A complete word path formed by connected cells
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct WordPath {
    pub word: String,
    pub cells: Vec<BoardCell>,
    #[serde(rename = "startIndex")]
    pub start_index: usize,
}

/// Represents a Letter Flow game level
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LetterFlowLevel {
    pub id: String,
    pub difficulty: String,
    pub words: Vec<String>,
    pub board: Vec<BoardCell>,
    pub solution: String,
    pub endpoints: Vec<PathPoint>,
}

/// Grid dimensions for a level
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct GridSize {
    pub width: i32,
    pub height: i32,
}

/// Difficulty levels
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum Difficulty {
    Easy,
    Medium,
    Hard,
}

impl std::fmt::Display for Difficulty {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Difficulty::Easy => write!(f, "easy"),
            Difficulty::Medium => write!(f, "medium"),
            Difficulty::Hard => write!(f, "hard"),
        }
    }
}
