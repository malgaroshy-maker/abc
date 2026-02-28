"use client";

import { ReactNode, useEffect } from "react";
import { useLogbookStore } from "@/store/use-logbook-store";
import { syncDirtyRecords } from "@/services/sync-engine";

export function AppShell({ children }: { children: ReactNode }) {
  const setSyncStatus = useLogbookStore((s) => s.setSyncStatus);

  useEffect(() => {
    const runSync = async () => {
      try {
        if (!navigator.onLine) {
          setSyncStatus("offline");
          return;
        }
        setSyncStatus("syncing");
        await syncDirtyRecords();
        setSyncStatus("idle");
      } catch {
        setSyncStatus("offline");
      }
    };

    runSync();
    window.addEventListener("online", runSync);
    return () => window.removeEventListener("online", runSync);
  }, [setSyncStatus]);

  return <div className="min-h-screen p-4 md:p-8">{children}</div>;
}
