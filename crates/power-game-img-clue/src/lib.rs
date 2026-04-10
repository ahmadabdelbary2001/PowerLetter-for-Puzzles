pub mod models;

pub use models::*;

// WASM exports for Image Clue game
use wasm_bindgen::prelude::*;
use serde_wasm_bindgen;

/// Parse and validate level collection from JSON
#[wasm_bindgen]
pub fn img_clue_parse_levels(json_data: &str) -> Result<JsValue, JsValue> {
    let collection: LevelCollection = serde_json::from_str(json_data)
        .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;
    serde_wasm_bindgen::to_value(&collection)
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

/// Validate a single level from JSON
#[wasm_bindgen]
pub fn img_clue_validate_level(level_json: &str) -> bool {
    let level: ImageLevel = match serde_json::from_str(level_json) {
        Ok(l) => l,
        Err(_) => return false,
    };
    level.is_valid()
}

/// Get solution length for a level
#[wasm_bindgen]
pub fn img_clue_solution_length(level_json: &str) -> usize {
    let level: ImageLevel = match serde_json::from_str(level_json) {
        Ok(l) => l,
        Err(_) => return 0,
    };
    level.solution_length()
}

/// Create error level (returns JSON)
#[wasm_bindgen]
pub fn img_clue_error_level() -> JsValue {
    let error = ImageLevel::error();
    serde_wasm_bindgen::to_value(&error).unwrap()
}

/// Get all valid levels from collection JSON
#[wasm_bindgen]
pub fn img_clue_get_valid_levels(collection_json: &str) -> Result<JsValue, JsValue> {
    let collection: LevelCollection = serde_json::from_str(collection_json)
        .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;
    let valid: Vec<&ImageLevel> = collection.valid_levels();
    serde_wasm_bindgen::to_value(&valid)
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

/// Get level by ID from collection JSON
#[wasm_bindgen]
pub fn img_clue_get_level_by_id(collection_json: &str, id: &str) -> Result<Option<JsValue>, JsValue> {
    let collection: LevelCollection = serde_json::from_str(collection_json)
        .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;
    match collection.get_by_id(id) {
        Some(level) => {
            let js_val = serde_wasm_bindgen::to_value(level)
                .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))?;
            Ok(Some(js_val))
        }
        None => Ok(None),
    }
}
