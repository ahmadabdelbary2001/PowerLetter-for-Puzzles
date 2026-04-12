/// Engine and plugin registry
use std::collections::HashMap;
use crate::plugin::GamePlugin;

pub struct EngineRegistry {
    pub plugins: HashMap<String, Box<dyn GamePlugin>>,
}

impl EngineRegistry {
    pub fn new() -> Self {
        Self {
            plugins: HashMap::new(),
        }
    }

    pub fn register_plugin(&mut self, plugin: Box<dyn GamePlugin>) {
        self.plugins.insert(plugin.name().to_string(), plugin);
    }
}
