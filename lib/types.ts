export interface GuessResult {
  guess: string;
  confidence: number;
}

export interface ApiResponse {
  guess: string;
  confidence: number;
  error?: string;
}
