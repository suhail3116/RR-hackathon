import React, { useState, useMemo } from 'react';
import top50BattersRaw from '../data/top50_batters_sheet.json';
import top50BowlersRaw from '../data/top50_bowlers_sheet.json';
import { Player } from '../types';
import {
  Search,
  Download,
  FileSpreadsheet,
  ArrowUpDown,
  ExternalLink,
  Flame,
  Shield,
  Zap
} from 'lucide-react';

interface Top50SheetsViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export const Top50SheetsView: React.FC<Top50SheetsViewProps> = ({
  players,
  onSelectPlayer
}) => {
  const [subTab, setSubTab] = useState<'batters' | 'bowlers'>('batters');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('Rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Match player by name to allow opening full deep dive
  const playerMap = useMemo(() => {
    const map = new Map<string, Player>();
    for (const p of players) {
      map.set(p.name.toLowerCase().trim(), p);
    }
    return map;
  }, [players]);

  const activeData = useMemo(() => {
    return subTab === 'batters' ? (top50BattersRaw as any[]) : (top50BowlersRaw as any[]);
  }, [subTab]);

  const filteredData = useMemo(() => {
    let list = [...activeData];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter((row) => {
        const name = (row['Batter Name'] || row['Bowler Name'] || '').toLowerCase();
        const role = (
          row['Primary Batting Order'] ||
          row['Tactical Role'] ||
          row['Speed Profile'] ||
          row['Top Wicket Delivery Style (Inn 2)'] ||
          ''
        ).toLowerCase();
        return name.includes(term) || role.includes(term);
      });
    }

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle numbers vs strings
      if (typeof valA === 'string' && !isNaN(Number(valA))) valA = Number(valA);
      if (typeof valB === 'string' && !isNaN(Number(valB))) valB = Number(valB);

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [activeData, searchTerm, sortField, sortAsc]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'Rank');
    }
  };

  const exportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]);
    const rows = filteredData.map((row) =>
      headers
        .map((h) => {
          const val = row[h] !== undefined && row[h] !== null ? String(row[h]) : '';
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      subTab === 'batters'
        ? 'RR_Top50_Batters_Innings2_Chasing_Master.csv'
        : 'RR_Top50_Bowlers_Innings2_Defending_Master.csv'
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0F2341] via-[#0A192F] to-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#EB1485]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-[#EB1485]" />
              <span>Rajasthan Royals • Master Workbook Sheets 3 &amp; 4</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Top 50 Innings 2 Tactical Masters
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Complete situational analysis covering <strong>10+ RRR Chase Avg</strong>, <strong>Chase Win %</strong>, <strong>Best Match Scores</strong>, <strong>Defended Below RRR</strong>, <strong>Best Bowling Matches</strong>, and <strong>Ball Speed Profiles</strong>.
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
              onClick={exportCSV}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Sheet CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex space-x-2 bg-black/40 p-1.5 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => {
                setSubTab('batters');
                setSortField('Rank');
                setSortAsc(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                subTab === 'batters'
                  ? 'bg-[#EB1485] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Top 50 Batters (Innings 2 Chasing)</span>
            </button>

            <button
              onClick={() => {
                setSubTab('bowlers');
                setSortField('Rank');
                setSortAsc(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                subTab === 'bowlers'
                  ? 'bg-[#004BA0] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Top 50 Bowlers (Innings 2 Defending)</span>
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${subTab === 'batters' ? 'batters' : 'bowlers'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#EB1485] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#0F2341] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto max-h-[700px] scrollbar-thin scrollbar-thumb-white/20">
          {subTab === 'batters' ? (
            /* Top 50 Batters (Innings 2 Chase Tactical Master) */
            <table className="w-full text-left text-xs text-slate-300 min-w-[1350px]">
              <thead className="sticky top-0 z-20 bg-[#0A192F] text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-white/10 shadow-sm">
                <tr>
                  <th onClick={() => handleSort('Rank')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Rank <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('Batter Name')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Batter Name <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3">Primary Batting Order</th>
                  <th onClick={() => handleSort('chase_win_pct')} className="py-3 px-3 cursor-pointer hover:text-white text-emerald-400">
                    <span className="flex items-center gap-1">Chase Win % <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('ten_plus_rrr_avg')} className="py-3 px-3 cursor-pointer hover:text-white text-[#D4AF37]">
                    <span className="flex items-center gap-1">10+ RRR Chase Avg <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3 text-rose-300 font-bold">Best Match Score</th>
                  <th onClick={() => handleSort('Avg Match Entry RRR')} className="py-3 px-3 cursor-pointer hover:text-white text-[#EB1485]">
                    <span className="flex items-center gap-1">Entry RRR <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('Chase SR from Ball 1 (Overall)')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Chase SR <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('Chase Batting Avg from Ball 1')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Chase Avg <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3">Total Chasing Normal</th>
                  <th className="py-3 px-3">Defeat Margin (Losses)</th>
                  <th className="py-3 px-3">Top Boundary Stroke</th>
                  <th className="py-3 px-3 text-right">Deep Dive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map((row, idx) => {
                  const pName = row['Batter Name'];
                  const matchedPlayer = playerMap.get(pName?.toLowerCase()?.trim());
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => matchedPlayer && onSelectPlayer(matchedPlayer)}
                    >
                      <td className="py-3 px-3 font-black text-[#D4AF37]">#{row['Rank']}</td>
                      <td className="py-3 px-3 font-bold text-white hover:text-[#EB1485] transition-colors">
                        {pName}
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-[11px] max-w-xs truncate">
                        {row['Primary Batting Order']}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {row['chase_win_record'] || row['chase_win_pct'] || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-black text-[#D4AF37]">
                        {row['ten_plus_rrr_display'] || 'N/A'}
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-300">
                        {row['best_match_score'] || row['High Score Match (Inn 2)'] || 'N/A'}
                      </td>
                      <td className="py-3 px-3 font-black text-[#EB1485]">
                        {row['Avg Match Entry RRR']} rpo
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-200">
                        {row['Chase SR from Ball 1 (Overall)']}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-300">
                        {row['Chase Batting Avg from Ball 1']}
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        {row['Total Runs (Inn 2)']}r ({row['Balls Faced (Inn 2)']}b)
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs truncate">
                        {row['Avg Defeat Margin in Lost Chases (Runs)'] || 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-[11px] max-w-xs truncate">
                        {row['Top Boundary Stroke (Inn 2)'] || 'N/A'}
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
          ) : (
            /* Top 50 Bowlers (Innings 2 Defending Master) */
            <table className="w-full text-left text-xs text-slate-300 min-w-[1450px]">
              <thead className="sticky top-0 z-20 bg-[#0A192F] text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-white/10 shadow-sm">
                <tr>
                  <th onClick={() => handleSort('Rank')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Rank <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('Bowler Name')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Bowler Name <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3 text-emerald-400 font-bold">Defended Below RRR</th>
                  <th onClick={() => handleSort('Defending Margin vs RRR')} className="py-3 px-3 cursor-pointer hover:text-white text-[#D4AF37]">
                    <span className="flex items-center gap-1">Defending Margin <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3 text-rose-300 font-bold">Best Bowling Match</th>
                  <th className="py-3 px-3 text-cyan-300 font-bold">Speed Profile (Avg/Range)</th>
                  <th onClick={() => handleSort('Defending Econ from Ball 1 (Inn 2)')} className="py-3 px-3 cursor-pointer hover:text-white text-[#EB1485]">
                    <span className="flex items-center gap-1">Inn 2 Econ <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('Death Overs (>96b) Econ')} className="py-3 px-3 cursor-pointer hover:text-white text-emerald-400">
                    <span className="flex items-center gap-1">Death Econ <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th onClick={() => handleSort('Avg Match RRR Defended')} className="py-3 px-3 cursor-pointer hover:text-white">
                    <span className="flex items-center gap-1">Target RRR <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3">Overs &amp; Wkts (Inn 2)</th>
                  <th className="py-3 px-3">Top Wicket Delivery Style</th>
                  <th className="py-3 px-3">Yorkers Bowled</th>
                  <th className="py-3 px-3 text-right">Deep Dive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map((row, idx) => {
                  const pName = row['Bowler Name'];
                  const matchedPlayer = playerMap.get(pName?.toLowerCase()?.trim());
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => matchedPlayer && onSelectPlayer(matchedPlayer)}
                    >
                      <td className="py-3 px-3 font-black text-[#D4AF37]">#{row['Rank']}</td>
                      <td className="py-3 px-3 font-bold text-white hover:text-[#EB1485] transition-colors">
                        {pName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {row['defended_below_rrr_display'] || `${row['Inns Defended Below RRR']} inns`}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-black text-[#D4AF37]">
                        {row['Defending Margin vs RRR']}
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-300">
                        {row['best_bowling_match'] || row['Best Bowling Match (Inn 2)'] || 'N/A'}
                      </td>
                      <td className="py-3 px-3 font-medium text-cyan-300 text-[11px]">
                        {row['speed_profile'] || (row['Average Ball Speed (km/h)'] ? `${row['Average Ball Speed (km/h)']} km/h` : 'N/A')}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#EB1485]">
                        {row['Defending Econ from Ball 1 (Inn 2)']} rpo
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-400">
                        {row['Death Overs (>96b) Econ']} rpo
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-300">
                        {row['Avg Match RRR Defended']} rpo
                      </td>
                      <td className="py-3 px-3 text-slate-200 font-medium">
                        {row['Total Overs (Inn 2)']} ov ({row['Total Wkts (Inn 2)']}w)
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-[11px] max-w-xs truncate">
                        {row['Top Wicket Delivery Style (Inn 2)'] || 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs truncate">
                        {row['Yorkers Bowled (Inn 2)'] || 'N/A'}
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
