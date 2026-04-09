//! Formation Game Engine
//!
//! A high-performance game engine for the Word Formation (Crossword) puzzle game.
//! Provides grid generation, word validation, and level validation.

pub mod models;
pub mod engine;
pub mod validator;

pub use models::{GridCell, FormationLevel, WordPlacement};
pub use engine::{FormationEngine, generate_letters};
pub use validator::{validate_word, validate_level, check_solution_complete};
