// src/lib/gameReducer.ts
/**
 * @description A generic reducer for managing the state of word-based puzzle games.
 * It handles common actions like placing letters, clearing the board, and managing hints.
 */
import type { Reducer } from 'react';

/**
 * @interface State
 * @description The shape of the state managed by the game reducer.
 */
export interface State {
  gameState: 'playing' | 'won' | 'failed';
  answerSlots: string[];
  slotIndices: (number | null)[];
  hintIndices: number[];
  letters: string[];
}

/**
 * @type Action
 * @description Defines the shape of actions that can be dispatched to the reducer.
 */
export type Action =
  | { type: 'PLACE'; gridIndex: number; letter: string }
  | { type: 'REMOVE_LAST' }
  | { type: 'CLEAR' }
  | { type: 'HINT'; solution: string; letters: string[] }
  | { type: 'SHOW'; solution: string; letters: string[] }
  | { type: 'SET_GAME_STATE'; payload: 'playing' | 'won' | 'failed' }
  | { type: 'RESET'; solution: string; letters: string[] };

/**
 * The game reducer function.
 * @param {State} state - The current state.
 * @param {Action} action - The dispatched action.
 * @returns {State} The new state.
 */
export const gameReducer: Reducer<State, Action> = (state, action): State => {
  switch (action.type) {
    case 'PLACE': {
      const nextSlot = state.answerSlots.indexOf('');
      if (nextSlot === -1 || state.slotIndices.includes(action.gridIndex)) {
        return state;
      }
      const newAnswerSlots = [...state.answerSlots];
      newAnswerSlots[nextSlot] = action.letter;
      const newSlotIndices = [...state.slotIndices];
      newSlotIndices[nextSlot] = action.gridIndex;
      return { ...state, answerSlots: newAnswerSlots, slotIndices: newSlotIndices };
    }
    case 'REMOVE_LAST': {
      let lastFilled = -1;
      for (let i = state.answerSlots.length - 1; i >= 0; i--) {
        if (state.answerSlots[i] !== '' && !state.hintIndices.includes(state.slotIndices[i] as number)) {
          lastFilled = i;
          break;
        }
      }
      if (lastFilled === -1) return state;
      const newAnswerSlots = [...state.answerSlots];
      newAnswerSlots[lastFilled] = '';
      const newSlotIndices = [...state.slotIndices];
      newSlotIndices[lastFilled] = null;
      return { ...state, answerSlots: newAnswerSlots, slotIndices: newSlotIndices };
    }
    case 'CLEAR': {
      const newAnswerSlots = state.answerSlots.map((slot, i) =>
        state.hintIndices.includes(state.slotIndices[i] as number) ? slot : ''
      );
      const newSlotIndices = state.slotIndices.map((index) =>
        state.hintIndices.includes(index as number) ? index : null
      );
      return { ...state, answerSlots: newAnswerSlots, slotIndices: newSlotIndices };
    }
    case 'HINT': {
      const emptyIndex = state.answerSlots.findIndex((slot, i) => slot === '' || slot !== action.solution[i]);
      if (emptyIndex === -1) return state;

      const correctLetter = action.solution[emptyIndex];
      const letterIndexInGrid = action.letters.findIndex(
        (l, i) => l === correctLetter && !state.slotIndices.includes(i)
      );

      if (letterIndexInGrid === -1) return state;

      const newAnswerSlots = [...state.answerSlots];
      newAnswerSlots[emptyIndex] = correctLetter;
      const newSlotIndices = [...state.slotIndices];
      newSlotIndices[emptyIndex] = letterIndexInGrid;
      const newHintIndices = [...state.hintIndices, letterIndexInGrid];

      return { ...state, answerSlots: newAnswerSlots, slotIndices: newSlotIndices, hintIndices: newHintIndices };
    }
    case 'SHOW': {
      return {
        ...state,
        gameState: 'failed',
        answerSlots: [...action.solution],
        slotIndices: [],
        hintIndices: [],
      };
    }
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'RESET':
      return {
        gameState: 'playing',
        answerSlots: Array(action.solution.length).fill(''),
        slotIndices: Array(action.solution.length).fill(null),
        hintIndices: [],
        letters: action.letters,
      };
    default:
      return state;
  }
};

// --- CRITICAL FIX: The useGameReducer hook has been removed from this file. ---
// Its logic is now co-located inside the useGame hook for a correct lifecycle.
