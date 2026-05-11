import { useState, useCallback } from "react";

interface HistoryEntry<T> {
  state: T;
  timestamp: number;
}

interface UseEditHistoryReturn<T> {
  state: T;
  setState: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
  history: HistoryEntry<T>[];
  historyIndex: number;
}

export function useEditHistory<T>(initialState: T): UseEditHistoryReturn<T> {
  const [history, setHistory] = useState<HistoryEntry<T>[]>([
    { state: initialState, timestamp: Date.now() },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const state = history[historyIndex].state;

  const setState = useCallback((newState: T) => {
    setHistory((prevHistory) => {
      // Remove qualquer histórico futuro quando um novo estado é definido
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      return [
        ...newHistory,
        { state: newState, timestamp: Date.now() },
      ];
    });
    setHistoryIndex((prevIndex) => prevIndex + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    setHistoryIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const redo = useCallback(() => {
    setHistoryIndex((prevIndex) => Math.min(history.length - 1, prevIndex + 1));
  }, [history.length]);

  const clearHistory = useCallback(() => {
    setHistory([{ state, timestamp: Date.now() }]);
    setHistoryIndex(0);
  }, [state]);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    clearHistory,
    history,
    historyIndex,
  };
}
