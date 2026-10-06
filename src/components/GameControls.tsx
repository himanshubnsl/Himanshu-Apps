import React from 'react';
import { Difficulty, GameMode, Player } from '../types';
import { Users, Bot, Undo2, RotateCcw, Sparkles, Brain, Zap } from 'lucide-react';

interface GameControlsProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  userSymbol: Player;
  canUndo: boolean;
  isComputerThinking: boolean;
  player1Name: string;
  player2Name: string;
  onUpdatePlayer1Name: (name: string) => void;
  onUpdatePlayer2Name: (name: string) => void;
  onSelectMode: (mode: GameMode) => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onSelectUserSymbol: (symbol: Player) => void;
  onUndo: () => void;
  onNewGame: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  difficulty,
  userSymbol,
  canUndo,
  isComputerThinking,
  player1Name,
  player2Name,
  onUpdatePlayer1Name,
  onUpdatePlayer2Name,
  onSelectMode,
  onSelectDifficulty,
  onSelectUserSymbol,
  onUndo,
  onNewGame,
}) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Primary Mode Switcher (Segmented Control - functional buttons) */}
      <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-1">
        <button
          type="button"
          onClick={() => onSelectMode('two_player')}
          disabled={isComputerThinking}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            gameMode === 'two_player'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-sky-400" />
          <span>Pass & Play (2P)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('computer')}
          disabled={isComputerThinking}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            gameMode === 'computer'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          <span>vs Computer</span>
        </button>
      </div>

      {/* Two Player: Custom Player Names Config */}
      {gameMode === 'two_player' && (
        <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>Player Names</span>
            <span className="text-[10px] text-slate-400">Click to customize</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="p1-name-input" className="block text-[10px] text-sky-400 font-semibold mb-1 truncate">
                Player 1 (✕)
              </label>
              <input
                id="p1-name-input"
                type="text"
                maxLength={15}
                value={player1Name}
                onChange={(e) => onUpdatePlayer1Name(e.target.value)}
                placeholder="Player 1"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="p2-name-input" className="block text-[10px] text-rose-400 font-semibold mb-1 truncate">
                Player 2 (○)
              </label>
              <input
                id="p2-name-input"
                type="text"
                maxLength={15}
                value={player2Name}
                onChange={(e) => onUpdatePlayer2Name(e.target.value)}
                placeholder="Player 2"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* Computer Sub-options */}
      {gameMode === 'computer' && (
        <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-3 text-xs">
          {/* Your Name */}
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="p1-solo-name" className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
              Your Name
            </label>
            <input
              id="p1-solo-name"
              type="text"
              maxLength={15}
              value={player1Name}
              onChange={(e) => onUpdatePlayer1Name(e.target.value)}
              placeholder="Player 1"
              className="max-w-[150px] bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors text-right"
            />
          </div>

          {/* Difficulty Level Tabs */}
          <div className="pt-1 border-t border-slate-800/60">
            <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Computer Difficulty</span>
              <span className="text-slate-300">
                {difficulty === 'easy' && 'Casual / Relaxed'}
                {difficulty === 'medium' && 'Balanced / Tactical'}
                {difficulty === 'hard' && 'Unbeatable Minimax'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/60 rounded-lg border border-slate-800/60">
              <button
                type="button"
                onClick={() => onSelectDifficulty('easy')}
                disabled={isComputerThinking}
                className={`py-1.5 px-2 font-medium rounded-md text-center transition-all flex items-center justify-center gap-1.5 ${
                  difficulty === 'easy'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Easy</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectDifficulty('medium')}
                disabled={isComputerThinking}
                className={`py-1.5 px-2 font-medium rounded-md text-center transition-all flex items-center justify-center gap-1.5 ${
                  difficulty === 'medium'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain className="w-3 h-3 text-sky-400" />
                <span>Medium</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectDifficulty('hard')}
                disabled={isComputerThinking}
                className={`py-1.5 px-2 font-medium rounded-md text-center transition-all flex items-center justify-center gap-1.5 ${
                  difficulty === 'hard'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Unbeatable</span>
              </button>
            </div>
          </div>

          {/* Player Symbol Pick */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <span className="text-[11px] font-medium text-slate-400">Play as</span>
            <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800/60">
              <button
                type="button"
                onClick={() => onSelectUserSymbol('X')}
                disabled={isComputerThinking}
                className={`px-3 py-1 font-bold rounded-md transition-all ${
                  userSymbol === 'X'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ✕ (First)
              </button>
              <button
                type="button"
                onClick={() => onSelectUserSymbol('O')}
                disabled={isComputerThinking}
                className={`px-3 py-1 font-bold rounded-md transition-all ${
                  userSymbol === 'O'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ○ (Second)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons: New Game & Undo */}
      <div className="flex items-center justify-between gap-3 pt-0.5">
        <button
          type="button"
          onClick={onNewGame}
          disabled={isComputerThinking}
          className="flex-1 inline-flex items-center justify-center gap-2 text-xs font-semibold py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset board and all score counters to 0 (N or R)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>

        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo || isComputerThinking}
          className={`inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3.5 rounded-xl border transition-all ${
            canUndo && !isComputerThinking
              ? 'text-slate-300 bg-slate-900 border-slate-800 hover:bg-slate-800 hover:text-white cursor-pointer active:scale-95'
              : 'text-slate-400 border-transparent cursor-not-allowed opacity-40'
          }`}
          title="Take back last move (U)"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>
      </div>
    </div>
  );
};
