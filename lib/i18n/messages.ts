export const messages = {
  en: {
    logbook: "Logbook",
    kpi: "KPI Dashboard",
    todo: "To-Do",
    preventive: "Preventive Maintenance"
  },
  tr: {
    logbook: "Defter",
    kpi: "KPI Paneli",
    todo: "Yapılacaklar",
    preventive: "Periyodik Bakım"
  }
};

export type Locale = keyof typeof messages;
