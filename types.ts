export enum DashboardTab {
  BING = 'bing',
  HOME = 'home',
  SOCIAL = 'social',
  GAMES = 'games',
  TV_MOVIES = 'tv & movies',
  MUSIC = 'music',
  APPS = 'apps',
  SETTINGS = 'settings'
}

export interface User {
  gamertag: string;
  avatarUrl: string;
  gamerscore: number;
  isOnline: boolean;
  status: string;
  rep: number; // 0-5 stars
  zone: 'Pro' | 'Recreation' | 'Underground' | 'Family';
  motto?: string;
}

export interface Friend {
  id: string;
  gamertag: string;
  status: string;
  game?: string;
  avatarUrl: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  from: string;
  content: string;
  date: string;
  read: boolean;
}

export interface PartyMember {
  gamertag: string;
  isSpeaking: boolean;
  avatarUrl: string;
}

export interface GameItem {
  id: string;
  title: string;
  imageUrl: string;
  price?: string;
  description?: string;
}

export interface SearchResult {
  title: string;
  snippet: string;
  url?: string;
}

export type ThemeMode = 'day' | 'night';