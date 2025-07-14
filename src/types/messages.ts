// src/types/messages.ts

export interface PhraseJsonItem {
  id: number;
  key: string;
  base: string;
}

export interface CategoryJsonData {
  title: string;
  items: PhraseJsonItem[];
}

export interface Messages {
  HomePage: {
    title: string;
    subtitle: string;
  };
  Categories: {
    greetings: string;
    transport: string;
    hotel: string;
    dining: string;
    directions: string;
    shopping: string;
    emergency: string;
    basics: string;
  };
  LocaleLayout: {
    title: string;
    description: string;
  };
  Phrases: {
    greetings: CategoryJsonData;
    transport: CategoryJsonData;
    hotel: CategoryJsonData;
    dining: CategoryJsonData;
    directions: CategoryJsonData;
    shopping: CategoryJsonData;
    emergency: CategoryJsonData;
    basics: CategoryJsonData;
  };
}