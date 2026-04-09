use serde::{Deserialize, Serialize};

/// Difficulty levels
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Difficulty {
    #[serde(rename = "easy")]
    Easy,
    #[serde(rename = "medium")]
    Medium,
    #[serde(rename = "hard")]
    Hard,
}

impl Difficulty {
    /// Get points for this difficulty
    pub fn points(&self) -> i32 {
        match self {
            Difficulty::Easy => 10,
            Difficulty::Medium => 20,
            Difficulty::Hard => 30,
        }
    }

    /// Get difficulty name
    pub fn name(&self) -> &'static str {
        match self {
            Difficulty::Easy => "easy",
            Difficulty::Medium => "medium",
            Difficulty::Hard => "hard",
        }
    }
}

/// Phrase level data structure
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PhraseLevel {
    pub id: String,
    pub clue: String,
    pub solution: String,
    #[serde(default = "default_difficulty")]
    pub difficulty: Difficulty,
}

fn default_difficulty() -> Difficulty {
    Difficulty::Easy
}

impl PhraseLevel {
    /// Create a new phrase level
    pub fn new(
        id: impl Into<String>,
        clue: impl Into<String>,
        solution: impl Into<String>,
        difficulty: Difficulty,
    ) -> Self {
        Self {
            id: id.into(),
            clue: clue.into(),
            solution: solution.into(),
            difficulty,
        }
    }

    /// Check if the level is valid
    pub fn is_valid(&self) -> bool {
        !self.id.is_empty() && !self.clue.is_empty() && !self.solution.is_empty()
    }

    /// Get the solution length
    pub fn solution_length(&self) -> usize {
        self.solution.chars().count()
    }

    /// Get points for this level
    pub fn points(&self) -> i32 {
        self.difficulty.points()
    }

    /// Create an error level
    pub fn error() -> Self {
        Self {
            id: "error".to_string(),
            clue: "Error loading level".to_string(),
            solution: "ERROR".to_string(),
            difficulty: Difficulty::Easy,
        }
    }
}

/// Collection of phrase levels
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct LevelCollection {
    pub levels: Vec<PhraseLevel>,
}

impl LevelCollection {
    /// Create an empty collection
    pub fn empty() -> Self {
        Self { levels: Vec::new() }
    }

    /// Get a random level
    pub fn random_level(&self) -> Option<&PhraseLevel> {
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};
        use std::time::{SystemTime, UNIX_EPOCH};

        if self.levels.is_empty() {
            return None;
        }

        // Simple pseudo-random selection based on current time
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64;

        let mut hasher = DefaultHasher::new();
        now.hash(&mut hasher);
        let hash = hasher.finish();

        let index = (hash as usize) % self.levels.len();
        self.levels.get(index)
    }

    /// Get level by ID
    pub fn get_by_id(&self, id: &str) -> Option<&PhraseLevel> {
        self.levels.iter().find(|l| l.id == id)
    }

    /// Get all valid levels
    pub fn valid_levels(&self) -> Vec<&PhraseLevel> {
        self.levels.iter().filter(|l| l.is_valid()).collect()
    }

    /// Get levels by difficulty
    pub fn by_difficulty(&self, difficulty: Difficulty) -> Vec<&PhraseLevel> {
        self.levels
            .iter()
            .filter(|l| l.difficulty == difficulty && l.is_valid())
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_difficulty_points() {
        assert_eq!(Difficulty::Easy.points(), 10);
        assert_eq!(Difficulty::Medium.points(), 20);
        assert_eq!(Difficulty::Hard.points(), 30);
    }

    #[test]
    fn test_phrase_level_creation() {
        let level = PhraseLevel::new("1", "clue text", "solution", Difficulty::Medium);
        assert_eq!(level.id, "1");
        assert_eq!(level.clue, "clue text");
        assert_eq!(level.solution, "solution");
        assert_eq!(level.difficulty, Difficulty::Medium);
    }

    #[test]
    fn test_is_valid() {
        let valid = PhraseLevel::new("1", "clue", "solution", Difficulty::Easy);
        assert!(valid.is_valid());

        let invalid = PhraseLevel::new("", "clue", "solution", Difficulty::Easy);
        assert!(!invalid.is_valid());
    }

    #[test]
    fn test_points() {
        let easy = PhraseLevel::new("1", "clue", "sol", Difficulty::Easy);
        assert_eq!(easy.points(), 10);

        let hard = PhraseLevel::new("2", "clue", "sol", Difficulty::Hard);
        assert_eq!(hard.points(), 30);
    }

    #[test]
    fn test_error_level() {
        let error = PhraseLevel::error();
        assert_eq!(error.id, "error");
        assert!(error.is_valid()); // Error level has valid fields
        assert_eq!(error.solution, "ERROR");
    }

    #[test]
    fn test_level_collection_by_difficulty() {
        let collection = LevelCollection {
            levels: vec![
                PhraseLevel::new("1", "clue1", "sol1", Difficulty::Easy),
                PhraseLevel::new("2", "clue2", "sol2", Difficulty::Hard),
                PhraseLevel::new("3", "clue3", "sol3", Difficulty::Easy),
            ],
        };

        let easy_levels = collection.by_difficulty(Difficulty::Easy);
        assert_eq!(easy_levels.len(), 2);

        let hard_levels = collection.by_difficulty(Difficulty::Hard);
        assert_eq!(hard_levels.len(), 1);
    }
}
