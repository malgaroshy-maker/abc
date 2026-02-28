import Dexie, { Table } from "dexie";
import { LogEntry } from "@/types/domain";

export interface OfflineLogEntry extends LogEntry {
  dirty: 0 | 1;
  local_updated_at: string;
}

class MaintLogDB extends Dexie {
  log_entries!: Table<OfflineLogEntry, string>;

  constructor() {
    super("maintlog-db");
    this.version(1).stores({
      log_entries: "id, section_id, date, shift, dirty, local_updated_at"
    });
  }
}

export const offlineDB = new MaintLogDB();
