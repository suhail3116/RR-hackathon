import React from 'react';
import { Shield, BarChart3, Users, FileSpreadsheet, BookOpen, Sparkles, Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: 'selection' | 'deepdive' | 'comparison' | 'table' | 'top50' | 'methodology';
  setActiveTab: (tab: 'selection' | 'deepdive' | 'comparison' | 'table' | 'top50' | 'methodology') => void;
  selectedPlayerName?: string;
  totalPlayers: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedPlayerName,
  totalPlayers
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#050E1D]/90 backdrop-blur-md border-b border-white/10">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EB1485] via-[#1E3A8A] to-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#EB1485]/20 ring-2 ring-white/10">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#EB1485] px-2 py-0.5 rounded-full bg-[#EB1485]/10 border border-[#EB1485]/30">
                  Halla Bol
                </span>
                <span className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> IPL 2027 Auction Analytics
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                RAJASTHAN ROYALS <span className="text-[#EB1485] font-extrabold">SupeRR Selector</span>
              </h1>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-300">
            <div className="border-r border-white/10 pr-4 text-right">
              <div className="text-slate-400">Total Balls Analyzed</div>
              <div className="font-bold text-white text-sm">200,999 (883 Matches)</div>
            </div>
            <div className="border-r border-white/10 pr-4 text-right">
              <div className="text-slate-400">High-Pressure Balls</div>
              <div className="font-bold text-[#EB1485] text-sm">70,739 (35.2%)</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400">Total Profiled Roster</div>
              <div className="font-bold text-[#D4AF37] text-sm">{totalPlayers} Players</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 pt-1 border-t border-white/5 scrollbar-none">
          <button
            onClick={() => setActiveTab('selection')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'selection'
                ? 'bg-[#EB1485] text-white shadow-lg shadow-[#EB1485]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>🎯 Selection Panel ({totalPlayers})</span>
          </button>

          <button
            onClick={() => setActiveTab('deepdive')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'deepdive'
                ? 'bg-[#EB1485] text-white shadow-lg shadow-[#EB1485]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>
              📊 Deep Dive {selectedPlayerName ? `(${selectedPlayerName})` : ''}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-[#EB1485] text-white shadow-lg shadow-[#EB1485]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>📈 Multi-Player Comparisons</span>
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'table'
                ? 'bg-[#EB1485] text-white shadow-lg shadow-[#EB1485]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>📑 Top 100 Excel Master Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('top50')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'top50'
                ? 'bg-[#EB1485] text-white shadow-lg shadow-[#EB1485]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-4 h-4 text-[#D4AF37]" />
            <span>⚡ Top 50 Tactical Sheets (Inn 2)</span>
          </button>

          <button
            onClick={() => setActiveTab('methodology')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'methodology'
                ? 'bg-[#EB1485] text-white shadow-lg shadow-[#EB1485]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📘 Methodology Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
