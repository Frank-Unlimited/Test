export enum Tab {
  HOME = 'HOME',
  MAKEUP = 'MAKEUP',
  BODY = 'BODY',
  FASHION = 'FASHION',
  VOICE = 'VOICE',
  POSTURE = 'POSTURE',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface SectionContent {
  title: string;
  description: string;
  coreTips: string[];
  geminiPromptContext: string;
}