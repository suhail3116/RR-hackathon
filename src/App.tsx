import React, { useState } from 'react';
import dashboardDataRaw from './data/dashboard_data.json';
import { DashboardData, Player } from './types';
import { Header } from './components/Header';
import { SelectionPanel } from './components/SelectionPanel';
import { PlayerDeepDive } from './components/PlayerDeepDive';
import { ComparisonView } from './components/ComparisonView';
import { Top100TableView } from './components/Top100TableView';
import { MethodologyView } from './components/MethodologyView';
import { PlayerModal } from './components/PlayerModal';
import { Shield, Sparkles, Trophy, Heart } from 'lucide-react';

const data = dashboardDataRaw as DashboardData;
const playersList: Player[] = data.players;

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'selection' | 'deepdive' | 'comparison' | 'table' | 'methodology'>('selection');
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(playersList[0] || null);
  const [modalPlayer, setModalPlayer] = useState<Player | null>(null);

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setModalPlayer(player);
  };

  return (
    <div className="min-h-screen bg-[#050E1D] text-slate-100 flex flex-col selection:bg-[#EB1485] selection:text-white">
      {/* Rajasthan Royals Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPlayerName={selectedPlayer?.name}
        totalPlayers={playersList.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'selection' && (
          <SelectionPanel
            players={playersList}
            onSelectPlayer={handleSelectPlayer}
            selectedPlayerId={selectedPlayer?.id}
          />
        )}

        {activeTab === 'deepdive' && selectedPlayer && (
          <PlayerDeepDive
            player={selectedPlayer}
            onBackToSelection={() => setActiveTab('selection')}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonView
            players={playersList}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {activeTab === 'table' && (
          <Top100TableView
            players={playersList}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {activeTab === 'methodology' && <MethodologyView />}
      </main>

      {/* Quick Player Modal from Card Clicks */}
      <PlayerModal
        player={modalPlayer}
        onClose={() => setModalPlayer(null)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#050E1D]/90 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-[#EB1485] flex items-center justify-center text-white font-black text-xs">
              RR
            </div>
            <span className="font-bold text-white tracking-wide">
              RAJASTHAN ROYALS SUPERR SELECTOR SEASON 2
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[#D4AF37] font-semibold">Halla Bol</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Evaluated: 200,999 Balls Across 883 Matches (2022–2026)</span>
            <span>•</span>
            <span className="text-slate-300">IPL 2027 Auction Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
