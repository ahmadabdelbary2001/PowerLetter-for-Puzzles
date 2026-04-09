use serde::{Deserialize, Serialize};

/// Image choice level data structure
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ImgChoiceLevel {
    pub id: String,
    pub word: String,
    pub sound: String,
    pub solution: String,
    pub options: Vec<String>,
}

impl ImgChoiceLevel {
    /// Create a new image choice level
    pub fn new(
        id: impl Into<String>,
        word: impl Into<String>,
        sound: impl Into<String>,
        solution: impl Into<String>,
        options: Vec<String>,
    ) -> Self {
        Self {
            id: id.into(),
            word: word.into(),
            sound: sound.into(),
            solution: solution.into(),
            options,
        }
    }

    /// Ensure solution is in options
    pub fn ensure_solution_in_options(&mut self) {
        if !self.options.contains(&self.solution) {
            self.options.push(self.solution.clone());
        }
    }

    /// Check if the level is valid
    pub fn is_valid(&self) -> bool {
        !self.id.is_empty()
            && !self.word.is_empty()
            && !self.solution.is_empty()
            && !self.options.is_empty()
            && self.options.contains(&self.solution)
    }

    /// Create an error level
    pub fn error() -> Self {
        Self {
            id: "error".to_string(),
            word: "Error".to_string(),
            sound: String::new(),
            solution: "/assets/images/error.png".to_string(),
            options: vec!["/assets/images/error.png".to_string()],
        }
    }
}

/// Collection of image choice levels
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct LevelCollection {
    pub levels: Vec<ImgChoiceLevel>,
}

impl LevelCollection {
    /// Create an empty collection
    pub fn empty() -> Self {
        Self { levels: Vec::new() }
    }

    /// Get a random level
    pub fn random_level(&self) -> Option<&ImgChoiceLevel> {
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};
        use std::time::{SystemTime, UNIX_EPOCH};

        if self.levels.is_empty() {
            return None;
        }

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
    pub fn get_by_id(&self, id: &str) -> Option<&ImgChoiceLevel> {
        self.levels.iter().find(|l| l.id == id)
    }

    /// Get all valid levels
    pub fn valid_levels(&self) -> Vec<&ImgChoiceLevel> {
        self.levels.iter().filter(|l| l.is_valid()).collect()
    }

    /// Add solution to all levels' options
    pub fn ensure_all_solutions(&mut self) {
        for level in &mut self.levels {
            level.ensure_solution_in_options();
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_img_choice_level_creation() {
        let level = ImgChoiceLevel::new(
            "1",
            "cat",
            "cat.mp3",
            "cat.png",
            vec!["dog.png".to_string(), "cat.png".to_string()],
        );
        assert_eq!(level.id, "1");
        assert_eq!(level.word, "cat");
        assert_eq!(level.solution, "cat.png");
    }

    #[test]
    fn test_ensure_solution_in_options() {
        let mut level = ImgChoiceLevel::new(
            "1",
            "cat",
            "cat.mp3",
            "cat.png",
            vec!["dog.png".to_string()],
        );
        assert!(!level.options.contains(&"cat.png".to_string()));
        level.ensure_solution_in_options();
        assert!(level.options.contains(&"cat.png".to_string()));
    }

    #[test]
    fn test_is_valid() {
        let valid = ImgChoiceLevel::new(
            "1",
            "cat",
            "cat.mp3",
            "cat.png",
            vec!["dog.png".to_string(), "cat.png".to_string()],
        );
        assert!(valid.is_valid());

        let invalid = ImgChoiceLevel::new(
            "",
            "cat",
            "cat.mp3",
            "cat.png",
            vec!["dog.png".to_string(), "cat.png".to_string()],
        );
        assert!(!invalid.is_valid());
    }

    #[test]
    fn test_error_level() {
        let error = ImgChoiceLevel::error();
        assert_eq!(error.id, "error");
        assert!(error.is_valid());
    }

    #[test]
    fn test_level_collection() {
        let collection = LevelCollection {
            levels: vec![
                ImgChoiceLevel::new("1", "cat", "c.mp3", "c.png", vec!["c.png".to_string(), "d.png".to_string()]),
                ImgChoiceLevel::new("2", "dog", "d.mp3", "d.png", vec!["c.png".to_string(), "d.png".to_string()]),
            ],
        };

        assert_eq!(collection.levels.len(), 2);
        
        let by_id = collection.get_by_id("1");
        assert!(by_id.is_some());
        assert_eq!(by_id.unwrap().word, "cat");
    }
}
