use wasm_bindgen::prelude::*;
use power_game_letterflow::{
    generate_board, validate_path, validate_level, check_solution,
};
use power_game_img_clue::{
    img_clue_parse_levels, img_clue_validate_level, img_clue_solution_length,
    img_clue_error_level, img_clue_get_valid_levels, img_clue_get_level_by_id,
};

// ============================================================================
// Letter Flow Game
// ============================================================================

/// 1. Board Generation
#[wasm_bindgen]
pub fn letter_flow_generate_board(letters: &str) -> JsValue {
    let board = generate_board(letters);
    serde_wasm_bindgen::to_value(&board).unwrap()
}

/// 2. Path Validation
#[wasm_bindgen]
pub fn letter_flow_validate_path_json(path_json: &str, level_json: &str) -> bool {
    validate_path(path_json, level_json)
}

/// 3. Level Validation
#[wasm_bindgen]
pub fn letter_flow_validate_level(level_json: &str) -> bool {
    validate_level(level_json)
}

/// 4. Solution Check
#[wasm_bindgen]
pub fn letter_flow_check_solution(paths_json: &str, solution: &str) -> bool {
    check_solution(paths_json, solution)
}

// ============================================================================
// Image Clue Game
// ============================================================================

/// Parse level collection from JSON
#[wasm_bindgen]
pub fn image_clue_parse_levels(json_data: &str) -> Result<JsValue, JsValue> {
    img_clue_parse_levels(json_data)
}

/// Validate a single level from JSON
#[wasm_bindgen]
pub fn image_clue_validate_level(level_json: &str) -> bool {
    img_clue_validate_level(level_json)
}

/// Get solution length for a level
#[wasm_bindgen]
pub fn image_clue_solution_length(level_json: &str) -> usize {
    img_clue_solution_length(level_json)
}

/// Create error level
#[wasm_bindgen]
pub fn image_clue_error_level() -> JsValue {
    img_clue_error_level()
}

/// Get all valid levels from collection JSON
#[wasm_bindgen]
pub fn image_clue_get_valid_levels(collection_json: &str) -> Result<JsValue, JsValue> {
    img_clue_get_valid_levels(collection_json)
}

/// Get level by ID from collection JSON
#[wasm_bindgen]
pub fn image_clue_get_level_by_id(collection_json: &str, id: &str) -> Result<Option<JsValue>, JsValue> {
    img_clue_get_level_by_id(collection_json, id)
}
