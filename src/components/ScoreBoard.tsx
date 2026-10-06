import React, { useState } from 'react';
import { GameMode, Player, ScoreState } from '../types';
import { User, Users, Bot, Scale, RotateCcw, Edit2, Check } from 'lucide-react';

interface ScoreBoardProps {
  scores: ScoreState;
  activePlayer: Player;
  gameMode: GameMode;
  userSymbol: Player;
  isComputerThinking: boolean;
  player1Name: string;
  player2Name: string;
  onUpdatePlayer1Name: (name: string) => void;
  onUpdatePlayer2Name: (name: string) => void;
  onResetScores: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  activePlayer,
  gameMode,
  userSymbol,
  isComputerThinking,
  player1Name,
  player2Name,
  onUpdatePlayer1Name,
  onUpdatePlayer2Name,
  onResetScores,
}) => {
  const [editingP1, setEditingP1] = useState(false);
  const [editingP2, setEditingP2] = useState(false);
  const [tempP1, setTempP1] = useState(player1Name);
  const [tempP2, setTempP2] = useState(player2Name);

  const displayP1 = player1Name.trim() || 'Player 1';
  const displayP2 = player2Name.trim() || 'Player 2';

  // Determine who is actively taking a turn
  const isPlayer1Turn =
    gameMode === 'two_player'
      ? activePlayer === 'X'
      : activePlayer === userSymbol && !isComputerThinking;

  const isPlayer2Turn = gameMode === 'two_player' && activePlayer === 'O';

  const isComputerTurn =
    gameMode === 'computer' && (activePlayer !== userSymbol || isComputerThinking);

  const handleSaveP1 = () => {
    onUpdatePlayer1Name(tempP1.trim() || 'Player 1');
    setEditingP1(false);
  };

  const handleSaveP2 = () => {
    onUpdatePlayer2Name(tempP2.trim() || 'Player 2');
    setEditingP2(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-2.5">
      {/* 4-Item Score Board Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
        {/* Player 1 Card */}
        <div
          className={`
            relative p-3 rounded-2xl transition-all duration-200 border flex flex-col justify-between
            ${
              isPlayer1Turn
                ? 'bg-slate-900 border-sky-500/70 shadow-[0_0_18px_rgba(56,189,248,0.22)]'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
            }
          `}
        >
          {isPlayer1Turn && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-sky-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider rounded-md shadow-sm">
              Turn
            </span>
          )}

          {/* Name header with quick edit */}
          <div className="flex items-center justify-center gap-1.5 mb-1 group">
            <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            {editingP1 ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  maxLength={15}
                  value={tempP1}
                  onChange={(e) => setTempP1(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveP1()}
                  autoFocus
                  className="w-20 px-1 py-0.5 bg-slate-950 border border-sky-500 rounded text-xs text-slate-100 text-center focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveP1}
                  className="p-0.5 text-sky-400 hover:text-sky-300"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 max-w-[85%]">
                <span
                  title={displayP1}
                  className="text-xs font-semibold text-slate-200 truncate cursor-pointer hover:underline underline-offset-2"
                  onClick={() => {
                    setTempP1(player1Name);
                    setEditingP1(true);
                  }}
                >
                  {displayP1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTempP1(player1Name);
                    setEditingP1(true);
                  }}
                  className="opacity-40 group-hover:opacity-100 text-slate-400 hover:text-slate-200 transition-opacity p-0.5"
                  title="Rename Player 1"
                  aria-label="Rename Player 1"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-100 my-0.5">
            {scores.player1Wins}
          </div>
          <div className="text-[11px] text-slate-400">
            Wins {gameMode === 'two_player' ? '(✕)' : `(${userSymbol})`}
          </div>
        </div>

        {/* Player 2 Card */}
        <div
          className={`
            relative p-3 rounded-2xl transition-all duration-200 border flex flex-col justify-between
            ${
              gameMode !== 'two_player'
                ? 'bg-slate-900/30 border-slate-800/40 opacity-70'
                : isPlayer2Turn
                ? 'bg-slate-900 border-rose-500/70 shadow-[0_0_18px_rgba(244,63,94,0.22)]'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
            }
          `}
        >
          {isPlayer2Turn && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-rose-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider rounded-md shadow-sm">
              Turn
            </span>
          )}

          {/* Name header with quick edit */}
          <div className="flex items-center justify-center gap-1.5 mb-1 group">
            <Users className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            {editingP2 ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  maxLength={15}
                  value={tempP2}
                  onChange={(e) => setTempP2(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveP2()}
                  autoFocus
                  className="w-20 px-1 py-0.5 bg-slate-950 border border-rose-500 rounded text-xs text-slate-100 text-center focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveP2}
                  className="p-0.5 text-rose-400 hover:text-rose-300"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 max-w-[85%]">
                <span
                  title={displayP2}
                  className="text-xs font-semibold text-slate-200 truncate cursor-pointer hover:underline underline-offset-2"
                  onClick={() => {
                    setTempP2(player2Name);
                    setEditingP2(true);
                  }}
                >
                  {displayP2}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTempP2(player2Name);
                    setEditingP2(true);
                  }}
                  className="opacity-40 group-hover:opacity-100 text-slate-400 hover:text-slate-200 transition-opacity p-0.5"
                  title="Rename Player 2"
                  aria-label="Rename Player 2"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-100 my-0.5">
            {scores.player2Wins}
          </div>
          <div className="text-[11px] text-slate-400">
            Wins {gameMode !== 'two_player' ? '(2P)' : '(○)'}
          </div>
        </div>

        {/* Computer Card */}
        <div
          className={`
            relative p-3 rounded-2xl transition-all duration-200 border flex flex-col justify-between
            ${
              gameMode !== 'computer'
                ? 'bg-slate-900/30 border-slate-800/40 opacity-70'
                : isComputerTurn
                ? 'bg-slate-900 border-indigo-500/70 shadow-[0_0_18px_rgba(99,102,241,0.25)]'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
            }
          `}
        >
          {isComputerTurn && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-indigo-500 text-white font-bold text-[9px] uppercase tracking-wider rounded-md shadow-sm">
              {isComputerThinking ? 'Thinking…' : 'Turn'}
            </span>
          )}
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200 truncate">
              Computer
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-100 my-0.5">
            {scores.computerWins}
          </div>
          <div className="text-[11px] text-slate-400">
            Wins {gameMode !== 'computer' ? '(AI)' : userSymbol === 'X' ? '(○)' : '(✕)'}
          </div>
        </div>

        {/* Ties / Draws Card */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between text-slate-400">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200 truncate">
              Draws
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-200 my-0.5">
            {scores.draws}
          </div>
          <div className="text-[11px] text-slate-400">
            Ties
          </div>
        </div>
      </div>

      {/* Meta Bar: Total Games & Mode Info */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-400">
        <div>
          <span>Total Matches: <strong className="font-mono text-slate-300">{scores.totalGames}</strong></span>
          <span className="mx-1.5 text-slate-400">·</span>
          <span>
            Match:{' '}
            <strong className="text-slate-300">
              {gameMode === 'two_player' ? `${displayP1} vs ${displayP2}` : `${displayP1} vs Computer`}
            </strong>
          </span>
        </div>
        {scores.totalGames > 0 && (
          <button
            type="button"
            onClick={onResetScores}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-300 transition-colors text-[11px] hover:underline"
            title="Reset all win tallies to 0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Scores</span>
          </button>
        )}
      </div>
    </div>
  );
};
