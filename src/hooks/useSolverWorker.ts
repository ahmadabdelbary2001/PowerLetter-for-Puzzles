// src/hooks/useSolverWorker.ts
import { useEffect, useRef, useCallback } from 'react';

type WorkerResponse = {
  id: number;
  type: 'result' | 'error';
  // FIX: Use 'unknown' instead of 'any'
  payload: unknown;
};

export function useSolverWorker() {
  const workerRef = useRef<Worker | null>(null);
  // FIX: Use 'unknown' for the callback payloads
  const callbacksRef = useRef<Map<number, (payload: unknown) => void>>(new Map());
  const errorCallbacksRef = useRef<Map<number, (error: unknown) => void>>(new Map());
  const idRef = useRef<number>(1);

  useEffect(() => {
    const worker = new Worker(new URL('../workers/solver.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    const onMessage = (ev: MessageEvent<WorkerResponse>) => {
      const { id, type, payload } = ev.data;
      if (type === 'result') {
        const cb = callbacksRef.current.get(id);
        cb?.(payload);
      } else if (type === 'error') {
        const errCb = errorCallbacksRef.current.get(id);
        errCb?.(payload);
      }
      callbacksRef.current.delete(id);
      errorCallbacksRef.current.delete(id);
    };

    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', (err) => console.error('Solver worker error:', err));

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // A generic function to call any task on the worker
  const callWorker = useCallback(<T,>(task: string, payload: unknown): Promise<T> => {
    return new Promise((resolve, reject) => {
      const worker = workerRef.current;
      if (!worker) {
        return reject(new Error("Solver worker is not available."));
      }
      const id = idRef.current++;
      // The 'result as T' cast is acceptable here because the caller defines the expected type T
      callbacksRef.current.set(id, (result) => resolve(result as T));
      errorCallbacksRef.current.set(id, reject);
      
      worker.postMessage({ id, task, payload });
    });
  }, []);

  // Specific, strongly-typed function for finding words
  const findWords = useCallback((letters: string[], lang: 'en' | 'ar', category: string, minLen = 2): Promise<string[]> => {
    return callWorker<string[]>('find-words-from-letters', { letters, lang, category, minLen });
  }, [callWorker]);

  return { findWords };
}
