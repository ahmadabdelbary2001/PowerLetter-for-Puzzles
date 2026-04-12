/// Graph algorithms for pathfinding and connectivity
pub mod graph {
    pub struct Node<T> {
        pub value: T,
        pub edges: Vec<usize>,
    }

    pub struct Graph<T> {
        pub nodes: Vec<Node<T>>,
    }
}
