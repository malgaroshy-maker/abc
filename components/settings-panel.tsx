"use client";

import { useTheme } from "next-themes";
import { useSettingsStore } from "@/store/use-settings-store";

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, accentColor, setAccentColor } = useSettingsStore();

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <select className="rounded border px-2 py-1" value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
      <select className="rounded border px-2 py-1" value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">EN</option>
        <option value="tr">TR</option>
      </select>
      <input
        className="h-8 w-20 rounded border"
        type="color"
        value={`#${accentColor.split(" ").map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`}
        onChange={(event) => {
          const hex = event.target.value;
          const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");
          setAccentColor(rgb);
        }}
      />
    </div>
  );
}
