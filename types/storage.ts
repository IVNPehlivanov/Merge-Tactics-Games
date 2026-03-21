export interface DailyPlayedRecord {
  [dayKey: string]: string[]; // gameSlug[]
}

export interface PersistedClassicState {
  guesses: unknown[];
  won: boolean;
  secretKey: string;
}

export interface PersistedPixelState {
  guesses: string[];
  won: boolean;
  secretKey: string;
}

export interface PersistedSkinState {
  guesses: string[];
  won: boolean;
  secretCardKey: string;
}
