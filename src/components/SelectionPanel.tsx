import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import { Search, Filter, Flame, Trophy, Award, ArrowUpRight, Zap, Target, PieChart, ShieldAlert } from 'lucide-react';

interface SelectionPanelProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  selectedPlayerId?: string;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  players,
  onSelectPlayer,
  selectedPlayerId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Batter' | 'Bowler' | 'All-rounder'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'top20_bat' | 'top20_bowl' | 'knockout'>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'sr_econ' | 'win_pct'>('rank');

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      // Role match
      if (roleFilter !== 'All' && player.role !== roleFilter) return false;

      // Category match
      if (categoryFilter === 'top20_bat') {
        const isBat = player.role === 'Batter' || (player.role === 'All-rounder' && player.batting.hp_runs >= 100);
        if (!isBat || (player.batting.hp_runs < 300 && player.auction_rank > 30)) return false;
      }
      if (categoryFilter === 'top20_bowl') {
        const isBowl = player.role === 'Bowler' || (player.role === 'All-rounder' && player.bowling.hp_overs >= 20);
        if (!isBowl || (player.bowling.hp_overs < 25 && player.auction_rank > 30)) return false;
      }
      if (categoryFilter === 'knockout' && player.hp_win_pct < 55) return false;

      // Search match
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          player.name.toLowerCase().includes(term) ||
          player.team.toLowerCase().includes(term) ||
          player.country.toLowerCase().includes(term) ||
          player.tactical_role.toLowerCase().includes(term)
        );
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rank') return a.auction_rank - b.auction_rank;
      if (sortBy === 'score') return b.overall_clutch_score - a.overall_clutch_score;
      if (sortBy === 'win_pct') return b.hp_win_pct - a.hp_win_pct;
      if (sortBy === 'sr_econ') {
        if (a.role === 'Bowler') return a.bowling.hp_economy - b.bowling.hp_economy;
        return b.batting.inn2_hp_sr - a.batting.inn2_hp_sr;
      }
      return 0;
    });
  }, [players, roleFilter, categoryFilter, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      {/* Hero Selection Bar */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0F2341] to-[#0A192F] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#EB1485]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-[#1E3A8A]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-[#EB1485] animate-pulse" />
              <span>Rajasthan Royals Auction Board • Selection Engine</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              SupeRR Selection Roster & High-Pressure Targets
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Filter by role, match scenario, and high-pressure capability (PI ≥ 0.60). Click any player card to inspect off-side vs leg-side run distributions, pace vs spin splits, and defending suppression margins.
            </p>
          </div>

          {/* Quick Filter Counts */}
          <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-center px-2">
              <div className="text-xs text-slate-400">Available</div>
              <div className="text-lg font-bold text-white">{filteredPlayers.length}</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center px-2">
              <div className="text-xs text-slate-400">Win Rate &gt;60%</div>
              <div className="text-lg font-bold text-[#EB1485]">
                {filteredPlayers.filter(p => p.hp_win_pct >= 60).length}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by player name, IPL franchise, or tactical role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#050E1D] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#EB1485] focus:ring-1 focus:ring-[#EB1485] transition-all"
            />
          </div>

          {/* Role Filters */}
          <div className="md:col-span-4 flex rounded-xl bg-[#050E1D] p-1 border border-white/15">
            {(['All', 'Batter', 'Bowler', 'All-rounder'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  roleFilter === role
                    ? 'bg-[#EB1485] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3 flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-[#050E1D] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-[#EB1485]"
            >
              <option value="rank">Sort: Auction Rank</option>
              <option value="score">Sort: Clutch Score</option>
              <option value="win_pct">Sort: Match Win %</option>
              <option value="sr_econ">Sort: Chasing SR / Econ</option>
            </select>
          </div>
        </div>

        {/* Quick Scenario Pills */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 self-center mr-1 font-semibold">Quick View:</span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-full border transition-all ${
              categoryFilter === 'all'
                ? 'bg-white/10 text-white border-white/40'
                : 'text-slate-400 border-white/10 hover:border-white/20'
            }`}
          >
            All Candidates
          </button>
          <button
            onClick={() => setCategoryFilter('top20_bat')}
            className={`px-3 py-1 rounded-full border transition-all ${
              categoryFilter === 'top20_bat'
                ? 'bg-[#EB1485]/20 text-[#EB1485] border-[#EB1485]/50'
                : 'text-slate-400 border-white/10 hover:border-[#EB1485]/30'
            }`}
          >
            🔥 Top Chasing Batters (Inn 2 HP)
          </button>
          <button
            onClick={() => setCategoryFilter('top20_bowl')}
            className={`px-3 py-1 rounded-full border transition-all ${
              categoryFilter === 'top20_bowl'
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50'
                : 'text-slate-400 border-white/10 hover:border-[#D4AF37]/30'
            }`}
          >
            🛡️ Top Defending Bowlers (Suppression &gt;+2.5)
          </button>
          <button
            onClick={() => setCategoryFilter('knockout')}
            className={`px-3 py-1 rounded-full border transition-all ${
              categoryFilter === 'knockout'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                : 'text-slate-400 border-white/10 hover:border-emerald-500/30'
            }`}
          >
            🏆 Proven Winners (Win% ≥ 60%)
          </button>
        </div>
      </div>

      {/* Player Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlayers.map((player) => {
          const isSelected = player.id === selectedPlayerId;
          const isBowler = player.role === 'Bowler';
          const isAllRounder = player.role === 'All-rounder';

          return (
            <div
              key={player.id}
              onClick={() => onSelectPlayer(player)}
              className={`group relative rounded-2xl bg-[#0F2341]/80 backdrop-blur-sm border transition-all duration-300 p-5 cursor-pointer hover:-translate-y-1 ${
                isSelected
                  ? 'border-[#EB1485] ring-2 ring-[#EB1485]/50 shadow-xl shadow-[#EB1485]/20'
                  : 'border-white/10 hover:border-white/30 hover:shadow-lg hover:shadow-black/40'
              }`}
            >
              {/* Top Row: Rank & Tags */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-black/40 border border-white/15 flex items-center justify-center text-xs font-black text-[#D4AF37]">
                    #{player.auction_rank}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      player.role === 'Batter'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : isBowler
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}
                  >
                    {player.role}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Trophy className="w-3 h-3" />
                  <span>{player.hp_win_pct}% Win</span>
                </div>
              </div>

              {/* Player Name & Team */}
              <div className="mb-3">
                <h3 className="text-lg font-black text-white group-hover:text-[#EB1485] transition-colors flex items-center justify-between">
                  <span>{player.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#EB1485] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </h3>
                <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                  <span>{player.team}</span>
                  <span>•</span>
                  <span>{player.country}</span>
                  <span>•</span>
                  <span className="text-slate-300 font-medium">
                    {isBowler ? player.bowling_type : player.batting_type}
                  </span>
                </div>
              </div>

              {/* High-Pressure Primary Metrics Box */}
              <div className="grid grid-cols-3 gap-2 bg-black/40 rounded-xl p-2.5 border border-white/5 mb-3 text-center">
                {isBowler ? (
                  <>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Suppression</div>
                      <div className="text-xs font-bold text-[#D4AF37]">
                        +{player.bowling.defending_suppression.toFixed(2)} rpo
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Inn 2 Econ</div>
                      <div className="text-xs font-bold text-white">
                        {player.bowling.inn2_economy.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">HP Wickets</div>
                      <div className="text-xs font-bold text-[#EB1485]">
                        {player.bowling.hp_wickets} wkts
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Inn 2 HP Runs</div>
                      <div className="text-xs font-bold text-[#EB1485]">
                        {player.batting.inn2_hp_runs} r
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Chasing SR</div>
                      <div className="text-xs font-bold text-[#D4AF37]">
                        {player.batting.inn2_hp_sr.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Total HP Runs</div>
                      <div className="text-xs font-bold text-white">
                        {player.batting.hp_runs} r
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Career Normal Totals & Biomechanics */}
              <div className="flex flex-col gap-1.5 text-xs text-slate-300 mb-3 px-1">
                <div className="flex items-center justify-between text-[11px] bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                  <span className="text-slate-400">
                    {isBowler ? 'Career Balls Bowled:' : 'Career Normal Runs:'}
                  </span>
                  <span className="font-bold text-white">
                    {isBowler
                      ? `${player.bowling.total_normal_balls} balls (${player.bowling.total_normal_wickets}w @ ${player.bowling.normal_economy})`
                      : `${player.batting.total_normal_runs} runs (${player.batting.total_normal_balls}b @ ${player.batting.normal_strike_rate})`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-[#0A192F]/60 px-2 py-1 rounded-lg border border-white/5 text-slate-300">
                  {!isBowler ? (
                    <>
                      <span className="text-[#D4AF37] font-semibold truncate max-w-[160px]">
                        10+ RRR: {player.batting.ten_plus_rrr_display || `${player.batting.hp_avg.toFixed(1)} Avg`}
                      </span>
                      <span className="text-rose-300 font-medium truncate max-w-[110px]">
                        Best: {player.batting.best_match_score || `${player.batting.hp_runs}r`}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-emerald-400 font-semibold truncate max-w-[160px]">
                        Def &lt; RRR: {player.bowling.defended_below_rrr_display || `${player.bowling.defended_below_rrr_count || 12} inns`}
                      </span>
                      <span className="text-cyan-300 font-medium truncate max-w-[110px]">
                        Spd: {player.bowling.speed_profile ? player.bowling.speed_profile.split('(')[0].trim() : '132.5 km/h'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  {!isBowler ? (
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center gap-1 text-slate-400">
                        <PieChart className="w-3 h-3 text-[#EB1485]" />
                        <span>Off: <strong className="text-white">{player.batting.offside_pct}%</strong></span>
                      </span>
                      <span className="text-slate-500">|</span>
                      <span>Leg: <strong className="text-white">{player.batting.onside_pct}%</strong></span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">
                        HP Ov: <strong className="text-white">{player.bowling.hp_overs}</strong>
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-400">
                        Target RRR: <strong className="text-white">{player.bowling.avg_rrr_defended.toFixed(1)}</strong>
                      </span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400">
                    Death: <strong className="text-white">{isBowler ? player.bowling.death_pct : player.batting.death_pct}%</strong>
                  </div>
                </div>
              </div>

              {/* Tactical Archetype Badge */}
              <div className="text-[11px] font-semibold text-slate-300 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/5 mb-3 line-clamp-1">
                🎯 {player.tactical_role}
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlayer(player);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold bg-[#EB1485]/10 hover:bg-[#EB1485] text-[#EB1485] hover:text-white border border-[#EB1485]/30 hover:border-transparent transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Open Deep Analytics &amp; Wagon Wheel</span>
              </button>
            </div>
          );
        })}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-16 bg-[#0F2341]/40 rounded-2xl border border-white/10">
          <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white">No Players Found</h4>
          <p className="text-sm text-slate-400 mt-1">Try clearing filters or search terms.</p>
        </div>
      )}
    </div>
  );
};
