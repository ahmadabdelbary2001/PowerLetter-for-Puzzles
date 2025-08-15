// src/components/GameScreens/ClueGame/gameReducer.ts

export type GameState = 'playing' | 'won' | 'failed';

export type State = {
  slotIndices: (number | null)[];
  answerSlots: string[];
  hintIndices: number[];
  gameState: GameState;
};

// FIX: Add the new action type to the union
export type Action =
  | { type: 'RESET'; solutionLen: number }
  | { type: 'PLACE'; gridIndex: number; letter: string }
  | { type: 'REMOVE_LAST' }
  | { type: 'CLEAR' }
  | { type: 'HINT'; solution: string; letters: string[] }
  | { type: 'SHOW'; solution: string; letters: string[] }
  | { type: 'CHECK'; solution: string }
  | { type: 'SET_GAME_STATE'; payload: GameState }; // New action

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'RESET': {
      const slots = Array(action.solutionLen).fill(null);
      return {
        slotIndices: slots,
        answerSlots: Array(action.solutionLen).fill(''),
        hintIndices: [],
        gameState: 'playing',
      };
    }

    case 'PLACE': {
      const slotPos = state.slotIndices.findIndex(idx => idx === action.gridIndex);
      if (slotPos !== -1) {
        const si = [...state.slotIndices];
        const as = [...state.answerSlots];
        si[slotPos] = null;
        as[slotPos] = '';
        return { ...state, slotIndices: si, answerSlots: as, gameState: 'playing' };
      }
      
      const empty = state.slotIndices.indexOf(null);
      if (empty === -1) return state;
      const si = [...state.slotIndices];
      const as = [...state.answerSlots];
      si[empty] = action.gridIndex;
      as[empty] = action.letter;
      return { ...state, slotIndices: si, answerSlots: as };
    }

    case 'REMOVE_LAST': {
      let last = -1;
      for (let i = state.slotIndices.length - 1; i >= 0; i--) {
        const gi = state.slotIndices[i];
        if (gi !== null && !state.hintIndices.includes(gi)) {
          last = i;
          break;
        }
      }
      if (last < 0) return state;
      const si = [...state.slotIndices];
      const as = [...state.answerSlots];
      si[last] = null;
      as[last] = '';
      return { ...state, slotIndices: si, answerSlots: as, gameState: 'playing' };
    }

    case 'CLEAR': {
      const si = state.slotIndices.map(idx =>
        idx !== null && state.hintIndices.includes(idx) ? idx : null
      );
      const as = si.map((idx, i) =>
        idx !== null && state.hintIndices.includes(idx) ? state.answerSlots[i] : ''
      );
      return { ...state, slotIndices: si, answerSlots: as, gameState: 'playing' };
    }

    case 'HINT': {
      const solArr = action.solution.split('');
      const pos = solArr.findIndex((ch, i) => state.answerSlots[i] !== ch);
      if (pos < 0) return state;
      const target = solArr[pos];

      const siPre = [...state.slotIndices];
      const asPre = [...state.answerSlots];
      for (let i = 0; i < siPre.length; i++) {
        const idx = siPre[i];
        if (
          idx !== null &&
          action.letters[idx] === target &&
          solArr[i] !== target
        ) {
          siPre[i] = null;
          asPre[i] = '';
        }
      }

      const avail = action.letters.findIndex(
        (l, i) => l === target && !siPre.includes(i) && !state.hintIndices.includes(i)
      );
      if (avail < 0) return state;

      siPre[pos] = avail;
      asPre[pos] = target;

      return {
        ...state,
        slotIndices: siPre,
        answerSlots: asPre,
        hintIndices: [...state.hintIndices, avail],
      };
    }

    case 'SHOW': {
      const solArr = action.solution.split('');
      const si: (number | null)[] = [];
      const hi: number[] = [];
      solArr.forEach((ch, i) => {
        const idx = action.letters.findIndex((l, j) => l === ch && !si.includes(j));
        si[i] = idx !== -1 ? idx : null;
        if (idx !== -1 && !state.slotIndices.includes(idx)) hi.push(idx);
      });
      return {
        ...state,
        slotIndices: si,
        answerSlots: solArr,
        hintIndices: hi,
        gameState: 'won',
      };
    }

    case 'CHECK': {
      const normalize = (s: string) => s.replace(/\s/g, '').normalize('NFC');
      const current = normalize(state.answerSlots.join(''));
      const expected = normalize(action.solution);
      if (current === expected) {
        return { ...state, gameState: 'won' };
      } else {
        return { ...state, gameState: 'failed' };
      }
    }

    // FIX: Add the case for the new action
    case 'SET_GAME_STATE': {
      return { ...state, gameState: action.payload };
    }

    default:
      return state;
  }
}
