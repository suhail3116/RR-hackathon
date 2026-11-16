import React from 'react';
import { Player } from '../types';
import { PlayerDeepDive } from './PlayerDeepDive';
import { X } from 'lucide-react';

interface PlayerModalProps {
  player: Player | null;
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-[#0A192F] border border-white/15 rounded-3xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-[#EB1485] text-white flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <PlayerDeepDive player={player} isModal={true} />
      </div>
    </div>
  );
};
