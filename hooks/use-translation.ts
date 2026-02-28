import { messages } from "@/lib/i18n/messages";
import { useSettingsStore } from "@/store/use-settings-store";

export function useTranslation() {
  const language = useSettingsStore((s) => s.language);
  const locale = language in messages ? (language as keyof typeof messages) : "en";
  return messages[locale];
}
