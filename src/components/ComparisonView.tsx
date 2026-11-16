import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart3, Shield, Flame, Trophy, Award, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ComparisonViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

const RR_PINK = '#EB1485';
const RR_GOLD = '#D4AF37';
const RR_BLUE = '#1E3A8A';
const RR_EMERALD = '#10B981';

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  players,
  onSelectPlayer
}) => {
  const [selectedGroup, setSelectedGroup] = useState<'top_bowlers' | 'top_batters' | 'custom'>('top_bowlers');
  const [metric, setMetric] = useState<'suppression' | 'chasing_sr' | 'win_pct' | 'workload' | 'clutch_score'>('suppression');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([
    'arshdeep-singh',
    'jasprit-bumrah',
    'sunil-narine',
    'matheesha-pathirana',
    'david-miller',
    'rinku-singh',
    'dhruv-jurel'
  ]);

  // Pre-filtered groups
  const top10Bowlers = useMemo(() => {
    return players
      .filter((p) => p.role === 'Bowler')
      .sort((a, b) => b.bowling.defending_suppression - a.bowling.defending_suppression)
      .slice(0, 10);
  }, [players]);

  const top10Batters = useMemo(() => {
    return players
      .filter((p) => p.role === 'Batter')
      .sort((a, b) => b.batting.inn2_hp_sr - a.batting.inn2_hp_sr)
      .slice(0, 10);
  }, [players]);

  const customPlayers = useMemo(() => {
    return players.filter((p) => selectedPlayerIds.includes(p.id));
  }, [players, selectedPlayerIds]);

  const currentDisplayPlayers = useMemo(() => {
    if (selectedGroup === 'top_bowlers') return top10Bowlers;
    if (selectedGroup === 'top_batters') return top10Batters;
    return customPlayers;
  }, [selectedGroup, top10Bowlers, top10Batters, customPlayers]);

  // Prepare Bar Chart Data
  const chartData = useMemo(() => {
    return currentDisplayPlayers.map((p) => {
      let val = 0;
      let label = '';
      if (metric === 'suppression') {
        val = p.bowling.defending_suppression;
        label = `+${val.toFixed(2)} rpo`;
      } else if (metric === 'chasing_sr') {
        val = p.batting.inn2_hp_sr || p.batting.strike_rate;
        label = `${val.toFixed(1)} SR`;
      } else if (metric === 'win_pct') {
        val = p.hp_win_pct;
        label = `${val}%`;
      } else if (metric === 'workload') {
        val = p.role === 'Bowler' ? p.bowling.hp_overs : p.batting.hp_runs;
        label = p.role === 'Bowler' ? `${val} ov` : `${val} r`;
      } else {
        val = p.overall_clutch_score;
        label = `${val}`;
      }

      return {
        name: p.name,
        role: p.role,
        value: val,
        displayLabel: label,
        color: p.role === 'Bowler' ? RR_GOLD : RR_PINK,
        rawPlayer: p
      };
    });
  }, [currentDisplayPlayers, metric]);

  const togglePlayerSelect = (id: string) => {
    if (selectedPlayerIds.includes(id)) {
      if (selectedPlayerIds.length > 2) {
        setSelectedPlayerIds(selectedPlayerIds.filter((p) => p !== id));
      }
    } else {
      if (selectedPlayerIds.length < 8) {
        setSelectedPlayerIds([...selectedPlayerIds, id]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F2341] via-[#0A192F] to-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4 text-[#EB1485]" />
              <span>Comparative Analytics &amp; Cross-Player Benchmarking</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              All-Player High-Pressure Performance Comparison
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Compare top clutch batters and bowlers across key pressure signals: Defending Suppression Margin, Chasing Strike Rate, Workload Volume, and Match Win Rates.
            </p>
          </div>

          {/* Group Selector Pills */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
            <button
              onClick={() => {
                setSelectedGroup('top_bowlers');
                setMetric('suppression');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedGroup === 'top_bowlers'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Top 10 Bowlers
            </button>
            <button
              onClick={() => {
                setSelectedGroup('top_batters');
                setMetric('chasing_sr');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedGroup === 'top_batters'
                  ? 'bg-[#EB1485] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Top 10 Batters
            </button>
            <button
              onClick={() => setSelectedGroup('custom')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedGroup === 'custom'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Custom Head-to-Head
            </button>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 self-center mr-2 font-semibold">Compare Metric:</span>
          <button
            onClick={() => setMetric('suppression')}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
              metric === 'suppression'
                ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                : 'text-slate-400 border-white/10 hover:border-white/20'
            }`}
          >
            🛡️ Defending Suppression Margin (rpo)
          </button>
          <button
            onClick={() => setMetric('chasing_sr')}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
              metric === 'chasing_sr'
                ? 'bg-[#EB1485] text-white border-[#EB1485]'
                : 'text-slate-400 border-white/10 hover:border-white/20'
            }`}
          >
            🔥 2nd Innings Chasing Strike Rate
          </button>
          <button
            onClick={() => setMetric('win_pct')}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
              metric === 'win_pct'
                ? 'bg-emerald-500 text-black border-emerald-500'
                : 'text-slate-400 border-white/10 hover:border-white/20'
            }`}
          >
            🏆 Match Win Conversion Rate %
          </button>
          <button
            onClick={() => setMetric('workload')}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
              metric === 'workload'
                ? 'bg-sky-500 text-black border-sky-500'
                : 'text-slate-400 border-white/10 hover:border-white/20'
            }`}
          >
            ⚡ Pressure Workload (Runs / Overs)
          </button>
          <button
            onClick={() => setMetric('clutch_score')}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
              metric === 'clutch_score'
                ? 'bg-white text-black border-white'
                : 'text-slate-400 border-white/10 hover:border-white/20'
            }`}
          >
            ⭐ Overall Clutch Score (BPI / BoPI)
          </button>
        </div>

        {/* Custom Multi-Select chips if Custom group selected */}
        {selectedGroup === 'custom' && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="text-xs text-slate-400 mb-2 font-semibold">
              Select 2 to 8 players to compare side-by-side:
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {players.slice(0, 30).map((p) => {
                const isChecked = selectedPlayerIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlayerSelect(p.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                      isChecked
                        ? 'bg-[#EB1485] text-white border-[#EB1485]'
                        : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {isChecked ? '✓ ' : '+ '}
                    {p.name} ({p.role[0]})
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* PRIMARY BAR CHART REPRESENTATION */}
      <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-white">
              {metric === 'suppression' && 'Defending Suppression Margin (+rpo vs Target RRR)'}
              {metric === 'chasing_sr' && '2nd Innings Chasing Strike Rate Under Pressure'}
              {metric === 'win_pct' && 'Match Win Conversion Rate in High-Pressure Finishes'}
              {metric === 'workload' && 'Total High-Pressure Deliveries / Runs Managed'}
              {metric === 'clutch_score' && 'Empirical Bayes Adjusted Clutch Rating'}
            </h3>
            <p className="text-xs text-slate-400">
              Interactive side-by-side bar chart comparison across {chartData.length} selected candidates
            </p>
          </div>
          <span className="text-xs text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
            {selectedGroup === 'top_bowlers' ? 'Bowlers Pool' : selectedGroup === 'top_batters' ? 'Batters Pool' : 'Custom Cohort'}
          </span>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 45 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#050E1D] border border-white/20 p-3 rounded-xl shadow-2xl text-xs">
                        <div className="font-bold text-white text-sm">{d.name}</div>
                        <div className="text-slate-400 mt-0.5">Role: {d.role}</div>
                        <div className="text-[#EB1485] font-black text-base mt-1">
                          {d.displayLabel}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">Click player below to inspect wagon wheel</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onSelectPlayer(entry.rawPlayer)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Notes */}
        <div className="flex items-center justify-center space-x-6 text-xs text-slate-400 mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#EB1485]" />
            <span>Batters (Chasing Strike Rate &amp; Runs Above Par)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
            <span>Bowlers (Defending Suppression &amp; Runs Saved)</span>
          </div>
        </div>
      </div>

      {/* Side-by-side Table Summary of Cohort */}
      <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-5 shadow-xl overflow-x-auto">
        <h4 className="text-sm font-bold text-white mb-3">Cohort Quick Comparison Table</h4>
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
              <th className="py-2 px-3">Player</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">HP Win %</th>
              <th className="py-2 px-3">Inn 2 Metric</th>
              <th className="py-2 px-3">Inn 1 Metric</th>
              <th className="py-2 px-3">Tactical Specialty</th>
              <th className="py-2 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentDisplayPlayers.map((p) => {
              const isB = p.role === 'Bowler';
              return (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <span>#{p.auction_rank}</span>
                    <span>{p.name}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isB ? 'bg-sky-500/10 text-sky-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {p.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">{p.hp_win_pct}%</td>
                  <td className="py-2.5 px-3 font-bold text-[#EB1485]">
                    {isB ? `${p.bowling.inn2_economy.toFixed(2)} Econ (+${p.bowling.defending_suppression.toFixed(2)} sup)` : `${p.batting.inn2_hp_runs}r @ ${p.batting.inn2_hp_sr.toFixed(1)} SR`}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {isB ? `${p.bowling.inn1_economy.toFixed(2)} Econ` : `${p.batting.inn1_hp_runs}r @ ${p.batting.inn1_hp_sr.toFixed(1)} SR`}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">{p.tactical_role}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectPlayer(p)}
                      className="px-2.5 py-1 rounded-lg bg-[#EB1485]/10 hover:bg-[#EB1485] text-[#EB1485] hover:text-white font-bold transition-all"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
