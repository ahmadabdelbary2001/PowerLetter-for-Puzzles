/// Constraint solving logic for puzzle generation
pub mod constraint {
    pub trait Constraint {
        fn is_satisfied(&self) -> bool;
    }
}
