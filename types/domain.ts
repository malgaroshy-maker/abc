export type Shift = "night" | "morning" | "evening";
export type Role = "engineer" | "supervisor" | "admin";

export interface UserProfile {
  id: string;
  factory_id: string;
  section_id: string | null;
  full_name: string;
  role: Role;
  language: string;
  accent_color: string;
}

export interface LogEntry {
  id: string;
  factory_id: string;
  section_id: string;
  date: string;
  shift: Shift;
  machine_id: string;
  line_ids: string[];
  engineer_ids: string[];
  start_time: string;
  end_time: string;
  downtime_minutes: number;
  work_description: string;
  notes: string;
  created_by: string;
  deleted_at: string | null;
  updated_at: string;
}

export interface Stoppage {
  id: string;
  log_entry_id: string;
  start_time: string;
  end_time: string;
  minutes: number;
}

export interface SparePartUsage {
  id: string;
  log_entry_id: string;
  spare_part_id: string;
  quantity: number;
}

export interface TodoItem {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  section_id: string;
  created_by: string;
}
