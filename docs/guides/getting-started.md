# Getting Started

## Prerequisites
- Node.js 18+
- pnpm 8+
- Rust & Cargo (latest stable)
- wasm-pack

## Setup
```bash
# Install dependencies
pnpm install

# Build WASM components
pnpm run build:wasm --filter @powerletter/core

# Run web app
pnpm run dev --filter web

# Run desktop app
pnpm run tauri dev --filter desktop-mobile
```

## Development Workflow
1. Define models in `@core/domain`.
2. Implement logic in Rust if performance-critical.
3. Build UI components in `@ui` using Atomic Design.
4. Compose in `apps/web` or `apps/desktop-mobile`.
