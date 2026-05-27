import { useCallback, useEffect, useState } from "react";
import type { UIMessage } from "ai";

const KEY = "workly_chat_threads_v1";

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

function readAll(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Thread[]) : [];
  } catch {
    return [];
  }
}

function writeAll(threads: Thread[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(threads));
}

export function newThreadId(): string {
  return (
    "t_" +
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36)
  );
}

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>(() => readAll());

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === KEY) setThreads(readAll());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: Thread[]) => {
    const sorted = [...next].sort((a, b) => b.updatedAt - a.updatedAt);
    setThreads(sorted);
    writeAll(sorted);
  }, []);

  const upsert = useCallback(
    (id: string, patch: Partial<Thread>) => {
      const all = readAll();
      const idx = all.findIndex((t) => t.id === id);
      const base: Thread =
        idx >= 0
          ? all[idx]
          : { id, title: "New chat", updatedAt: Date.now(), messages: [] };
      const merged: Thread = { ...base, ...patch, id, updatedAt: Date.now() };
      const next = idx >= 0 ? [...all.slice(0, idx), merged, ...all.slice(idx + 1)] : [...all, merged];
      persist(next);
    },
    [persist],
  );

  const remove = useCallback(
    (id: string) => {
      persist(readAll().filter((t) => t.id !== id));
    },
    [persist],
  );

  const get = useCallback((id: string): Thread | undefined => {
    return readAll().find((t) => t.id === id);
  }, []);

  return { threads, upsert, remove, get };
}
