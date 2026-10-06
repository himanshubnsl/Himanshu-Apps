export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];

export type GameMode = 'two_player' | 'computer';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'in_progress' | 'won' | 'draw';

export interface WinningInfo {
  winner: Player;
  line: [number, number, number];
}

export interface ScoreState {
  player1Wins: number;
  player2Wins: number;
  computerWins: number;
  draws: number;
  totalGames: number;
}

export interface MoveRecord {
  index: number;
  player: Player;
  boardState: Board;
}
