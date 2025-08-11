// src/workers/solver.worker.ts
type FindMsg = { type: 'find'; id: number; letters: string[]; lang?: 'en' | 'ar'; minLen?: number };
type ResponseMsg = { id: number; type: 'result'; results: string[] };

let WORDSET: Set<string> | null = null;

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

function normalizeWord(word: string, lang: 'en' | 'ar') {
  if (lang === 'ar') return normalizeArabic(word);
  return word.normalize('NFC').toLocaleUpperCase();
}

type LevelsModule = { default?: { levels?: Array<{ solution?: string }> }; levels?: Array<{ solution?: string }> };
type WordsModule = { default?: { words?: string[] } | string[]; words?: string[] };

async function buildWordset(): Promise<void> {
  if (WORDSET) return;
  WORDSET = new Set<string>();

  try {
    const enMod = (await import('../data/en/clueLevels.json').catch(() => null)) as LevelsModule | null;
    if (enMod) {
      const enLevels = (enMod.default?.levels ?? enMod.levels) ?? [];
      enLevels.forEach((lvl) => { if (lvl?.solution) WORDSET!.add(normalizeWord(String(lvl.solution), 'en')); });
    }

    const arMod = (await import('../data/ar/clueLevels.json').catch(() => null)) as LevelsModule | null;
    if (arMod) {
      const arLevels = (arMod.default?.levels ?? arMod.levels) ?? [];
      arLevels.forEach((lvl) => { if (lvl?.solution) WORDSET!.add(normalizeWord(String(lvl.solution), 'ar')); });
    }

    const enWordsMod = (await import('../data/en/words.json').catch(() => null)) as WordsModule | null;
    if (enWordsMod) {
      const arr = (enWordsMod.default && Array.isArray(enWordsMod.default)) ? enWordsMod.default as string[] : (enWordsMod.default?.words ?? enWordsMod.words ?? []);
      (arr ?? []).forEach((w) => { if (w) WORDSET!.add(normalizeWord(String(w), 'en')); });
    }

    const arWordsMod = (await import('../data/ar/words.json').catch(() => null)) as WordsModule | null;
    if (arWordsMod) {
      const arr = (arWordsMod.default && Array.isArray(arWordsMod.default)) ? arWordsMod.default as string[] : (arWordsMod.default?.words ?? arWordsMod.words ?? []);
      (arr ?? []).forEach((w) => { if (w) WORDSET!.add(normalizeWord(String(w), 'ar')); });
    }
  } catch {
    // swallow errors — fall back to whatever WORDSET was built
  }
}

function canFormWordFromLetters(word: string, letters: string[]) {
  const pool: Record<string, number> = {};
  for (const ch of letters) {
    const c = ch.normalize('NFC');
    pool[c] = (pool[c] ?? 0) + 1;
  }

  for (const ch of word.split('')) {
    const c = ch.normalize('NFC');
    if (!pool[c] || pool[c] <= 0) return false;
    pool[c]--;
  }
  return true;
}

function findWordsFromLetters(letters: string[], lang: 'en' | 'ar', minLen = 2) {
  if (!WORDSET) return [];
  const normalizedLetters = letters.map(l => (lang === 'ar' ? normalizeArabic(l) : l.normalize('NFC').toLocaleUpperCase()));
  const results: string[] = [];
  for (const w of WORDSET) {
    const normalized = lang === 'ar' ? normalizeArabic(w) : w.normalize('NFC').toLocaleUpperCase();
    if (normalized.length < minLen) continue;
    if (canFormWordFromLetters(normalized, normalizedLetters)) results.push(normalized);
  }
  return results;
}

self.addEventListener('message', async (ev: MessageEvent) => {
  const possible = ev.data as unknown;
  if (!possible || typeof possible !== 'object') return;
  const msg = possible as FindMsg;
  if (msg.type !== 'find') return;

  await buildWordset();

  const lang = msg.lang === 'ar' ? 'ar' : 'en';
  const minLen = msg.minLen ?? 2;
  const letters = msg.letters ?? [];

  const results = findWordsFromLetters(letters, lang, minLen);
  const resp: ResponseMsg = { id: msg.id, type: 'result', results };
  postMessage(resp);
});
