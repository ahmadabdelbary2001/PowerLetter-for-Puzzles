/// Async level loading from storage or JSON
use crate::error::EngineError;

#[async_trait::async_trait]
pub trait LevelLoader<T> {
    async fn load(&self, id: &str) -> Result<T, EngineError>;
}
