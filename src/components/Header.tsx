import React from 'react';
import { Volume2, VolumeX, HelpCircle, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  onNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenHelp,
  onNewGame,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center font-extrabold text-slate-950 text-base shadow-sm">
            #
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-100 font-display">
            Tic Tac Toe Master
          </span>
        </div>

        {/* Zone 2: Informational / auxiliary utilities */}
        <div className="flex items-center gap-1 sm:gap-2 text-sm text-slate-400">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            type="button"
            onClick={onOpenHelp}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title="How to Play & Shortcuts"
            aria-label="How to play and keyboard shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Zone 3: Primary action - New Game */}
        <div>
          <button
            type="button"
            onClick={onNewGame}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-100 bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-sm rounded-lg transition-all"
            title="Start a new game and reset board (N or R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
