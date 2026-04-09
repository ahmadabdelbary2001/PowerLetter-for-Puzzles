use wasm_bindgen::prelude::*;
use power_game_letterflow::{
    generate_board, validate_path, validate_level, check_solution,
};

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
