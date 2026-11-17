import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import { Search, Download, FileSpreadsheet, ArrowUpDown, ExternalLink, Shield, Swords, Sparkles } from 'lucide-react';

interface Top100TableViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export const Top100TableView: React.FC<Top100TableViewProps> = ({
  players,
  onSelectPlayer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Batter' | 'Bowler' | 'All-rounder'>('All');
  const [sortField, setSortField] = useState<keyof Player | 'hp_workload' | 'inn2_metric'>('auction_rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filteredData = useMemo(() => {
    // 1. Role filter pool
    let pool = players.filter((p) => {
      if (roleFilter === 'Bowler') {
        return p.role === 'Bowler' || (p.role === 'All-rounder' && p.bowling.hp_overs >= 20);
      }
      if (roleFilter === 'Batter') {
        return p.role === 'Batter' || (p.role === 'All-rounder' && p.batting.hp_runs >= 80);
      }
      if (roleFilter === 'All-rounder') {
        return p.role === 'All-rounder';
      }
      return true; // 'All'
    });

    // 2. Search filter
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      pool = pool.filter(
        (p) =>
          p.name.toLowerCase().includes(t) ||
          p.team.toLowerCase().includes(t) ||
          p.country.toLowerCase().includes(t) ||
          p.tactical_role.toLowerCase().includes(t) ||
          p.bowling_type.toLowerCase().includes(t) ||
          p.batting_type.toLowerCase().includes(t)
      );
    }

    // 3. Multi-column dynamic sorting
    pool.sort((a, b) => {
      let valA: any = a[sortField as keyof Player];
      let valB: any = b[sortField as keyof Player];

      const isBowlerView = roleFilter === 'Bowler' || a.role === 'Bowler';
      const isBowlerB = roleFilter === 'Bowler' || b.role === 'Bowler';

      if (sortField === 'hp_workload') {
        valA = isBowlerView ? a.bowling.hp_overs : a.batting.hp_runs;
        valB = isBowlerB ? b.bowling.hp_overs : b.batting.hp_runs;
      } else if (sortField === 'inn2_metric') {
        valA = isBowlerView ? a.bowling.defending_suppression : a.batting.inn2_hp_sr;
        valB = isBowlerB ? b.bowling.defending_suppression : b.batting.inn2_hp_sr;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    // 4. Slice limits: If searching, show all matches. If not searching, show 100 for All, 50 for specific roles.
    if (searchTerm) return pool;
    const limit = roleFilter === 'All' ? 100 : 50;
    return pool.slice(0, limit);
  }, [players, roleFilter, searchTerm, sortField, sortAsc]);

  const handleSort = (field: any) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'auction_rank');
    }
  };

  const exportCSV = () => {
    const headers = [
      'Rank',
      'Player Name',
      'Role',
      'Team',
      'Country',
      'Clutch Rating',
      'HP Win %',
      '2nd Inn Metric',
      '1st Inn Metric',
      'Total HP Workload',
      'HP SR/Econ',
      'Tactical Role'
    ];

    const rows = filteredData.map((p) => {
      const isB = roleFilter === 'Bowler' || p.role === 'Bowler' || (p.role === 'All-rounder' && p.bowling.hp_overs >= p.batting.hp_balls / 6);
      const inn2 = isB ? `+${p.bowling.defending_suppression} rpo sup (${p.bowling.inn2_economy} econ)` : `${p.batting.inn2_hp_runs}r (${p.batting.inn2_hp_sr} SR)`;
      const inn1 = isB ? `${p.bowling.inn1_economy} econ` : `${p.batting.inn1_hp_runs}r (${p.batting.inn1_hp_sr} SR)`;
      const workload = isB ? `${p.bowling.hp_overs} ov (${p.bowling.hp_wickets} wkts)` : `${p.batting.hp_runs} runs (${p.batting.hp_balls} bf)`;
      const rate = isB ? `${p.bowling.hp_economy} econ` : `${p.batting.hp_sr} SR`;

      return [
        p.auction_rank,
        `"${p.name}"`,
        p.role,
        `"${p.team}"`,
        p.country,
        p.overall_clutch_score,
        `${p.hp_win_pct}%`,
        `"${inn2}"`,
        `"${inn1}"`,
        `"${workload}"`,
        rate,
        `"${p.tactical_role}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Rajasthan_Royals_Top100_Tactical_Master.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0F2341] via-[#0A192F] to-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
              <FileSpreadsheet className="w-4 h-4 text-[#EB1485]" />
              <span>Rajasthan Royals • Master Excel Sheet Replica</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Top 100 High-Pressure Auction Shortlist Explorer
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Audited 100-player tactical master dataset featuring multi-factor pressure indexes, Innings 2 chase vs Innings 1 setting splits, defending suppression margins, and match-winning conversion percentages.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV / Excel</span>
          </button>
        </div>

        {/* Filters & Role Selector */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by player, franchise, skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#050E1D] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#EB1485]"
            />
          </div>

          <div className="flex flex-wrap gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10 text-xs">
            {(['All', 'Batter', 'Bowler', 'All-rounder'] as const).map((r) => {
              let label = 'All (Top 100)';
              if (r === 'Batter') label = 'Batters (Top 50)';
              if (r === 'Bowler') label = 'Bowlers (Top 50)';
              if (r === 'All-rounder') label = 'All-rounders';

              return (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    roleFilter === r
                      ? 'bg-[#EB1485] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Table */}
      <div className="bg-[#0F2341] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="bg-[#0A192F] text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-white/10">
                <th
                  onClick={() => handleSort('auction_rank')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <span className="flex items-center gap-1">Rank <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <span className="flex items-center gap-1">Player Name <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Team / Country</th>
                <th
                  onClick={() => handleSort('overall_clutch_score')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <span className="flex items-center gap-1">Clutch Score <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th
                  onClick={() => handleSort('inn2_metric')}
                  className="py-3 px-3 cursor-pointer hover:text-white text-[#EB1485]"
                >
                  <span className="flex items-center gap-1">Inn 2 Chasing / Defending <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-3">Inn 1 Metric</th>
                <th
                  onClick={() => handleSort('hp_workload')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <span className="flex items-center gap-1">HP Workload <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-3">Rate (SR / Econ)</th>
                <th
                  onClick={() => handleSort('hp_win_pct')}
                  className="py-3 px-3 cursor-pointer hover:text-white text-emerald-400"
                >
                  <span className="flex items-center gap-1">Match Win % <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-3">Tactical Specialty</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    No players found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredData.map((p) => {
                  const isB = roleFilter === 'Bowler' || p.role === 'Bowler' || (p.role === 'All-rounder' && p.bowling.hp_overs >= p.batting.hp_balls / 6);
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => onSelectPlayer(p)}
                    >
                      <td className="py-3 px-3 font-black text-[#D4AF37]">
                        #{p.auction_rank}
                      </td>
                      <td className="py-3 px-3 font-bold text-white hover:text-[#EB1485] transition-colors">
                        {p.name}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.role === 'Bowler'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : p.role === 'Batter'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {p.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {p.team} ({p.country})
                      </td>
                      <td className="py-3 px-3 font-black text-white">
                        {p.overall_clutch_score}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#EB1485]">
                        {isB
                          ? `+${p.bowling.defending_suppression.toFixed(2)} sup (${p.bowling.inn2_economy.toFixed(2)} econ)`
                          : `${p.batting.inn2_hp_runs}r @ ${p.batting.inn2_hp_sr.toFixed(1)} SR`}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {isB
                          ? `${p.bowling.inn1_economy.toFixed(2)} econ`
                          : `${p.batting.inn1_hp_runs}r @ ${p.batting.inn1_hp_sr.toFixed(1)} SR`}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-200">
                        {isB
                          ? `${p.bowling.hp_overs} ov (${p.bowling.hp_wickets}w)`
                          : `${p.batting.hp_runs}r (${p.batting.hp_balls}b)`}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-300">
                        {isB ? `${p.bowling.hp_economy.toFixed(2)} econ` : `${p.batting.hp_sr.toFixed(1)} SR`}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black ${
                            p.hp_win_pct >= 60
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : p.hp_win_pct >= 50
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {p.hp_win_pct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-300 max-w-xs truncate">
                        {p.tactical_role}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPlayer(p);
                          }}
                          className="p-1.5 rounded-lg bg-[#EB1485]/10 hover:bg-[#EB1485] text-[#EB1485] hover:text-white transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
