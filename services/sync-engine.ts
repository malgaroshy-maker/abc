import { offlineDB } from "@/services/offline-db";
import { upsertLogEntry } from "@/services/logbook.service";

export async function saveLocalFirst(entry: Parameters<typeof upsertLogEntry>[0] & { id: string }) {
  await offlineDB.log_entries.put({
    ...(entry as never),
    dirty: 1,
    local_updated_at: new Date().toISOString()
  });
}

export async function syncDirtyRecords() {
  const dirtyRecords = await offlineDB.log_entries.where("dirty").equals(1).toArray();
  for (const record of dirtyRecords) {
    const remote = await upsertLogEntry(record);
    const localDate = new Date(record.local_updated_at).getTime();
    const remoteDate = new Date(remote.updated_at).getTime();
    if (localDate >= remoteDate) {
      await upsertLogEntry(record);
    }
    await offlineDB.log_entries.update(record.id, { dirty: 0, updated_at: new Date().toISOString() });
  }
}
