use serde::{Deserialize, Serialize};

/// Supported game types in the PowerLetter ecosystem.
/// 
/// **Why**: Centralizes the source of truth for game identification.
#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, specta::Type)]
#[serde(rename_all = "kebab-case")]
pub enum GameType {
    PhraseClue,
    Formation,
    ImageClue,
    LetterFlow,
    ImgChoice,
    OutsideTheStory,
    WordChoice,
}

/// Difficulty levels for game content.
#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, specta::Type)]
#[serde(rename_all = "lowercase")]
pub enum Difficulty {
    Easy,
    Medium,
    Hard,
}

/// Base structure for any game level.
#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
pub struct BaseLevel {
    pub id: String,
    pub solution: String,
    pub difficulty: Difficulty,
}

/// Represents a single cell on a game board.
#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
pub struct BoardCell {
    pub x: i32,
    pub y: i32,
    pub letter: String,
    pub is_used: bool,
    pub color: Option<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_game_type_serialization() {
        let gt = GameType::LetterFlow;
        let json = serde_json::to_string(&gt).unwrap();
        // kebab-case check
        assert_eq!(json, "\"letter-flow\"");
    }

    #[test]
    fn test_difficulty_serialization() {
        let d = Difficulty::Hard;
        let json = serde_json::to_string(&d).unwrap();
        // lowercase check
        assert_eq!(json, "\"hard\"");
    }
}
