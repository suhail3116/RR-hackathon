import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import top100BattersSheet from '../data/top100_batters_sheet.json';
import top100BowlersSheet from '../data/top100_bowlers_sheet.json';
import { Search, Download, FileSpreadsheet, ArrowUpDown, ExternalLink, Shield, Swords, Sparkles, Flame, Target } from 'lucide-react';

interface Top100TableViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export const Top100TableView: React.FC<Top100TableViewProps> = ({
  players,
  onSelectPlayer
}) => {
  const [viewMode, setViewMode] = useState<'auction_100' | 'batters_death' | 'bowlers_bpb'>('auction_100');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Batter' | 'Bowler' | 'All-rounder'>('All');
  const [sortField, setSortField] = useState<string>('auction_rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Name map to open player deep dive
  const playerMap = useMemo(() => {
    const map = new Map<string, Player>();
    for (const p of players) {
      map.set(p.name.toLowerCase().trim(), p);
    }
    return map;
  }, [players]);

  // Mode 1: Auction Top 100
  const filteredAuctionData = useMemo(() => {
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

    if (searchTerm) return pool;
    const limit = roleFilter === 'All' ? 100 : 50;
    return pool.slice(0, limit);
  }, [players, roleFilter, searchTerm, sortField, sortAsc]);

  // Mode 2: Batters Death Avg Sheet
  const filteredBattersDeathData = useMemo(() => {
    let list = [...(top100BattersSheet as any[])];
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter((r) =>
        (r['Batter Name'] || '').toLowerCase().includes(t) ||
        (r['Primary Batting Order'] || '').toLowerCase().includes(t) ||
        (r['Top Boundary Stroke (4s & 6s)'] || '').toLowerCase().includes(t)
      );
    }
    list.sort((a, b) => {
      let valA = a[sortField] !== undefined ? a[sortField] : a['Rank'];
      let valB = b[sortField] !== undefined ? b[sortField] : b['Rank'];
      if (typeof valA === 'string' && !isNaN(Number(valA))) valA = Number(valA);
      if (typeof valB === 'string' && !isNaN(Number(valB))) valB = Number(valB);
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [searchTerm, sortField, sortAsc]);

  // Mode 3: Bowlers BPB Sheet
  const filteredBowlersBpbData = useMemo(() => {
    let list = [...(top100BowlersSheet as any[])];
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter((r) =>
        (r['Bowler Name'] || '').toLowerCase().includes(t) ||
        (r['Top Wicket Delivery Style'] || '').toLowerCase().includes(t) ||
        (r['Favorite Victim Batter'] || '').toLowerCase().includes(t)
      );
    }
    list.sort((a, b) => {
      let valA = a[sortField] !== undefined ? a[sortField] : a['Rank'];
      let valB = b[sortField] !== undefined ? b[sortField] : b['Rank'];
      if (typeof valA === 'string' && !isNaN(Number(valA))) valA = Number(valA);
      if (typeof valB === 'string' && !isNaN(Number(valB))) valB = Number(valB);
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [searchTerm, sortField, sortAsc]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field.includes('rank') || field.includes('Rank'));
    }
  };

  const exportCurrentCSV = () => {
    let rows: any[] = [];
    let headers: string[] = [];
    let filename = '';

    if (viewMode === 'auction_100') {
      headers = [
        'Rank', 'Player Name', 'Role', 'Team', 'Country', 'Clutch Rating', 'HP Win %',
        '2nd Inn Metric', '1st Inn Metric', 'Total HP Workload', 'Total Career Balls/Runs', 'Tactical Specialty'
      ];
      rows = filteredAuctionData.map((p) => {
        const isB = roleFilter === 'Bowler' || p.role === 'Bowler';
        const inn2 = isB ? `+${p.bowling.defending_suppression} rpo sup (${p.bowling.inn2_economy} econ)` : `${p.batting.inn2_hp_runs}r (${p.batting.inn2_hp_sr} SR)`;
        const inn1 = isB ? `${p.bowling.inn1_economy} econ` : `${p.batting.inn1_hp_runs}r (${p.batting.inn1_hp_sr} SR)`;
        const workload = isB ? `${p.bowling.hp_overs} ov (${p.bowling.hp_wickets} wkts)` : `${p.batting.hp_runs} runs (${p.batting.hp_balls} bf)`;
        const career = isB ? `${p.bowling.total_normal_balls} balls bowled (${p.bowling.total_normal_wickets}w)` : `${p.batting.total_normal_runs} normal runs (${p.batting.total_normal_balls}b)`;
        return [
          p.auction_rank, `"${p.name}"`, p.role, `"${p.team}"`, p.country, p.overall_clutch_score,
          `${p.hp_win_pct}%`, `"${inn2}"`, `"${inn1}"`, `"${workload}"`, `"${career}"`, `"${p.tactical_role}"`
        ];
      });
      filename = 'RR_SupeRR_Selector_Top100_Tactical_Master.csv';
    } else if (viewMode === 'batters_death') {
      if (filteredBattersDeathData.length === 0) return;
      headers = Object.keys(filteredBattersDeathData[0]);
      rows = filteredBattersDeathData.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`));
      filename = 'RR_Top100_Batters_Death_Average_Master.csv';
    } else {
      if (filteredBowlersBpbData.length === 0) return;
      headers = Object.keys(filteredBowlersBpbData[0]);
      rows = filteredBowlersBpbData.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`));
      filename = 'RR_Top100_Bowlers_Death_BPB_Master.csv';
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0F2341] via-[#0A192F] to-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#EB1485]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
              <FileSpreadsheet className="w-4 h-4 text-[#EB1485]" />
              <span>Rajasthan Royals • Master Excel File Replica (RR_SupeRR_Selector_Top100_Tactical_Master.xlsx)</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Top 100 High-Pressure Auction Shortlist &amp; Master Sheets
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Complete audited sheets from the official workbook featuring multi-factor pressure indexes, Death Overs averages (&gt;96 balls), Balls Per Boundary conceded, and defending suppression margins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/docs/RR_SupeRR_Selector_Top100_Tactical_Master.xlsx"
              download
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#EB1485] hover:bg-[#d01074] text-white font-bold text-xs shadow-lg transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Master Excel (.xlsx)</span>
            </a>

            <button
              onClick={exportCurrentCSV}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Master Sheet Switcher */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setViewMode('auction_100');
              setSortField('auction_rank');
              setSortAsc(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              viewMode === 'auction_100'
                ? 'bg-[#EB1485] text-white shadow-lg shadow-[#EB1485]/30'
                : 'bg-black/30 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auction Shortlist (Combined Top 100)</span>
          </button>

          <button
            onClick={() => {
              setViewMode('batters_death');
              setSortField('Rank');
              setSortAsc(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              viewMode === 'batters_death'
                ? 'bg-[#EB1485] text-white shadow-lg shadow-[#EB1485]/30'
                : 'bg-black/30 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Sheet 1: Top 100 Batters (Death Avg &gt;96b)</span>
          </button>

          <button
            onClick={() => {
              setViewMode('bowlers_bpb');
              setSortField('Rank');
              setSortAsc(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              viewMode === 'bowlers_bpb'
                ? 'bg-[#EB1485] text-white shadow-lg shadow-[#EB1485]/30'
                : 'bg-black/30 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-sky-400" />
            <span>Sheet 2: Top 100 Bowlers (Death BPB Conceded)</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                viewMode === 'auction_100'
                  ? 'Search by player, franchise, skill...'
                  : viewMode === 'batters_death'
                  ? 'Search death batters, position, stroke...'
                  : 'Search death bowlers, delivery style...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#050E1D] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#EB1485]"
            />
          </div>

          {viewMode === 'auction_100' && (
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
          )}
        </div>
      </div>

      {/* Tables Container */}
      <div className="bg-[#0F2341] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto max-h-[650px] scrollbar-thin scrollbar-thumb-white/20">
          {viewMode === 'auction_100' ? (
            <table className="w-full text-left text-xs text-slate-300 min-w-[1100px]">
              <thead className="sticky top-0 z-20 bg-[#0A192F] text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-white/10 shadow-sm">
                <tr>
                  <th onClick={() => handleSort('auction_rank')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Rank <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('name')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Player Name <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Team</th>
                  <th onClick={() => handleSort('overall_clutch_score')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Clutch Score <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('inn2_metric')} className="py-3 px-3 cursor-pointer hover:text-white text-[#EB1485]">
                    <span className="flex items-center gap-1">Inn 2 Chasing / Defending <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3">Inn 1 Metric</th>
                  <th onClick={() => handleSort('hp_workload')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">HP Workload <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3 text-slate-200">Total Career Normal</th>
                  <th onClick={() => handleSort('hp_win_pct')} className="py-3 px-3 cursor-pointer hover:text-white text-emerald-400">
                    <span className="flex items-center gap-1">Match Win % <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3">Tactical Specialty</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAuctionData.map((p) => {
                  const isB = roleFilter === 'Bowler' || p.role === 'Bowler' || (p.role === 'All-rounder' && p.bowling.hp_overs >= p.batting.hp_balls / 6);
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => onSelectPlayer(p)}
                    >
                      <td className="py-3 px-3 font-black text-[#D4AF37]">#{p.auction_rank}</td>
                      <td className="py-3 px-3 font-bold text-white hover:text-[#EB1485] transition-colors">{p.name}</td>
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
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{p.team}</td>
                      <td className="py-3 px-3 font-black text-white">{p.overall_clutch_score}</td>
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
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        {isB
                          ? `${p.bowling.total_normal_balls} balls (${p.bowling.total_normal_wickets}w @ ${p.bowling.normal_economy})`
                          : `${p.batting.total_normal_runs} runs (${p.batting.total_normal_balls}b @ ${p.batting.normal_strike_rate})`}
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
                      <td className="py-3 px-3 text-[11px] text-slate-300 max-w-xs truncate">{p.tactical_role}</td>
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
                })}
              </tbody>
            </table>
          ) : viewMode === 'batters_death' ? (
            /* Sheet 1: Top 100 Batters Death Average */
            <table className="w-full text-left text-xs text-slate-300 min-w-[1300px]">
              <thead className="sticky top-0 z-20 bg-[#0A192F] text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-white/10 shadow-sm">
                <tr>
                  <th onClick={() => handleSort('Rank')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Rank <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('Batter Name')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Batter Name <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3">Primary Batting Order</th>
                  <th onClick={() => handleSort('Balls >96 Avg (SORT)')} className="py-3 px-3 cursor-pointer hover:text-white text-[#D4AF37]">
                    <span className="flex items-center gap-1">Death Avg (&gt;96b) <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('Balls >96 SR')} className="py-3 px-3 cursor-pointer hover:text-white text-[#EB1485]">
                    <span className="flex items-center gap-1">Death SR <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3">Death Runs &amp; Balls</th>
                  <th className="py-3 px-3">Death Fours &amp; Sixes</th>
                  <th onClick={() => handleSort('Balls >96 Balls/Bnd')} className="py-3 px-3 cursor-pointer hover:text-white text-emerald-400">
                    <span className="flex items-center gap-1">Balls/Boundary <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3">Total Career Normal</th>
                  <th className="py-3 px-3">Top Boundary Stroke</th>
                  <th className="py-3 px-3 text-right">Deep Dive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBattersDeathData.map((row, idx) => {
                  const pName = row['Batter Name'];
                  const matchedPlayer = playerMap.get(pName?.toLowerCase()?.trim());
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => matchedPlayer && onSelectPlayer(matchedPlayer)}
                    >
                      <td className="py-3 px-3 font-black text-[#D4AF37]">#{row['Rank']}</td>
                      <td className="py-3 px-3 font-bold text-white hover:text-[#EB1485] transition-colors">{pName}</td>
                      <td className="py-3 px-3 text-slate-300 text-[11px]">{row['Primary Batting Order']}</td>
                      <td className="py-3 px-3 font-black text-[#D4AF37]">{row['Balls >96 Avg (SORT)']}</td>
                      <td className="py-3 px-3 font-bold text-[#EB1485]">{row['Balls >96 SR']}</td>
                      <td className="py-3 px-3 text-slate-200">{row['Balls >96 Runs']} r ({row['Balls >96 BF']} b)</td>
                      <td className="py-3 px-3 text-slate-300">{row['Balls >96 Fours']} 4s / {row['Balls >96 Sixes']} 6s</td>
                      <td className="py-3 px-3 font-bold text-emerald-400">{row['Balls >96 Balls/Bnd']}</td>
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        {row['Total Runs']} runs ({row['Balls Faced']}b @ {row['Overall SR']})
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-300 max-w-xs truncate">{row['Top Boundary Stroke (4s & 6s)']}</td>
                      <td className="py-3 px-3 text-right">
                        {matchedPlayer && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPlayer(matchedPlayer);
                            }}
                            className="p-1.5 rounded-lg bg-[#EB1485]/10 hover:bg-[#EB1485] text-[#EB1485] hover:text-white transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* Sheet 2: Top 100 Bowlers Death BPB */
            <table className="w-full text-left text-xs text-slate-300 min-w-[1300px]">
              <thead className="sticky top-0 z-20 bg-[#0A192F] text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-white/10 shadow-sm">
                <tr>
                  <th onClick={() => handleSort('Rank')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Rank <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('Bowler Name')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Bowler Name <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('Balls >96 Balls/Bnd Conceded (SORT: Low to High)')} className="py-3 px-3 cursor-pointer hover:text-white text-[#D4AF37]">
                    <span className="flex items-center gap-1">Death Balls/Boundary <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('Balls >96 Econ')} className="py-3 px-3 cursor-pointer hover:text-white text-[#EB1485]">
                    <span className="flex items-center gap-1">Death Econ <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3">Death Overs &amp; Wkts</th>
                  <th className="py-3 px-3">Total Career Normal</th>
                  <th className="py-3 px-3 text-emerald-400">Top Wicket Delivery Style</th>
                  <th className="py-3 px-3">Yorkers Bowled</th>
                  <th className="py-3 px-3">Bouncers Defended</th>
                  <th className="py-3 px-3">Favorite Victim</th>
                  <th className="py-3 px-3 text-right">Deep Dive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBowlersBpbData.map((row, idx) => {
                  const pName = row['Bowler Name'];
                  const matchedPlayer = playerMap.get(pName?.toLowerCase()?.trim());
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => matchedPlayer && onSelectPlayer(matchedPlayer)}
                    >
                      <td className="py-3 px-3 font-black text-[#D4AF37]">#{row['Rank']}</td>
                      <td className="py-3 px-3 font-bold text-white hover:text-[#EB1485] transition-colors">{pName}</td>
                      <td className="py-3 px-3 font-black text-[#D4AF37]">
                        {row['Balls >96 Balls/Bnd Conceded (SORT: Low to High)']}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#EB1485]">{row['Balls >96 Econ']} rpo</td>
                      <td className="py-3 px-3 text-slate-200">
                        {row['Balls >96 Overs']} ov ({row['Balls >96 Wkts']}w)
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        {row['Total Overs']} ov ({row['Total Wkts']}w @ {row['Overall Econ']})
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-400 text-[11px]">
                        {row['Top Wicket Delivery Style']}
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        {row['Yorkers & Wide Yorkers Bowled']}
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        {row['Bouncers Defended (No 4s/6s)']}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {row['Favorite Victim Batter']}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {matchedPlayer && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPlayer(matchedPlayer);
                            }}
                            className="p-1.5 rounded-lg bg-[#EB1485]/10 hover:bg-[#EB1485] text-[#EB1485] hover:text-white transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
