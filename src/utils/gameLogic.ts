import { Board, Cell, Difficulty, Player, WinningInfo } from '../types';

export const WINNING_COMBINATIONS: [number, number, number][] = [
  [0, 1, 2], // Row 0
  [3, 4, 5], // Row 1
  [6, 7, 8], // Row 2
  [0, 3, 6], // Col 0
  [1, 4, 7], // Col 1
  [2, 5, 8], // Col 2
  [0, 4, 8], // Diagonal 1
  [2, 4, 6], // Diagonal 2
];

export function checkWin(board: Board): WinningInfo | null {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        line: combo,
      };
    }
  }
  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

export function getAvailableMoves(board: Board): number[] {
  const moves: number[] = [];
  board.forEach((cell, index) => {
    if (cell === null) moves.push(index);
  });
  return moves;
}

// Minimax algorithm for unbeatable AI
function minimax(
  currentBoard: Board,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player
): { score: number; move?: number } {
  const winInfo = checkWin(currentBoard);

  if (winInfo) {
    if (winInfo.winner === aiPlayer) {
      return { score: 10 - depth };
    } else {
      return { score: depth - 10 };
    }
  }

  if (isBoardFull(currentBoard)) {
    return { score: 0 };
  }

  const availableMoves = getAvailableMoves(currentBoard);

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      currentBoard[move] = aiPlayer;
      const result = minimax(currentBoard, depth + 1, false, aiPlayer, humanPlayer);
      currentBoard[move] = null;

      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
    }

    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      currentBoard[move] = humanPlayer;
      const result = minimax(currentBoard, depth + 1, true, aiPlayer, humanPlayer);
      currentBoard[move] = null;

      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
    }

    return { score: bestScore, move: bestMove };
  }
}

// Check if a move results in a win
function findWinningMove(board: Board, player: Player): number | null {
  const availableMoves = getAvailableMoves(board);
  for (const move of availableMoves) {
    board[move] = player;
    const win = checkWin(board);
    board[move] = null;
    if (win && win.winner === player) {
      return move;
    }
  }
  return null;
}

export function getComputerMove(
  board: Board,
  difficulty: Difficulty,
  aiPlayer: Player
): number {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) return -1;

  // Easy: Mostly random (80%), occasionally blocks immediate loss (20%)
  if (difficulty === 'easy') {
    if (Math.random() < 0.2) {
      const blockMove = findWinningMove(board, humanPlayer);
      if (blockMove !== null) return blockMove;
    }
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // Medium: Smart heuristic with deliberate room for human tactical counterplay
  if (difficulty === 'medium') {
    // 1. Check if AI can win right now
    const winMove = findWinningMove(board, aiPlayer);
    if (winMove !== null) return winMove;

    // 2. Check if human is about to win and block it (85% of time)
    if (Math.random() < 0.85) {
      const blockMove = findWinningMove(board, humanPlayer);
      if (blockMove !== null) return blockMove;
    }

    // 3. Take center if available with 60% chance
    if (board[4] === null && Math.random() < 0.6) {
      return 4;
    }

    // 4. Take corners if available
    const corners = [0, 2, 6, 8].filter((idx) => board[idx] === null);
    if (corners.length > 0 && Math.random() < 0.5) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Otherwise random available
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Hard: Unbeatable Minimax
  // Optimize opening moves for instant response:
  if (availableMoves.length === 9) {
    // First move on empty board: center or corners are all optimal
    const openingMoves = [0, 2, 4, 6, 8];
    return openingMoves[Math.floor(Math.random() * openingMoves.length)];
  }

  const { move } = minimax([...board], 0, true, aiPlayer, humanPlayer);
  return move !== undefined ? move : availableMoves[0];
}
