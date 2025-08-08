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
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── GameScreens/
│   │   ├── GameSetup/
│   │   └── ui/
│   ├── contexts/
│   ├── data/
│   │   ├── ar/
│   │   └── en/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.cjs
├── README.md
├── tailwind.config.cjs
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
