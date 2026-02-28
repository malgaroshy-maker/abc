import { create } from "zustand";
import { LogEntry } from "@/types/domain";

type Snapshot = LogEntry[];

interface LogbookState {
  entries: LogEntry[];
  history: Snapshot[];
  future: Snapshot[];
  syncStatus: "idle" | "syncing" | "offline";
  setEntries: (entries: LogEntry[]) => void;
  applyChange: (entries: LogEntry[]) => void;
  undo: () => void;
  redo: () => void;
  setSyncStatus: (status: LogbookState["syncStatus"]) => void;
}

export const useLogbookStore = create<LogbookState>((set, get) => ({
  entries: [],
  history: [],
  future: [],
  syncStatus: "idle",
  setEntries: (entries) => set({ entries }),
  applyChange: (next) => {
    const current = get().entries;
    const history = [...get().history, current].slice(-20);
    set({ entries: next, history, future: [] });
  },
  undo: () => {
    const { history, entries, future } = get();
    if (!history.length) return;
    const previous = history[history.length - 1];
    set({ entries: previous, history: history.slice(0, -1), future: [entries, ...future].slice(0, 20) });
  },
  redo: () => {
    const { future, entries, history } = get();
    if (!future.length) return;
    const [next, ...rest] = future;
    set({ entries: next, future: rest, history: [...history, entries].slice(-20) });
  },
  setSyncStatus: (syncStatus) => set({ syncStatus })
}));
