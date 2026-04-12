pub trait Constraint {
    fn is_satisfied(&self) -> bool;
}
