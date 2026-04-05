# 🧩 **PowerLetter for Puzzles**
> _A comprehensive multi-game puzzle platform supporting 7+ distinct game modes, architected flawlessly via an advanced Monorepo to run on Web (Next.js) and Desktop/Mobile (Tauri)._

<div align="center">
  <img src="https://img.shields.io/badge/Language-English-blue?style=flat-square" alt="English">
  <a href="#">English Version</a> |
  <img src="https://img.shields.io/badge/Language-Arabic-green?style=flat-square" alt="Arabic">
  <a href="../README.md">Arabic Version</a>
</div>

---

## 📖 **Overview**
> _This project serves as a highly scalable competitive puzzle platform. It utilizes a custom Game Engine Factory crafted precisely to handle dozens of independent game modes while unifying state data across multiple environments._

---

## 📋 **Table of Contents** <a id="toc"></a>
1. [✨ Key Features](#features)
2. [💻 Tech Stack](#tech-stack)
3. [🚀 Getting Started](#getting-started)
4. [🎮 Game Engine Factory](#game-engine)
5. [📁 Project Structure (FSD)](#project-structure)
6. [📜 License](#license)

---

## ✨ **Key Features** <a id="features"></a>
- **🧩 7+ Distinct Game Modes**: Handled simultaneously by an interactive universal game engine.
- **🌍 Dynamic Localization**: 100% Arabic & English compatibility out of the box, with instant RTL/LTR screen mirroring via i18next.
- **🏆 Complex Competitive State**: Managed rigorously by Zustand to handle real-time scoring and persistent user settings.
- **📱 True Cross-Platform**: Transpiles to Web, macOS, Windows, and Mobile—all sharing exact identical logical source code via Monorepo.

<div align="center">
  <a href="#toc">🔝 Back to Top</a>
</div>

---

## 💻 **Tech Stack** <a id="tech-stack"></a>
- **Turborepo**: The backbone workspace manager structure.
- **Next.js & React**: Lighting-fast frontend renderer.
- **Tauri 2.0 (Rust)**: Bundles the web views into incredibly lightweight Native desktop apps.
- **Zustand**: Fast and unopinionated global state manager.
- **TailwindCSS**: Utilitarian CSS methodology.
- **FSD Architecture**: Feature-Sliced Design to uncouple UI components from business domains.

<div align="center">
  <a href="#toc">🔝 Back to Top</a>
</div>

---

## 🚀 **Getting Started** <a id="getting-started"></a>

### Prerequisites
- [x] **Node.js (v18+)**
- [x] **pnpm** (Installed globally)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Ahmad-J-Bary/power-letter-for-puzzles.git
   cd PowerLetter-for-Puzzles
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the Web instance:
   ```bash
   pnpm dev:web
   ```

4. Or run the Desktop instance:
   ```bash
   pnpm dev:desktop
   ```

<div align="center">
  <a href="#toc">🔝 Back to Top</a>
</div>

---

## 🎮 **Game Engine Factory** <a id="game-engine"></a>
The actual trick lies beneath the modularity achieved through the Factory Pattern. This centralized engine listens to interactive inputs (Reducers) and emits corresponding states explicitly designed for each of the 7 generic game variations. This approach prevents code duplication and facilitates extremely fast scaling logic for new releases.

<div align="center">
  <a href="#toc">🔝 Back to Top</a>
</div>

---

## 📁 **Project Structure (FSD & Monorepo)** <a id="project-structure"></a>
 ```bash
 PowerLetter-for-Puzzles/
 ├── apps/
 │   ├── web/                    # Next.js Application (Web)
 │   └── desktop/                # Tauri Application (Desktop/Mobile)
 ├── packages/
 │   ├── core/                   # (FSD Logic) Reducers, GameEngine & Zustand
 │   ├── ui/                     # Isolated FSD UI visual components
 │   ├── config/                 # Monorepo Tailwind/ESLint presets
 │   └── api-bindings/           # (Reserved API Hooks)
 └── locales/                    # Multilingual catalogs
 ```

<div align="center">
  <a href="#toc">🔝 Back to Top</a>
</div>

---

## 📜 **License** <a id="license"></a>
This project is licensed under the MIT License. See the `LICENSE` file for details.

<div align="center">
  <a href="#toc">🔝 Back to Top</a>
</div>

<p align="center"> Developed with ❤️ by <a href="https://github.com/Ahmad-J-Bary">@Ahmad Abdelbary</a> </p>
