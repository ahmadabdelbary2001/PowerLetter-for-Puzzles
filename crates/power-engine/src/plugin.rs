/// Plugin system trait for game engines
pub trait GamePlugin {
    fn name(&self) -> &'static str;
    fn on_init(&self);
    fn on_update(&self, dt: f32);
}
