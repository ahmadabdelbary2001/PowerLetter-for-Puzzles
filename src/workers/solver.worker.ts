// src/workers/solver.worker.ts

// --- Generic Message Protocol ---
type WorkerRequest = {
  id: number;
  task: string;
  payload: unknown;
};

type WorkerResponse = {
  id: number;
  type: 'result' | 'error';
  payload: unknown;
};

// --- Normalization (Utility) ---
function normalizeArabic(text: string): string {
  return text
    .normalize('NFC')
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/g, '')
    .replace(/[إأآ]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim();
}

function normalizeWordForComparison(word: string, lang: 'en' | 'ar'): string {
  if (lang === 'ar') return normalizeArabic(word);
  return word.normalize('NFC').toLocaleUpperCase();
}

// --- Data Management (Singleton) ---
const dataManager = {
  _wordsetCache: new Map<string, Set<string>>(),
  _originalWordsCache: new Map<string, string[]>(),

  async getWordData(lang: 'en' | 'ar', category: string): Promise<{ wordset: Set<string>; originalWords: string[] }> {
    const cacheKey = `${category}-${lang}`;
    if (this._wordsetCache.has(cacheKey) && this._originalWordsCache.has(cacheKey)) {
      return {
        wordset: this._wordsetCache.get(cacheKey)!,
        originalWords: this._originalWordsCache.get(cacheKey)!,
      };
    }

    try {
      const categoryTitleCase = category.charAt(0).toUpperCase() + category.slice(1);
      const path = `/src/data/${categoryTitleCase}/${lang}/clue/${lang}-clue-${category}-words.json`;
      
      const modules = import.meta.glob('/src/data/**/*.json');
      const moduleLoader = modules[path];
      if (!moduleLoader) throw new Error(`Wordset module not found at ${path}`);

      const wordsMod = (await moduleLoader()) as { default?: { words?: string[] } | string[] };
      
      let words: string[] = [];
      if (wordsMod?.default) {
        words = Array.isArray(wordsMod.default) ? wordsMod.default : wordsMod.default.words ?? [];
      }

      const wordset = new Set(words.map(w => normalizeWordForComparison(w, lang)));
      
      this._wordsetCache.set(cacheKey, wordset);
      this._originalWordsCache.set(cacheKey, words);

      return { wordset, originalWords: words };
    } catch (err) {
      console.error(`DataManager: Failed to load word data for ${cacheKey}`, err);
      return { wordset: new Set(), originalWords: [] };
    }
  },
};

// --- Solver Functions (Task Implementations) ---

function canFormWord(word: string, letterPool: Map<string, number>): boolean {
  const currentPool = new Map(letterPool);
  for (const char of word) {
    const count = currentPool.get(char) ?? 0;
    if (count === 0) return false;
    currentPool.set(char, count - 1);
  }
  return true;
}

// Define a specific type for this task's payload
type FindWordsPayload = {
  letters: string[];
  lang: 'en' | 'ar';
  category: string;
  minLen: number;
};

// Create a type guard to check if a payload matches the expected shape
function isFindWordsPayload(payload: unknown): payload is FindWordsPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'letters' in payload &&
    'lang' in payload &&
    'category' in payload &&
    'minLen' in payload
  );
}

async function findWordsFromLetters(payload: FindWordsPayload): Promise<string[]> {
  const { letters, lang, category, minLen } = payload;
  const { originalWords } = await dataManager.getWordData(lang, category);

  const letterPool = new Map<string, number>();
  letters.forEach(l => {
    const normalized = normalizeWordForComparison(l, lang);
    letterPool.set(normalized, (letterPool.get(normalized) ?? 0) + 1);
  });

  const results: string[] = [];
  for (const originalWord of originalWords) {
    const normalizedWord = normalizeWordForComparison(originalWord, lang);
    if (normalizedWord.length < minLen) continue;
    if (canFormWord(normalizedWord, letterPool)) {
      results.push(originalWord);
    }
  }
  return results;
}

// --- Task Registry ---
const solverTasks: Record<string, (payload: unknown) => Promise<unknown>> = {
  // FIX: Create a wrapper function that performs type checking before calling the specific solver.
  'find-words-from-letters': (payload: unknown) => {
    if (isFindWordsPayload(payload)) {
      return findWordsFromLetters(payload);
    }
    // If the payload is not the correct shape, reject the promise.
    return Promise.reject(new Error("Invalid payload for task 'find-words-from-letters'"));
  },
};

// --- Main Worker Event Listener ---
self.addEventListener('message', async (ev: MessageEvent<WorkerRequest>) => {
  const { id, task, payload } = ev.data;

  const solverFunction = solverTasks[task];
  if (!solverFunction) {
    const errorMsg = `Unknown task: ${task}`;
    console.error(errorMsg);
    postMessage({ id, type: 'error', payload: errorMsg });
    return;
  }

  try {
    const result = await solverFunction(payload);
    const response: WorkerResponse = { id, type: 'result', payload: result };
    postMessage(response);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`Error executing task '${task}':`, err);
    postMessage({ id, type: 'error', payload: errorMsg });
  }
});
