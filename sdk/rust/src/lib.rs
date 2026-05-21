//! Techkern Rust SDK — GPU inference routing.
pub struct Techkern { api_key: String, base_url: String }
impl Techkern {
    pub fn new(api_key: impl Into<String>) -> Self {
        Self { api_key: api_key.into(), base_url: "https://api.techkern.xyz".into() }
    }
}
