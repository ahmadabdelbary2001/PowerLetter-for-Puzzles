# PowerLetter for Puzzles

PowerLetter for Puzzles is a web-based word puzzle game designed to challenge your vocabulary and problem-solving skills. It offers a user-friendly interface and supports multiple languages, allowing players to choose their preferred language for an immersive experience.

## Live Demo

Experience the game live at: [PowerLetter for Puzzles](https://ahmadabdelbary2001.github.io/PowerLetter-for-Puzzles/)

## Features

- **Multi-language Support**: Play in English or Arabic.
- **Game Modes**: Choose between Single Player and Competitive modes.
  - **Single Player**: Focus on personal progress, progressive challenges, and a hint system.
  - **Competitive**: Play with friends in teams, featuring a scoring system and turn-based play.
- **Responsive Design**: Enjoy the game seamlessly across various devices.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite**: A fast build tool that provides a lightning-fast development experience.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **i18next**: Internationalization framework for multi-language support.
- **Zustand**: State management for game modes and settings.
- **gh-pages**: A tool to publish content to GitHub Pages.

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ahmadabdelbary2001/PowerLetter-for-Puzzles.git
   ```
2. Navigate to the project directory:
   ```bash
   cd PowerLetter-for-Puzzles
   ```
3. Install the dependencies:
   ```bash
   npm install
   # or yarn install
   ```

### Running the Development Server

To start the development server:

```bash
npm run dev
# or yarn dev
```

Open your browser and visit `http://localhost:5173` (or the port indicated in your terminal).

### Building for Production

To build the project for production:

```bash
npm run build
# or yarn build
```

This will create a `dist` directory with the production-ready files.

### Deployment

The project is configured for deployment to GitHub Pages using `gh-pages`. To deploy:

```bash
npm run deploy
# or yarn deploy
```

## Project Structure

```
PowerLetter-for-Puzzles/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   └── sounds/
│   └── vite.svg
├── scripts/
│   └── copy-404.cjs
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   ├── templates/
│   │   └── ui/
│   ├── contexts/
│   │   ├── ThemeContext.ts
│   │   └── ThemeProvider.tsx
│   ├── data/
│   │   ├── ar/
│   │   └── en/
│   ├── features/
│   │   ├── clue-game/
│   │   ├── formation-game/
│   │   ├── img-clue-game/
│   │   ├── letter-flow-game/
│   │   ├── picture-choice-game/
│   │   └── word-choice-game/
│   ├── games/
│   │   ├── GameRegistry.ts
│   │   └── engine/
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── useGame.ts
│   │   ├── useGameMode.ts
│   │   ├── useTheme.ts
│   │   └── useTranslation.ts
│   ├── lib/
│   │   ├── gameReducer.ts
│   │   ├── gameUtils.ts
│   │   ├── i18nUtils.ts
│   │   └── utils.ts
│   ├── locales/
│   │   ├── ar/
│   │   └── en/
│   ├── pages/
│   │   ├── GameTypeSelector.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Index.tsx
│   │   ├── KidsGameSelector.tsx
│   │   ├── NotFound.tsx
│   │   └── TeamConfigurator.tsx
│   ├── types/
│   │   └── game.ts
│   ├── App.css
│   ├── App.tsx
│   ├── i18n.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.cjs
├── README.md
├── tailwind.config.cjs
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
