use serde::Serialize;
use thiserror::Error;

/// Core domain errors for the PowerLetter engine.
/// 
/// **Why**: Centralizes error management to ensure consistent behavior across the 
/// engine and provides serialized error states for the WASM bridge.
#[derive(Debug, Error, Serialize, specta::Type)]
#[serde(tag = "type", content = "message")]
pub enum EngineError {
    /// Provided level data is invalid or missing required fields.
    #[error("Invalid level data: {0}")]
    InvalidLevel(String),

    /// Game type is not supported by the current engine.
    #[error("Unsupported game type: {0:?}")]
    UnsupportedGame(crate::models::GameType),

    /// Operation failed due to an internal calculation error.
    #[error("Internal engine error: {0}")]
    InternalError(String),
}

pub type EngineResult<T> = Result<T, EngineError>;
