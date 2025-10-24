export type Step = "contact" | "address" | "newClient" | "date" | "time" | "confirm";

export type Language = "es" | "en";

export interface Translations {
  title: string;
  stepDescriptions: {
    address: string;
    newClient: string;
    contact: string;
    date: string;
    time: string;
  };
  contact: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    continueButton: string;
    nameRequired: string;
    phoneRequired: string;
    phoneInvalid: string;
  };
  address: {
    question: string;
    canGo: string;
    cantGo: string;
  };
  client: {
    question: string;
    newClient: string;
    existingClient: string;
  };
  date: {
    title: string;
  };
  time: {
    title: string;
    confirm: string;
  };
  toast: {
    title: string;
    description: string;
    error: string;
    errorDescription: string;
  };
}

export interface TranslationConfig {
  es: Translations;
  en: Translations;
}