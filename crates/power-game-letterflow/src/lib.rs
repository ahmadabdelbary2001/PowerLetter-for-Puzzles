//! Letter Flow Game Engine
//!
//! A high-performance game engine for the Letter Flow puzzle game.
//! Provides board generation, path validation, and level validation.

pub mod models;
pub mod engine;
pub mod validator;

pub use models::{BoardCell, LetterFlowLevel, WordPath, PathPoint, GridSize};
pub use engine::{LetterFlowEngine, generate_board};
pub use validator::{validate_path, validate_level, check_solution};
