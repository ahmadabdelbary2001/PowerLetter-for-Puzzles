# Architecture Overview

## Philosophy
PowerLetter follows a **Feature-Sliced Design (FSD)** approach combined with a high-performance **Rust-core (WASM)** and a modular **Atomic Design** UI system.

## Layering
1. **App Layer**: Next.js (Web) and Tauri (Desktop/Mobile) consumers.
2. **Package Layer**: Shared business logic (@core), UI components (@ui), config (@config), and API abstractions (@api-bindings).
3. **Crate Layer**: High-performance Rust engines and mathematical utilities.

## Core Domain (FSD)
Located in `packages/core/src/domain/`, structured by:
- **Model**: Data types and interfaces.
- **Repository**: Data access abstractions.
- **Service**: Business logic and orchestration.
