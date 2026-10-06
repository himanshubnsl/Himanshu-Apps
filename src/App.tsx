/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Board,
  Difficulty,
  GameMode,
  GameStatus,
  MoveRecord,
  Player,
  ScoreState,
  WinningInfo,
} from './types';
import { checkWin, getComputerMove, isBoardFull } from './utils/gameLogic';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { BoardTile } from './components/BoardTile';
import { GameControls } from './components/GameControls';
import { RoundResultModal } from './components/RoundResultModal';
import { HowToPlayModal } from './components/HowToPlayModal';

const INITIAL_BOARD: Board = Array(9).fill(null);

const STORAGE_KEYS = {
  SCORES: 'ttt_master_scores_v2',
  MODE: 'ttt_master_mode',
  DIFFICULTY: 'ttt_master_diff',
  USER_SYMBOL: 'ttt_master_symbol',
};

export default function App() {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.MODE) as GameMode) || 'two_player';
  });
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    return (localStorage.getItem(STORAGE_KEYS.DIFFICULTY) as Difficulty) || 'medium';
  });
  const [userSymbol, setUserSymbol] = useState<Player>(() => {
    return (localStorage.getItem(STORAGE_KEYS.USER_SYMBOL) as Player) || 'X';
  });
  const [gameStatus, setGameStatus] = useState<GameStatus>('in_progress');
  const [winningInfo, setWinningInfo] = useState<WinningInfo | null>(null);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Custom Player Names
  const [player1Name, setPlayer1Name] = useState<string>(() => {
    return localStorage.getItem('ttt_player1_name') || 'Player 1';
  });
  const [player2Name, setPlayer2Name] = useState<string>(() => {
    return localStorage.getItem('ttt_player2_name') || 'Player 2';
  });

  useEffect(() => {
    localStorage.setItem('ttt_player1_name', player1Name);
  }, [player1Name]);

  useEffect(() => {
    localStorage.setItem('ttt_player2_name', player2Name);
  }, [player2Name]);

  // Score Tracking: Player 1, Player 2, and Computer wins
  const [scores, setScores] = useState<ScoreState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCORES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          player1Wins: Number(parsed.player1Wins || 0),
          player2Wins: Number(parsed.player2Wins || 0),
          computerWins: Number(parsed.computerWins || 0),
          draws: Number(parsed.draws || 0),
          totalGames: Number(parsed.totalGames || 0),
        };
      }
    } catch {
      // ignore
    }
    return {
      player1Wins: 0,
      player2Wins: 0,
      computerWins: 0,
      draws: 0,
      totalGames: 0,
    };
  });

  const aiSymbol: Player = userSymbol === 'X' ? 'O' : 'X';

  // Persist scores
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
  }, [scores]);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODE, gameMode);
  }, [gameMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DIFFICULTY, difficulty);
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_SYMBOL, userSymbol);
  }, [userSymbol]);

  // Update sound state
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.setEnabled(nextState);
    if (nextState) sound.playClick();
  };

  // Computer Move Execution
  const triggerComputerMove = useCallback(
    (currentBoard: Board, computerPlayer: Player) => {
      setIsComputerThinking(true);

      const delay = Math.floor(Math.random() * 200) + 350; // 350-550ms human-like pacing

      setTimeout(() => {
        const move = getComputerMove(currentBoard, difficulty, computerPlayer);
        if (move === -1) {
          setIsComputerThinking(false);
          return;
        }

        const newBoard = [...currentBoard];
        newBoard[move] = computerPlayer;

        sound.playMove(computerPlayer);

        const win = checkWin(newBoard);
        if (win) {
          setBoard(newBoard);
          setWinningInfo(win);
          setGameStatus('won');
          sound.playWin();

          // Computer won
          setScores((prev) => ({
            ...prev,
            computerWins: prev.computerWins + 1,
            totalGames: prev.totalGames + 1,
          }));

          setMoveHistory((prev) => [
            ...prev,
            { index: move, player: computerPlayer, boardState: newBoard },
          ]);
          setIsComputerThinking(false);
          return;
        }

        if (isBoardFull(newBoard)) {
          setBoard(newBoard);
          setGameStatus('draw');
          sound.playDraw();

          setScores((prev) => ({
            ...prev,
            draws: prev.draws + 1,
            totalGames: prev.totalGames + 1,
          }));

          setMoveHistory((prev) => [
            ...prev,
            { index: move, player: computerPlayer, boardState: newBoard },
          ]);
          setIsComputerThinking(false);
          return;
        }

        setBoard(newBoard);
        const nextPlayer: Player = computerPlayer === 'X' ? 'O' : 'X';
        setCurrentPlayer(nextPlayer);
        setMoveHistory((prev) => [
          ...prev,
          { index: move, player: computerPlayer, boardState: newBoard },
        ]);
        setIsComputerThinking(false);
      }, delay);
    },
    [difficulty]
  );

  // 'Next Round' for continuing a series match without clearing score counts
  const handleNextRound = useCallback(() => {
    sound.playClick();
    setBoard(INITIAL_BOARD);
    setCurrentPlayer('X');
    setGameStatus('in_progress');
    setWinningInfo(null);
    setMoveHistory([]);
    setIsComputerThinking(false);

    // If playing vs computer and user plays as 'O', computer takes first move as 'X'
    if (gameMode === 'computer' && userSymbol === 'O') {
      triggerComputerMove(INITIAL_BOARD, 'X');
    }
  }, [gameMode, userSymbol, triggerComputerMove]);

  // 'New Game' button: Resets the board, all active game states, AND resets all score counters to 0
  const handleNewGame = useCallback(() => {
    sound.playClick();
    setBoard(INITIAL_BOARD);
    setCurrentPlayer('X');
    setGameStatus('in_progress');
    setWinningInfo(null);
    setMoveHistory([]);
    setIsComputerThinking(false);

    // Reset score counters to 0
    const emptyScores: ScoreState = {
      player1Wins: 0,
      player2Wins: 0,
      computerWins: 0,
      draws: 0,
      totalGames: 0,
    };
    setScores(emptyScores);
    try {
      localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(emptyScores));
    } catch {
      // ignore
    }

    // If playing vs computer and user plays as 'O', computer takes first move as 'X'
    if (gameMode === 'computer' && userSymbol === 'O') {
      triggerComputerMove(INITIAL_BOARD, 'X');
    }
  }, [gameMode, userSymbol, triggerComputerMove]);

  // Reset all win tallies
  const handleResetScores = () => {
    if (window.confirm('Reset all scores for Player 1, Player 2, and Computer?')) {
      const emptyScores: ScoreState = {
        player1Wins: 0,
        player2Wins: 0,
        computerWins: 0,
        draws: 0,
        totalGames: 0,
      };
      setScores(emptyScores);
      try {
        localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(emptyScores));
      } catch {
        // ignore
      }
      sound.playClick();
    }
  };

  // Cell Click Handler
  const handleCellClick = useCallback(
    (index: number) => {
      if (
        board[index] !== null ||
        gameStatus !== 'in_progress' ||
        isComputerThinking
      ) {
        return;
      }

      // If playing vs computer, ensure it's human's turn
      if (gameMode === 'computer' && currentPlayer !== userSymbol) {
        return;
      }

      const newBoard = [...board];
      newBoard[index] = currentPlayer;

      sound.playMove(currentPlayer);

      // Check for win
      const win = checkWin(newBoard);
      if (win) {
        setBoard(newBoard);
        setWinningInfo(win);
        setGameStatus('won');
        sound.playWin();

        setScores((prev) => {
          let p1 = prev.player1Wins;
          let p2 = prev.player2Wins;
          let comp = prev.computerWins;

          if (gameMode === 'two_player') {
            if (win.winner === 'X') {
              p1 += 1;
            } else {
              p2 += 1;
            }
          } else {
            if (win.winner === userSymbol) {
              p1 += 1; // Human (Player 1) won vs Computer
            } else {
              comp += 1; // Computer won
            }
          }

          return {
            ...prev,
            player1Wins: p1,
            player2Wins: p2,
            computerWins: comp,
            totalGames: prev.totalGames + 1,
          };
        });

        setMoveHistory((prev) => [
          ...prev,
          { index, player: currentPlayer, boardState: newBoard },
        ]);
        return;
      }

      // Check for draw
      if (isBoardFull(newBoard)) {
        setBoard(newBoard);
        setGameStatus('draw');
        sound.playDraw();

        setScores((prev) => ({
          ...prev,
          draws: prev.draws + 1,
          totalGames: prev.totalGames + 1,
        }));

        setMoveHistory((prev) => [
          ...prev,
          { index, player: currentPlayer, boardState: newBoard },
        ]);
        return;
      }

      setBoard(newBoard);
      setMoveHistory((prev) => [
        ...prev,
        { index, player: currentPlayer, boardState: newBoard },
      ]);

      const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);

      // Trigger AI if computer mode
      if (gameMode === 'computer' && nextPlayer === aiSymbol) {
        triggerComputerMove(newBoard, aiSymbol);
      }
    },
    [
      board,
      gameStatus,
      isComputerThinking,
      gameMode,
      currentPlayer,
      userSymbol,
      aiSymbol,
      triggerComputerMove,
    ]
  );

  // Undo Move handler
  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0 || isComputerThinking) return;

    sound.playUndo();

    if (gameMode === 'two_player') {
      const historyCopy = [...moveHistory];
      historyCopy.pop();

      const lastBoard =
        historyCopy.length > 0
          ? [...historyCopy[historyCopy.length - 1].boardState]
          : [...INITIAL_BOARD];

      const prevPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';

      setBoard(lastBoard);
      setCurrentPlayer(prevPlayer);
      setMoveHistory(historyCopy);
      setGameStatus('in_progress');
      setWinningInfo(null);
    } else {
      // In Computer mode: undo both the AI response and human's move
      const historyCopy = [...moveHistory];

      if (
        historyCopy.length >= 2 &&
        historyCopy[historyCopy.length - 1].player === aiSymbol
      ) {
        historyCopy.pop(); // remove computer move
        historyCopy.pop(); // remove human move
      } else if (historyCopy.length >= 1) {
        historyCopy.pop(); // remove last move
      }

      const lastBoard =
        historyCopy.length > 0
          ? [...historyCopy[historyCopy.length - 1].boardState]
          : [...INITIAL_BOARD];

      setBoard(lastBoard);
      setCurrentPlayer(userSymbol);
      setMoveHistory(historyCopy);
      setGameStatus('in_progress');
      setWinningInfo(null);
    }
  }, [moveHistory, isComputerThinking, gameMode, currentPlayer, aiSymbol, userSymbol]);

  // Mode change handler
  const handleSelectMode = (newMode: GameMode) => {
    if (newMode === gameMode) return;
    sound.playClick();
    setGameMode(newMode);
    setBoard(INITIAL_BOARD);
    setCurrentPlayer('X');
    setGameStatus('in_progress');
    setWinningInfo(null);
    setMoveHistory([]);
    setIsComputerThinking(false);

    if (newMode === 'computer' && userSymbol === 'O') {
      triggerComputerMove(INITIAL_BOARD, 'X');
    }
  };

  // Difficulty change handler
  const handleSelectDifficulty = (newDiff: Difficulty) => {
    sound.playClick();
    setDifficulty(newDiff);
  };

  // Symbol change handler
  const handleSelectUserSymbol = (symbol: Player) => {
    if (symbol === userSymbol) return;
    sound.playClick();
    setUserSymbol(symbol);
    setBoard(INITIAL_BOARD);
    setCurrentPlayer('X');
    setGameStatus('in_progress');
    setWinningInfo(null);
    setMoveHistory([]);
    setIsComputerThinking(false);

    if (symbol === 'O') {
      triggerComputerMove(INITIAL_BOARD, 'X');
    }
  };

  // Global Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal or dialog open, check for Enter
      if (gameStatus !== 'in_progress') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNewGame();
          return;
        }
      }

      // Prevent key shortcuts while typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Keys 1 through 9 for grid cells (Numpad or top-row numbers)
      const keyNum = parseInt(e.key, 10);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 9) {
        e.preventDefault();
        handleCellClick(keyNum - 1);
        return;
      }

      // 'U' for Undo
      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        handleUndo();
        return;
      }

      // 'N' or 'R' for New Game / Restart
      if (e.key === 'n' || e.key === 'N' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleNewGame();
        return;
      }

      // 'M' for Mute toggle
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleSound();
        return;
      }

      // Escape to close help
      if (e.key === 'Escape' && isHelpOpen) {
        setIsHelpOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameStatus,
    handleCellClick,
    handleUndo,
    handleNewGame,
    handleToggleSound,
    isHelpOpen,
  ]);

  // Determine interactivity
  const isInteractive =
    gameStatus === 'in_progress' &&
    !isComputerThinking &&
    (gameMode === 'two_player' || currentPlayer === userSymbol);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Header with New Game action */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHelp={() => setIsHelpOpen(true)}
        onNewGame={handleNewGame}
      />

      {/* Main Game Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-7 flex flex-col items-center justify-between gap-5 sm:gap-6">
        {/* Simple Score Tracking System: Player 1, Player 2, and Computer */}
        <ScoreBoard
          scores={scores}
          activePlayer={currentPlayer}
          gameMode={gameMode}
          userSymbol={userSymbol}
          isComputerThinking={isComputerThinking}
          player1Name={player1Name}
          player2Name={player2Name}
          onUpdatePlayer1Name={setPlayer1Name}
          onUpdatePlayer2Name={setPlayer2Name}
          onResetScores={handleResetScores}
        />

        {/* Board Arena */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto aspect-square p-3 sm:p-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 shadow-2xl relative">
          <div className="grid grid-cols-3 grid-rows-3 gap-2.5 sm:gap-3.5 h-full w-full">
            {board.map((cellValue, idx) => {
              const isWinningCell =
                winningInfo !== null && winningInfo.line.includes(idx);

              return (
                <BoardTile
                  key={idx}
                  index={idx}
                  value={cellValue}
                  isWinningCell={isWinningCell}
                  isCurrentTurn={
                    gameMode === 'two_player' || currentPlayer === userSymbol
                  }
                  activePlayer={currentPlayer}
                  isInteractive={isInteractive}
                  onClick={handleCellClick}
                />
              );
            })}
          </div>

          {/* AI Thinking Overlay Spinner */}
          {isComputerThinking && (
            <div className="absolute top-3 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-full text-[11px] text-slate-300 shadow-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>AI calculating…</span>
            </div>
          )}
        </div>

        {/* Game Mode, Difficulty & Action Controls (with player name inputs & 'New Game' button) */}
        <GameControls
          gameMode={gameMode}
          difficulty={difficulty}
          userSymbol={userSymbol}
          canUndo={moveHistory.length > 0}
          isComputerThinking={isComputerThinking}
          player1Name={player1Name}
          player2Name={player2Name}
          onUpdatePlayer1Name={setPlayer1Name}
          onUpdatePlayer2Name={setPlayer2Name}
          onSelectMode={handleSelectMode}
          onSelectDifficulty={handleSelectDifficulty}
          onSelectUserSymbol={handleSelectUserSymbol}
          onUndo={handleUndo}
          onNewGame={handleNewGame}
        />
      </main>

      {/* Result Dialog Modal */}
      <RoundResultModal
        status={gameStatus}
        winningInfo={winningInfo}
        gameMode={gameMode}
        userSymbol={userSymbol}
        player1Name={player1Name}
        player2Name={player2Name}
        onNextRound={handleNextRound}
        onNewGame={handleNewGame}
      />

      {/* How to Play Dialog */}
      <HowToPlayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Footer Minimalist Contract */}
      <footer className="w-full border-t border-slate-800/60 py-3 text-center text-xs text-slate-400">
        <span>Tic Tac Toe Master · Press N for New Game · Keys 1–9 to place marks · U to undo</span>
      </footer>
    </div>
  );
}
