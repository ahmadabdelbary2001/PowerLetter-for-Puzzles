//! Validation logic for Formation game

use crate::models::FormationLevel;
use std::collections::HashSet;

/// Validate if a word exists in the level's word list
pub fn validate_word(word: &str, level: &FormationLevel) -> bool {
    let normalized = word.trim().to_lowercase();
    level.words.iter().any(|w| w.to_lowercase() == normalized)
}

/// Check if input word can be formed from available letters
pub fn can_form_word(input: &str, available_letters: &[String]) -> bool {
    let input_chars: Vec<char> = input.chars().collect();
    let mut available: Vec<char> = available_letters
        .iter()
        .map(|s| s.chars().next().unwrap_or('\0'))
        .collect();

    for ch in input_chars {
        let pos = available.iter().position(|&c| c == ch);
        match pos {
            Some(idx) => {
                available.remove(idx);
            }
            None => return false,
        }
    }
    true
}

/// Validate level JSON structure
pub fn validate_level(level_json: &str) -> bool {
    let result: Result<FormationLevel, _> = serde_json::from_str(level_json);
    if let Ok(level) = result {
        !level.id.is_empty()
            && !level.words.is_empty()
            && !level.grid.is_empty()
            && !level.base_letters.is_empty()
    } else {
        false
    }
}

/// Check if solution is complete (all words found)
pub fn check_solution_complete(found_words: &[String], level: &FormationLevel) -> bool {
    if found_words.len() != level.words.len() {
        return false;
    }
    let found_set: HashSet<String> = found_words
        .iter()
        .map(|w| w.to_lowercase())
        .collect();
    let required_set: HashSet<String> = level
        .words
        .iter()
        .map(|w| w.to_lowercase())
        .collect();
    found_set == required_set
}

/// Get revealed cells for found words
pub fn get_revealed_cells(found_words: &[String], level: &FormationLevel) -> Vec<String> {
    let found_indices: HashSet<usize> = found_words
        .iter()
        .filter_map(|fw| {
            level.words.iter().position(|w| w.to_lowercase() == fw.to_lowercase())
        })
        .collect();

    let mut revealed = HashSet::new();

    for cell in &level.grid {
        for word_idx in &cell.words {
            if found_indices.contains(word_idx) {
                revealed.insert(format!("{},{}" , cell.x, cell.y));
            }
        }
    }

    revealed.into_iter().collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::GridCell;

    fn create_test_level() -> FormationLevel {
        FormationLevel {
            id: "test-1".to_string(),
            difficulty: "easy".to_string(),
            words: vec!["نور".to_string(), "رنين".to_string()],
            grid: vec![
                GridCell {
                    x: 0,
                    y: 0,
                    letter: "ن".to_string(),
                    words: vec![0, 1],
                },
                GridCell {
                    x: 1,
                    y: 0,
                    letter: "و".to_string(),
                    words: vec![0],
                },
            ],
            base_letters: "نورين".to_string(),
            solution: "نور".to_string(),
        }
    }

    #[test]
    fn test_validate_word_valid() {
        let level = create_test_level();
        assert!(validate_word("نور", &level));
    }

    #[test]
    fn test_validate_word_invalid() {
        let level = create_test_level();
        assert!(!validate_word("كلمة", &level));
    }

    #[test]
    fn test_can_form_word_valid() {
        let letters = vec!["ن".to_string(), "و".to_string(), "ر".to_string()];
        assert!(can_form_word("نور", &letters));
    }

    #[test]
    fn test_can_form_word_invalid() {
        let letters = vec!["ن".to_string(), "و".to_string()];
        assert!(!can_form_word("نور", &letters));
    }

    #[test]
    fn test_validate_level_valid() {
        let level = create_test_level();
        let json = serde_json::to_string(&level).unwrap();
        assert!(validate_level(&json));
    }

    #[test]
    fn test_validate_level_invalid() {
        assert!(!validate_level("invalid json"));
    }

    #[test]
    fn test_check_solution_complete() {
        let level = create_test_level();
        let found = vec!["نور".to_string(), "رنين".to_string()];
        assert!(check_solution_complete(&found, &level));
    }

    #[test]
    fn test_check_solution_incomplete() {
        let level = create_test_level();
        let found = vec!["نور".to_string()];
        assert!(!check_solution_complete(&found, &level));
    }
}
