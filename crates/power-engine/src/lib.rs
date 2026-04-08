use wasm_bindgen::prelude::*;

pub mod error;
pub mod models;
pub mod letter_flow;

use crate::error::EngineResult;
use crate::models::{GameType};

/// Basic trait that defines the interface for any game logic provider.
pub trait GameEngine {
    fn get_game_type(&self) -> GameType;
    fn validate_level(&self, level_data: &serde_json::Value) -> bool;
}

#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// A specialized helper for logging from Rust to JS console.
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_version_retrieval() {
        let v = version();
        assert!(!v.is_empty());
    }
}
