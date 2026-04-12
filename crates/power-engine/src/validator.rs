/// Generic puzzle level validation logic
pub trait LevelValidator<T> {
    fn validate(&self, level: &T) -> Result<(), String>;
}
