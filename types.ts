
export interface Example {
  word: string;
  translation: string;
  imageUrl?: string;
  searchKeyword?: string;
}

export interface KurdishLetter {
  char: string;
  name: string;
  exampleWord: string; // Keep for backward compat/primary
  exampleTranslation: string; // Keep for backward compat/primary
  examples?: Example[];
  imageUrl?: string;
  searchKeyword?: string;
}

export type AppView = 'theme-selection' | 'home' | 'letter-detail' | 'print-view';

export type UserTheme = 'boy' | 'girl';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
