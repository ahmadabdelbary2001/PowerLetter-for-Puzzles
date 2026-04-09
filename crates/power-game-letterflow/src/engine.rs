//! Letter Flow Game Engine Core

use crate::models::{BoardCell, LetterFlowLevel, PathPoint, GridSize};
use serde_json::Value;

/// Main engine struct for Letter Flow game
pub struct LetterFlowEngine;

impl LetterFlowEngine {
    /// Validates level data has required fields
    pub fn validate_level_data(level_data: &Value) -> bool {
        level_data.get("board").is_some() && 
        level_data.get("solution").is_some()
    }
    
    /// Extract grid size from level data
    pub fn extract_grid_size(level_data: &Value) -> Option<GridSize> {
        let grid_size = level_data.get("gridSize")?;
        let width = grid_size.get("width")?.as_i64()? as i32;
        let height = grid_size.get("height")?.as_i64()? as i32;
        Some(GridSize { width, height })
    }
}

/// Generates a square game board from a string of letters
/// 
/// Calculates the square root of the letter count, rounding up,
/// to determine the grid size (N x N), then fills the grid row by row.
pub fn generate_board(letters: &str) -> Vec<BoardCell> {
    let chars: Vec<char> = letters.chars().collect();
    
    // Board size is Ceiling(sqrt(letter_count))
    let size = (chars.len() as f64).sqrt().ceil() as i32;
    let mut board = Vec::with_capacity(chars.len());

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

    board
}

/// Generate HSL color for index with even distribution
pub fn hsl_for_index(index: usize, total: usize, saturation: u8, lightness: u8) -> String {
    if total == 0 {
        return format!("hsl(0, {}%, {}%)", saturation, lightness);
    }
    let hue = ((index * 360) / total) % 360;
    let adjusted_lightness = if lightness > 50 { 
        (lightness as f32 * 0.9) as u8 
    } else { 
        (lightness as f32 * 1.1) as u8 
    };
    format!("hsl({}, {}%, {}%)", hue, saturation, adjusted_lightness)
}

/// Assign colors to endpoints based on their letters
pub fn assign_endpoint_colors(endpoints: &[PathPoint]) -> Vec<PathPoint> {
    let unique_letters: Vec<String> = endpoints
        .iter()
        .map(|e| e.letter.clone())
        .collect::<std::collections::HashSet<_>>()
        .into_iter()
        .collect();
    
    let letter_to_color: std::collections::HashMap<String, String> = unique_letters
        .iter()
        .enumerate()
        .map(|(idx, letter)| {
            let color = hsl_for_index(idx, unique_letters.len(), 72, 48);
            (letter.clone(), color)
        })
        .collect();
    
    endpoints
        .iter()
        .map(|ep| PathPoint {
            x: ep.x,
            y: ep.y,
            letter: ep.letter.clone(),
            color: letter_to_color.get(&ep.letter).cloned(),
        })
        .collect()
}

/// Build board from level data with endpoints
pub fn build_board_from_level(level_data: &Value) -> Option<Vec<BoardCell>> {
    let grid_size = LetterFlowEngine::extract_grid_size(level_data)?;
    let width = grid_size.width;
    let height = grid_size.height;
    
    // Initialize empty board
    let mut board: Vec<BoardCell> = (0..width * height)
        .map(|i| BoardCell {
            x: i % width,
            y: i / width,
            letter: String::new(),
            is_used: false,
            color: None,
        })
        .collect();
    
    // Place endpoints
    let endpoints = level_data.get("endpoints")?;
    for endpoint in endpoints.as_array()? {
        let x = endpoint.get("x")?.as_i64()? as i32;
        let y = endpoint.get("y")?.as_i64()? as i32;
        let letter = endpoint.get("letter")?.as_str()?;
        let color = endpoint.get("color").and_then(|c| c.as_str());
        
        let index = (y * width + x) as usize;
        if index < board.len() {
            board[index].letter = letter.to_string();
            board[index].color = color.map(|c| c.to_string());
        }
    }
    
    Some(board)
}

/// Create error level when loading fails
pub fn create_error_level() -> LetterFlowLevel {
    LetterFlowLevel {
        id: "error".to_string(),
        difficulty: "easy".to_string(),
        words: vec![],
        board: vec![],
        solution: String::new(),
        endpoints: vec![],
    }
}

/// Parse and validate level from JSON
pub fn parse_level(level_json: &str) -> Option<LetterFlowLevel> {
    let value: Value = serde_json::from_str(level_json).ok()?;
    
    let id = value.get("id")?.as_str()?.to_string();
    let difficulty = value.get("difficulty")
        .and_then(|d| d.as_str())
        .unwrap_or("easy")
        .to_string();
    let solution = value.get("solutionWord")
        .or_else(|| value.get("solution"))?
        .as_str()?
        .to_string();
    
    let board = build_board_from_level(&value)?;
    
    // Extract endpoints
    let endpoints: Vec<PathPoint> = value
        .get("endpoints")?
        .as_array()?
        .iter()
        .filter_map(|ep| {
            Some(PathPoint {
                x: ep.get("x")?.as_i64()? as i32,
                y: ep.get("y")?.as_i64()? as i32,
                letter: ep.get("letter")?.as_str()?.to_string(),
                color: ep.get("color").and_then(|c| c.as_str()).map(|c| c.to_string()),
            })
        })
        .collect();
    
    let words = vec![solution.clone()];
    
    Some(LetterFlowLevel {
        id,
        difficulty,
        words,
        board,
        solution,
        endpoints: assign_endpoint_colors(&endpoints),
    })
}
