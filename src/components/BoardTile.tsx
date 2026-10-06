import React from 'react';
import { Cell, Player } from '../types';

interface BoardTileProps {
  index: number;
  value: Cell;
  isWinningCell: boolean;
  isCurrentTurn: boolean;
  activePlayer: Player;
  isInteractive: boolean;
  onClick: (index: number) => void;
}

export const BoardTile: React.FC<BoardTileProps> = ({
  index,
  value,
  isWinningCell,
  activePlayer,
  isInteractive,
  onClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (isInteractive && value === null) {
      onClick(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && isInteractive && value === null) {
      e.preventDefault();
      onClick(index);
    }
  };

  // Keyboard number hint (1-9)
  const numpadKey = index + 1;

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={!isInteractive || value !== null}
      aria-label={`Cell ${index + 1}, ${value ? `occupied by ${value}` : 'empty'}`}
      className={`
        relative flex items-center justify-center
        aspect-square rounded-2xl transition-all duration-200
        select-none cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
        ${
          value !== null
            ? isWinningCell
              ? 'bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.35)] scale-[1.02]'
              : 'bg-slate-900/90 border border-slate-800 shadow-inner'
            : isInteractive
            ? 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 active:scale-95 shadow-sm'
            : 'bg-slate-900/40 border border-slate-800/60 cursor-not-allowed opacity-80'
        }
      `}
    >
      {/* Keyboard guide index in top-left */}
      <span className="absolute top-2 left-2.5 text-[10px] font-mono text-slate-400 select-none tabular-nums opacity-60 group-hover:opacity-100 transition-opacity">
        {numpadKey}
      </span>

      {/* Symbol Display */}
      {value === 'X' && (
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 drop-shadow-[0_0_12px_rgba(56,189,248,0.4)] animate-in zoom-in-50 duration-200"
          aria-hidden="true"
        >
          <line
            x1="22"
            y1="22"
            x2="78"
            y2="78"
            stroke="url(#x-gradient)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <line
            x1="78"
            y1="22"
            x2="22"
            y2="78"
            stroke="url(#x-gradient)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="x-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {value === 'O' && (
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-in zoom-in-50 duration-200"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="url(#o-gradient)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="o-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Phantom preview on hover when interactive & empty */}
      {value === null && isInteractive && isHovered && (
        <div className="opacity-25 transition-opacity duration-150 pointer-events-none">
          {activePlayer === 'X' ? (
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-18 sm:h-18">
              <line x1="24" y1="24" x2="76" y2="76" stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" />
              <line x1="76" y1="24" x2="24" y2="76" stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-18 sm:h-18">
              <circle cx="50" cy="50" r="28" fill="none" stroke="#fb7185" strokeWidth="12" />
            </svg>
          )}
        </div>
      )}

      {/* Winning glow particle indicator */}
      {isWinningCell && (
        <div className="absolute inset-0 rounded-2xl bg-amber-400/10 pointer-events-none animate-pulse" />
      )}
    </button>
  );
};
