# MaintLog AI

MaintLog AI is a production-ready industrial maintenance logbook built with Next.js + Supabase. It supports multi-shift operations, section-scoped access control, offline-first workflows, AI-assisted operations, and PDF/CSV export.

## Stack
- Next.js App Router + TypeScript + TailwindCSS
- Zustand state management
- TanStack Table logbook grid
- React Hook Form + Zod validation
- Recharts KPI dashboard
- Supabase Auth/Postgres/Storage
- Dexie IndexedDB offline engine

## Features
- Three-shift color-coded logbook (night/morning/evening)
- Multi-stoppage downtime computation
- Undo/Redo stack (20 operations)
- Soft delete + restore
- KPI dashboard (downtime, MTTR, MTBF, usage trends)
- Section-scoped to-do system
- Preventive maintenance tracker
- AI assistant with destructive-action confirmation
- Export to CSV and A4 landscape PDF
- Theme and accent personalization
- i18n-ready language selection

## Project Structure
```
app/
  api/
    ai/route.ts
    export/route.ts
  globals.css
  layout.tsx
  manifest.ts
  page.tsx
components/
  app-shell.tsx
  dashboard-tabs.tsx
  settings-panel.tsx
  ui/button.tsx
features/
  ai/ai-assistant.tsx
  kpi/kpi-feature.tsx
  logbook/log-entry-form.tsx
  logbook/logbook-feature.tsx
  pm/preventive-feature.tsx
  todo/todo-feature.tsx
lib/
  i18n/messages.ts
  supabase.ts
  utils.ts
  validation.ts
store/
  use-logbook-store.ts
  use-settings-store.ts
hooks/
  use-translation.ts
types/
  domain.ts
services/
  ai.service.ts
  export.service.ts
  kpi.service.ts
  logbook.service.ts
  offline-db.ts
  sync-engine.ts
backend/supabase/
  schema.sql
  rls.sql
  README.md
docs/
  architecture.md
.env.example
README.md
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables from `.env.example`.
3. Provision Supabase and run SQL files:
   - `backend/supabase/schema.sql`
   - `backend/supabase/rls.sql`
4. Create storage bucket `logos` in Supabase.
5. Run app:
   ```bash
   npm run dev
   ```

## Security and Access
- Engineers/Supervisors can only read/write their assigned section.
- Admins can manage all sections and master data.
- RLS policies enforce row-level isolation and creator delete rules for todos.

## Offline Sync Flow
1. Record written to IndexedDB with `dirty=1`.
2. UI reflects local data immediately.
3. Online listener triggers sync.
4. Conflict policy uses last-write-wins based on timestamps.
5. Dirty flag cleared after successful remote upsert.
