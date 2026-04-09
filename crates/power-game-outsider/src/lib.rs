//! Outside the Story (Outsider) game engine
//!
//! A social party game where players try to identify the "outsider"
//! who doesn't know the secret word.

pub mod models;
pub mod engine;
pub mod round;

// Re-export commonly used types
pub use models::{OutsiderLevel, RoundConfig, PlayerRole};
pub use engine::OutsiderEngine;
pub use round::RoundManager;
