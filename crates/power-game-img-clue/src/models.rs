use serde::{Deserialize, Serialize};

/// Image level data structure
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ImageLevel {
    pub id: String,
    pub image: String,
    pub sound: String,
    pub solution: String,
}

impl ImageLevel {
    /// Create a new image level
    pub fn new(id: impl Into<String>, image: impl Into<String>, sound: impl Into<String>, solution: impl Into<String>) -> Self {
        Self {
            id: id.into(),
            image: image.into(),
            sound: sound.into(),
            solution: solution.into(),
        }
    }

    /// Check if the level is valid
    pub fn is_valid(&self) -> bool {
        !self.id.is_empty()
            && !self.image.is_empty()
            && !self.sound.is_empty()
            && !self.solution.is_empty()
    }

    /// Get the solution length
    pub fn solution_length(&self) -> usize {
        self.solution.chars().count()
    }

    /// Create an error level
    pub fn error() -> Self {
        Self {
            id: "error".to_string(),
            image: "/assets/images/error.png".to_string(),
            sound: String::new(),
            solution: "ERROR".to_string(),
        }
    }
}

/// Collection of image levels
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct LevelCollection {
    pub levels: Vec<ImageLevel>,
}

impl LevelCollection {
    /// Create an empty collection
    pub fn empty() -> Self {
        Self { levels: Vec::new() }
    }

    /// Get a random level
    pub fn random_level(&self) -> Option<&ImageLevel> {
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
    pub fn get_by_id(&self, id: &str) -> Option<&ImageLevel> {
        self.levels.iter().find(|l| l.id == id)
    }

    /// Get all valid levels
    pub fn valid_levels(&self) -> Vec<&ImageLevel> {
        self.levels.iter().filter(|l| l.is_valid()).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_image_level_creation() {
        let level = ImageLevel::new("1", "img.png", "snd.mp3", "solution");
        assert_eq!(level.id, "1");
        assert_eq!(level.image, "img.png");
        assert_eq!(level.sound, "snd.mp3");
        assert_eq!(level.solution, "solution");
    }

    #[test]
    fn test_is_valid() {
        let valid = ImageLevel::new("1", "img.png", "snd.mp3", "solution");
        assert!(valid.is_valid());

        let invalid = ImageLevel::new("", "img.png", "snd.mp3", "solution");
        assert!(!invalid.is_valid());
    }

    #[test]
    fn test_solution_length() {
        let level = ImageLevel::new("1", "img.png", "snd.mp3", "hello");
        assert_eq!(level.solution_length(), 5);
    }

    #[test]
    fn test_error_level() {
        let error = ImageLevel::error();
        assert_eq!(error.id, "error");
        assert!(!error.is_valid());
    }

    #[test]
    fn test_level_collection() {
        let collection = LevelCollection {
            levels: vec![
                ImageLevel::new("1", "img1.png", "snd1.mp3", "cat"),
                ImageLevel::new("2", "img2.png", "snd2.mp3", "dog"),
            ],
        };

        assert_eq!(collection.levels.len(), 2);
        
        let by_id = collection.get_by_id("1");
        assert!(by_id.is_some());
        assert_eq!(by_id.unwrap().solution, "cat");
    }
}
