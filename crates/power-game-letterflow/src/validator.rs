//! Path and level validation logic

use crate::models::{BoardCell, PathPoint, WordPath};
use serde_json::Value;

/// Validates if a path is continuous (4-directional adjacency)
/// 
/// Returns true if each cell in the path is adjacent to the previous one
pub fn is_path_continuous(path: &[BoardCell]) -> bool {
    if path.len() < 2 {
        return true;
    }
    
    for i in 1..path.len() {
        let prev = &path[i - 1];
        let curr = &path[i];
        
        // Check 4-directional adjacency (not diagonal)
        let dx = (curr.x - prev.x).abs();
        let dy = (curr.y - prev.y).abs();
        
        // Must be exactly one step in one direction
        if !((dx == 1 && dy == 0) || (dx == 0 && dy == 1)) {
            return false;
        }
    }
    
    true
}

/// Check if path forms valid word (start and end have same letter)
pub fn is_valid_word_path(path: &[BoardCell], endpoints: &[PathPoint]) -> bool {
    if path.len() < 2 {
        return false;
    }
    
    let start = &path[0];
    let end = &path[path.len() - 1];
    
    // Check both are endpoints with same letter
    let start_is_endpoint = endpoints.iter().any(|ep| {
        ep.x == start.x && ep.y == start.y && ep.letter == start.letter
    });
    
    let end_is_endpoint = endpoints.iter().any(|ep| {
        ep.x == end.x && ep.y == end.y && ep.letter == end.letter
    });
    
    // Both must be endpoints and letters must match
    start_is_endpoint && end_is_endpoint && start.letter == end.letter
}

/// Get the letter for a completed word path
pub fn get_path_letter(path: &[BoardCell], endpoints: &[PathPoint]) -> Option<String> {
    if path.is_empty() {
        return None;
    }
    
    let start = &path[0];
    endpoints
        .iter()
        .find(|ep| ep.x == start.x && ep.y == start.y)
        .map(|ep| ep.letter.clone())
}

/// Check if two paths overlap (share any cell)
pub fn paths_overlap(path1: &[BoardCell], path2: &[BoardCell]) -> bool {
    path1.iter().any(|cell1| {
        path2.iter().any(|cell2| cell1.x == cell2.x && cell1.y == cell2.y)
    })
}

/// Find all paths that overlap with a given path
pub fn find_overlapping_paths<'a>(
    path: &[BoardCell],
    existing_paths: &'a [WordPath]
) -> Vec<&'a WordPath> {
    existing_paths
        .iter()
        .filter(|wp| paths_overlap(path, &wp.cells))
        .collect()
}

/// Check if solution is complete (all letters connected)
pub fn is_solution_complete(
    found_paths: &[WordPath],
    all_letters: &[String],
) -> bool {
    let connected_letters: std::collections::HashSet<String> = found_paths
        .iter()
        .map(|wp| wp.word.clone())
        .collect();
    
    all_letters.iter().all(|letter| connected_letters.contains(letter))
}

/// WASM-friendly path validation from JSON
pub fn validate_path(path_json: &str, level_json: &str) -> bool {
    let path_value: Value = match serde_json::from_str(path_json) {
        Ok(v) => v,
        Err(_) => return false,
    };
    
    let level_value: Value = match serde_json::from_str(level_json) {
        Ok(v) => v,
        Err(_) => return false,
    };
    
    // Parse path cells
    let path_cells: Vec<BoardCell> = match serde_json::from_value(path_value) {
        Ok(cells) => cells,
        Err(_) => return false,
    };
    
    // Parse level endpoints
    let endpoints: Vec<PathPoint> = level_value
        .get("endpoints")
        .and_then(|e| e.as_array())
        .map(|arr| {
            arr.iter()
                .filter_map(|ep| {
                    Some(PathPoint {
                        x: ep.get("x")?.as_i64()? as i32,
                        y: ep.get("y")?.as_i64()? as i32,
                        letter: ep.get("letter")?.as_str()?.to_string(),
                        color: ep.get("color").and_then(|c| c.as_str()).map(|c| c.to_string()),
                    })
                })
                .collect()
        })
        .unwrap_or_default();
    
    // Validate
    is_path_continuous(&path_cells) && is_valid_word_path(&path_cells, &endpoints)
}

/// WASM-friendly level validation from JSON
pub fn validate_level(level_json: &str) -> bool {
    let value: Value = match serde_json::from_str(level_json) {
        Ok(v) => v,
        Err(_) => return false,
    };
    
    // Check required fields
    let has_id = value.get("id").is_some();
    let has_solution = value.get("solutionWord").is_some() || value.get("solution").is_some();
    let has_endpoints = value.get("endpoints").is_some();
    let has_grid_size = value.get("gridSize").is_some();
    
    has_id && has_solution && has_endpoints && has_grid_size
}

/// WASM-friendly solution checking from JSON
pub fn check_solution(paths_json: &str, solution: &str) -> bool {
    let paths: Vec<WordPath> = match serde_json::from_str(paths_json) {
        Ok(p) => p,
        Err(_) => return false,
    };
    
    // Extract all unique letters from solution
    let all_letters: Vec<String> = solution
        .chars()
        .map(|c| c.to_string())
        .collect::<std::collections::HashSet<_>>()
        .into_iter()
        .collect();
    
    is_solution_complete(&paths, &all_letters)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::BoardCell;
    
    #[test]
    fn test_path_continuity_valid() {
        let path = vec![
            BoardCell { x: 0, y: 0, letter: "A".to_string(), is_used: false, color: None },
            BoardCell { x: 1, y: 0, letter: "B".to_string(), is_used: false, color: None },
            BoardCell { x: 1, y: 1, letter: "C".to_string(), is_used: false, color: None },
        ];
        assert!(is_path_continuous(&path));
    }
    
    #[test]
    fn test_path_continuity_invalid_diagonal() {
        let path = vec![
            BoardCell { x: 0, y: 0, letter: "A".to_string(), is_used: false, color: None },
            BoardCell { x: 1, y: 1, letter: "B".to_string(), is_used: false, color: None },
        ];
        assert!(!is_path_continuous(&path));
    }
    
    #[test]
    fn test_path_continuity_invalid_jump() {
        let path = vec![
            BoardCell { x: 0, y: 0, letter: "A".to_string(), is_used: false, color: None },
            BoardCell { x: 0, y: 2, letter: "B".to_string(), is_used: false, color: None },
        ];
        assert!(!is_path_continuous(&path));
    }
    
    #[test]
    fn test_solution_complete() {
        let paths = vec![
            WordPath {
                word: "A".to_string(),
                cells: vec![],
                start_index: 0,
            },
            WordPath {
                word: "B".to_string(),
                cells: vec![],
                start_index: 0,
            },
        ];
        let all_letters = vec!["A".to_string(), "B".to_string()];
        assert!(is_solution_complete(&paths, &all_letters));
    }
    
    #[test]
    fn test_solution_incomplete() {
        let paths = vec![
            WordPath {
                word: "A".to_string(),
                cells: vec![],
                start_index: 0,
            },
        ];
        let all_letters = vec!["A".to_string(), "B".to_string()];
        assert!(!is_solution_complete(&paths, &all_letters));
    }
    
    #[test]
    fn test_validate_level_valid() {
        let json = r#"{"id": "1", "solutionWord": "HELLO", "gridSize": {"width": 5, "height": 5}, "endpoints": []}"#;
        assert!(validate_level(json));
    }
    
    #[test]
    fn test_validate_level_invalid() {
        let json = r#"{"id": "1"}"#;
        assert!(!validate_level(json));
    }
}
