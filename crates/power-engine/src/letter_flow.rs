use crate::{GameEngine, GameType, error::EngineResult, models::BoardCell};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

/// Letter Flow game engine implementation.
/// 
/// **Why**: Handles board generation and path validation for the Letter Flow game.
/// It uses a square grid approach by default.
pub struct LetterFlowEngine;

impl GameEngine for LetterFlowEngine {
    fn get_game_type(&self) -> GameType {
        GameType::LetterFlow
    }

    /// Validates if the level data contains minimum required fields.
    fn validate_level(&self, level_data: &serde_json::Value) -> bool {
        level_data.get("board").is_some() && level_data.get("solution").is_some()
    }
}

/// Generates a square game board from a string of letters.
/// 
/// **How**: Calculates the square root of the letter count, rounding up,
/// to determine the grid size (N x N), then fills the grid row by row.
#[wasm_bindgen]
pub fn letter_flow_generate_board(letters: &str) -> JsValue {
    let mut board = Vec::new();
    let chars: Vec<char> = letters.chars().collect();
    
    // Board size is Ceiling(sqrt(letter_count))
    let size = (chars.len() as f64).sqrt().ceil() as i32;

    for y in 0..size {
        for x in 0..size {
            let index = (y * size + x) as usize;
            if index < chars.len() {
                board.push(BoardCell {
                    x,
                    y,
                    letter: chars[index].to_string(),
                    is_used: false,
                    color: None,
                });
            }
        }
    }
    
    serde_wasm_bindgen::to_value(&board).unwrap()
}

/// High-level function to validate a Letter Flow level JSON string.
#[wasm_bindgen]
pub fn letter_flow_validate(level_json: &str) -> bool {
    let level_data: serde_json::Value = serde_json::from_str(level_json).unwrap_or(serde_json::Value::Null);
    let engine = LetterFlowEngine;
    engine.validate_level(&level_data)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_board_generation_square() {
        // 4 letters should give a 2x2 board
        let letters = "ABCD";
        let board_val = letter_flow_generate_board(letters);
        let board: Vec<BoardCell> = serde_wasm_bindgen::from_value(board_val).unwrap();
        
        assert_eq!(board.len(), 4);
        assert_eq!(board[0].letter, "A");
        assert_eq!(board[1].x, 1);
        assert_eq!(board[1].y, 0);
        assert_eq!(board[2].x, 0);
        assert_eq!(board[2].y, 1);
    }

    #[test]
    fn test_board_generation_irregular() {
        // 3 letters should still give a 2x2 board (size 2)
        let letters = "ABC";
        let board_val = letter_flow_generate_board(letters);
        let board: Vec<BoardCell> = serde_wasm_bindgen::from_value(board_val).unwrap();
        
        assert_eq!(board.len(), 3);
        assert_eq!(board[2].letter, "C");
        assert_eq!(board[2].x, 0);
        assert_eq!(board[2].y, 1);
    }

    #[test]
    fn test_level_validation_success() {
        let json = r#"{"board": [], "solution": "HELLO"}"#;
        assert!(letter_flow_validate(json));
    }

    #[test]
    fn test_level_validation_failure() {
        let json = r#"{"id": "123"}"#; // Missing board and solution
        assert!(!letter_flow_validate(json));
    }
}
