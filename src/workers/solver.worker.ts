// src/workers/solver.worker.ts
type FindMsg = { type: 'find'; id: number; letters: string[]; lang?: 'en' | 'ar'; minLen?: number; category: string };
type ResponseMsg = { id: number; type: 'result'; results: string[] };

const WORDSET_CACHE: Record<string, Set<string>> = {};

function normalizeArabic(text: string) {
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

function normalizeWordForComparison(word: string, lang: 'en' | 'ar') {
  if (lang === 'ar') return normalizeArabic(word);
  return word.normalize('NFC').toLocaleUpperCase();
}

type WordsModule = { default?: { words?: string[] } | string[]; words?: string[] };

async function getWordsetFor(lang: 'en' | 'ar', category: string): Promise<Set<string>> {
  const cacheKey = `${category}-${lang}`;
  if (WORDSET_CACHE[cacheKey]) {
    return WORDSET_CACHE[cacheKey];
  }

  const newWordset = new Set<string>();
  try {
    const categoryTitleCase = category.charAt(0).toUpperCase() + category.slice(1);
    const filePath = `/src/data/${categoryTitleCase}/${lang}/clue/${lang}-clue-${category}-words.json`;
    const modules = import.meta.glob('/src/data/**/*.json');
    const moduleLoader = modules[filePath];
    if (!moduleLoader) throw new Error(`Wordset module not found at ${filePath}`);
    
    const wordsMod = (await moduleLoader()) as WordsModule | null;

    if (wordsMod) {
      // FIX: Check if default is an array before trying to access properties on it.
      let arr: string[] = [];
      if (Array.isArray(wordsMod.default)) {
        arr = wordsMod.default;
      } else {
        arr = wordsMod.default?.words ?? wordsMod.words ?? [];
      }
      arr.forEach((w) => { if (w) newWordset.add(normalizeWordForComparison(String(w), lang)); });
    }
  } catch (err) {
    console.error(`Solver: Failed to build wordset for ${cacheKey}`, err);
  }

  WORDSET_CACHE[cacheKey] = newWordset;
  return newWordset;
}

function canFormWordFromLetters(word: string, letters: string[]) {
  const pool: Record<string, number> = {};
  for (const ch of letters) {
    const c = normalizeWordForComparison(ch, 'ar');
    pool[c] = (pool[c] ?? 0) + 1;
  }

  for (const ch of word.split('')) {
    const c = ch;
    if (!pool[c] || pool[c] <= 0) return false;
    pool[c]--;
  }
  return true;
}

async function findWordsFromLetters(letters: string[], lang: 'en' | 'ar', category: string, minLen = 2) {
  const WORDSET = await getWordsetFor(lang, category);
  if (!WORDSET || WORDSET.size === 0) return [];

  const normalizedLetters = letters.map(l => normalizeWordForComparison(l, lang));
  const results: string[] = [];
  
  const categoryTitleCase = category.charAt(0).toUpperCase() + category.slice(1);
  const filePath = `/src/data/${categoryTitleCase}/${lang}/clue/${lang}-clue-${category}-words.json`;
  const modules = import.meta.glob('/src/data/**/*.json');
  const moduleLoader = modules[filePath];
  if (!moduleLoader) return [];

  const wordsMod = (await moduleLoader()) as WordsModule | null;
  
  // FIX: Same logic as getWordsetFor to safely extract the array.
  let originalWords: string[] = [];
  if (wordsMod) {
    if (Array.isArray(wordsMod.default)) {
      originalWords = wordsMod.default;
    } else {
      originalWords = wordsMod.default?.words ?? wordsMod.words ?? [];
    }
  }

  for (const originalWord of originalWords) {
    const normalized = normalizeWordForComparison(originalWord, lang);
    if (normalized.length < minLen) continue;
    if (canFormWordFromLetters(normalized, normalizedLetters)) {
        results.push(originalWord);
    }
  }
  return results;
}

self.addEventListener('message', async (ev: MessageEvent) => {
  const possible = ev.data as unknown;
  if (!possible || typeof possible !== 'object') return;
  const msg = possible as FindMsg;
  if (msg.type !== 'find') return;

  const lang = msg.lang === 'ar' ? 'ar' : 'en';
  const minLen = msg.minLen ?? 2;
  const letters = msg.letters ?? [];
  const category = msg.category;

  if (!category) {
    console.error("Solver: Category not provided in 'find' message.");
    postMessage({ id: msg.id, type: 'result', results: [] });
    return;
  }

  const results = await findWordsFromLetters(letters, lang, category, minLen);
  const resp: ResponseMsg = { id: msg.id, type: 'result', results };
  postMessage(resp);
});
