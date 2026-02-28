"use client";

import { useState } from "react";
import { LogbookFeature } from "@/features/logbook/logbook-feature";
import { KpiFeature } from "@/features/kpi/kpi-feature";
import { TodoFeature } from "@/features/todo/todo-feature";
import { PreventiveFeature } from "@/features/pm/preventive-feature";
import { AiAssistant } from "@/features/ai/ai-assistant";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { SettingsPanel } from "@/components/settings-panel";

export function DashboardTabs() {
  const [active, setActive] = useState("logbook");
  const t = useTranslation();

  const tabs = [
    { key: "logbook", label: t.logbook, component: <LogbookFeature /> },
    { key: "kpi", label: t.kpi, component: <KpiFeature /> },
    { key: "todo", label: t.todo, component: <TodoFeature /> },
    { key: "preventive", label: t.preventive, component: <PreventiveFeature /> }
  ];

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">MaintLog AI</h1>
        <div className="flex flex-wrap items-center gap-2"><SettingsPanel /><AiAssistant /></div>
      </header>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button key={tab.key} className={active === tab.key ? "ring-2 ring-offset-2" : "bg-slate-600"} onClick={() => setActive(tab.key)}>
            {tab.label}
          </Button>
        ))}
      </div>
      <section>{tabs.find((tab) => tab.key === active)?.component}</section>
    </div>
  );
}
