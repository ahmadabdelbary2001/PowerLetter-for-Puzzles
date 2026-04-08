/**
 * Dummy WASM module for development.
 * This file prevents Vite from failing during dev-time imports.
 * The actual Rust WASM module will overwrite this file when built.
 */
export const letter_flow_generate_board = () => { throw new Error("WASM not built"); };
export const letter_flow_validate = () => { throw new Error("WASM not built"); };
export const version = () => "0.0.0-dummy";
