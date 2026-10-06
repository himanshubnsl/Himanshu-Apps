import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameMode, GameStatus, Player, WinningInfo } from '../types';
import { RotateCcw, Trophy, Frown, Equal, Play } from 'lucide-react';

interface RoundResultModalProps {
  status: GameStatus;
  winningInfo: WinningInfo | null;
  gameMode: GameMode;
  userSymbol: Player;
  player1Name: string;
  player2Name: string;
  onNextRound: () => void;
  onNewGame: () => void;
}

export const RoundResultModal: React.FC<RoundResultModalProps> = ({
  status,
  winningInfo,
  gameMode,
  userSymbol,
  player1Name,
  player2Name,
  onNextRound,
  onNewGame,
}) => {
  const displayP1 = player1Name.trim() || 'Player 1';
  const displayP2 = player2Name.trim() || 'Player 2';

  useEffect(() => {
    if (status === 'won') {
      const isUserWin =
        gameMode === 'two_player' || winningInfo?.winner === userSymbol;

      if (isUserWin) {
        // Vibrant celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#38bdf8', '#818cf8', '#f43f5e', '#fbbf24'],
        });
      }
    }
  }, [status, winningInfo, gameMode, userSymbol]);

  if (status === 'in_progress') return null;

  const isWon = status === 'won';
  const winner = winningInfo?.winner;

  let title = '';
  let subtext = '';
  let badgeColor = '';
  let winnerDisplayName = '';

  if (isWon) {
    if (gameMode === 'two_player') {
      winnerDisplayName = winner === 'X' ? displayP1 : displayP2;
      title = `${winnerDisplayName} Wins!`;
      subtext = 'Flawless victory! Ready for the next match?';
      badgeColor = winner === 'X' ? 'text-sky-400' : 'text-rose-400';
    } else {
      if (winner === userSymbol) {
        winnerDisplayName = displayP1;
        title = `${displayP1} Won!`;
        subtext = 'Outstanding tactics against the AI!';
        badgeColor = 'text-emerald-400';
      } else {
        winnerDisplayName = 'Computer';
        title = 'Computer Wins!';
        subtext = 'A sharp game. Try another strategy!';
        badgeColor = 'text-indigo-400';
      }
    }
  } else {
    title = "It's a Draw!";
    subtext = 'A perfectly contested stalemate.';
    badgeColor = 'text-amber-400';
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-4 scale-in-95 duration-150">
        {/* Result Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center">
          {isWon ? (
            gameMode === 'computer' && winner !== userSymbol ? (
              <Frown className="w-8 h-8 text-indigo-400" />
            ) : (
              <Trophy className={`w-8 h-8 ${badgeColor}`} />
            )
          ) : (
            <Equal className="w-8 h-8 text-amber-400" />
          )}
        </div>

        {/* Text */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-display text-slate-100">
            {title}
          </h2>
          <p className="text-xs text-slate-400">
            {subtext}
          </p>
        </div>

        {/* Winning Symbol Graphic if Won */}
        {isWon && winner && (
          <div className="py-2 flex items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Winner:</span>
            <span
              className={`text-lg font-bold font-mono ${
                winner === 'X' ? 'text-sky-400' : 'text-rose-400'
              }`}
            >
              {winner === 'X' ? `✕ ${winnerDisplayName}` : `○ ${winnerDisplayName}`}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={onNextRound}
            autoFocus
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Next Round (Keep Scores)</span>
          </button>

          <button
            type="button"
            onClick={onNewGame}
            className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Game (Reset Scores to 0)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
