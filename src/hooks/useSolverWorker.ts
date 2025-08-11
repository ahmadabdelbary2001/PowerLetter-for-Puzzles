// src/hooks/useSolverWorker.ts
import { useEffect, useRef } from 'react';

type WorkerRequest = {
  type: 'find';
  id: number;
  letters: string[];
  lang?: 'en' | 'ar';
  minLen?: number;
};

type WorkerResponse = {
  id: number;
  type: 'result';
  results: string[];
};

export function useSolverWorker() {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<number, (res: string[]) => void>>(new Map());
  const idRef = useRef<number>(1);

  useEffect(() => {
    const worker = new Worker(new URL('../workers/solver.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    // Create a local copy of the callbacks ref for the cleanup function
    const callbacksMap = callbacksRef.current;

    const onMessage = (ev: MessageEvent) => {
      const data = ev.data as unknown;
      if (!data || typeof data !== 'object') return;
      const resp = data as WorkerResponse;
      if (typeof resp.id !== 'number') return;
      const cb = callbacksMap.get(resp.id);
      if (cb) {
        cb(resp.results ?? []);
        callbacksMap.delete(resp.id);
      }
    };

    const onError = (err: ErrorEvent) => {
      callbacksMap.forEach((cb) => cb([]));
      callbacksMap.clear();
      console.error('Solver worker error', err);
    };

    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);

    return () => {
      // Use the local copy of callbacksMap in the cleanup function
      callbacksMap.forEach((cb) => cb([]));
      callbacksMap.clear();

      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
      worker.terminate();
      workerRef.current = null;
    };
    // empty deps: mount/unmount once
  }, []);

  const findWords = (letters: string[], lang: 'en' | 'ar' = 'en', minLen = 2): Promise<string[]> => {
    return new Promise((resolve) => {
      const id = idRef.current++;
      callbacksRef.current.set(id, resolve);
      const w = workerRef.current;
      if (w) {
        const msg: WorkerRequest = { type: 'find', id, letters, lang, minLen };
        w.postMessage(msg);
      } else {
        callbacksRef.current.delete(id);
        resolve([]);
      }
    });
  };

  return { findWords };
}
