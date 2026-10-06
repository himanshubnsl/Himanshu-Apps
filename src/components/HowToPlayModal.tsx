import React from 'react';
import { X, Keyboard, Bot, Users } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold font-display text-slate-100">
            How to Play & Controls
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Rules */}
        <div className="space-y-3 text-xs text-slate-300">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
              <span>Goal</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Be the first player to place 3 of your marks in a horizontal, vertical, or diagonal line on the 3×3 grid. If all 9 cells fill up without 3 in a line, the game ends in a tie.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Two Player Mode</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Pass & play with a friend on the same device. Player X takes the first turn, followed by Player O.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>vs Computer Opponent</span>
            </h3>
            <ul className="space-y-1 text-slate-400 mt-1 pl-1">
              <li><strong className="text-emerald-400">Easy:</strong> Casual bot that makes playful, relaxed moves. Great for quick wins.</li>
              <li><strong className="text-sky-400">Medium:</strong> Balanced bot that blocks direct threats and seizes easy wins.</li>
              <li><strong className="text-indigo-400">Unbeatable:</strong> Evaluates all positions with the Minimax algorithm. Never loses!</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100 mb-2 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>Keyboard Shortcuts</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">1 - 9</kbd>
                <span className="text-slate-400">Grid cells (Numpad layout)</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">U</kbd>
                <span className="text-slate-400">Undo move</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">N / R</kbd>
                <span className="text-slate-400">New game / restart</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">M</kbd>
                <span className="text-slate-400">Toggle sound</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
