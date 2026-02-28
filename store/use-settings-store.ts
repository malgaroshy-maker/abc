import { create } from "zustand";

interface SettingsState {
  language: string;
  accentColor: string;
  setLanguage: (language: string) => void;
  setAccentColor: (color: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: "en",
  accentColor: "16 185 129",
  setLanguage: (language) => set({ language }),
  setAccentColor: (accentColor) => {
    document.documentElement.style.setProperty("--accent", accentColor);
    set({ accentColor });
  }
}));
