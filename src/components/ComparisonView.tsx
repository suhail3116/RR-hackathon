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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Swords,
  BarChart3,
  Shield,
  Flame,
  Trophy,
  Zap,
  Compass,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2
} from 'lucide-react';

interface ComparisonViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

const RR_PINK = '#EB1485';
const RR_GOLD = '#D4AF37';
const RR_BLUE = '#1E3A8A';
const RR_CYAN = '#06B6D4';

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  players,
  onSelectPlayer
}) => {
  // Modes: 'head_to_head' (2 players side-by-side) or 'cohort_chart' (all players bar chart)
  const [viewMode, setViewMode] = useState<'head_to_head' | 'cohort_chart'>('head_to_head');

  // Head-to-Head Selected Player IDs (Default to David Miller and Arshdeep Singh)
  const [player1Id, setPlayer1Id] = useState<string>('david-miller');
  const [player2Id, setPlayer2Id] = useState<string>('arshdeep-singh');

  // Cohort Mode States
  const [selectedGroup, setSelectedGroup] = useState<'top_bowlers' | 'top_batters' | 'custom'>('top_bowlers');
  const [cohortMetric, setCohortMetric] = useState<'suppression' | 'chasing_sr' | 'win_pct' | 'workload' | 'clutch_score'>('suppression');
  const [cohortPlayerIds, setCohortPlayerIds] = useState<string[]>([
    'arshdeep-singh',
    'jasprit-bumrah',
    'sunil-narine',
    'matheesha-pathirana',
    'david-miller',
    'rinku-singh',
    'dhruv-jurel'
  ]);

  // Selected Player Objects for 1v1
  const player1 = useMemo(() => {
    return players.find((p) => p.id === player1Id) || players[0];
  }, [players, player1Id]);

  const player2 = useMemo(() => {
    return players.find((p) => p.id === player2Id) || players[1] || players[0];
  }, [players, player2Id]);

  // Quick Match-up Presets
  const presets = [
    { label: '🔥 Miller vs Arshdeep (Finisher vs Closer)', p1: 'david-miller', p2: 'arshdeep-singh' },
    { label: '👑 Bumrah vs Narine (Yorker vs Mystery)', p1: 'jasprit-bumrah', p2: 'sunil-narine' },
    { label: '⚡ Rinku vs Tilak (Chasing Dynamos)', p1: 'rinku-singh', p2: 'tilak-varma' },
    { label: '🛡️ Pathirana vs Arshdeep (Death Pace Clash)', p1: 'matheesha-pathirana', p2: 'arshdeep-singh' },
    { label: '🎯 Klaasen vs Pooran (Power Middle-Order)', p1: 'heinrich-klaasen', p2: 'nicholas-pooran' },
    { label: '💎 Jurel vs Shashank (Domestic Clutch Pillars)', p1: 'dhruv-jurel', p2: 'shashank-singh' },
  ];

  // Side-by-side Comparative Metrics for 1v1 Bar Chart
  const headToHeadChartData = useMemo(() => {
    if (!player1 || !player2) return [];

    return [
      {
        metric: 'HP Win %',
        [player1.name]: player1.hp_win_pct,
        [player2.name]: player2.hp_win_pct,
        unit: '%'
      },
      {
        metric: 'Clutch Score',
        [player1.name]: player1.overall_clutch_score,
        [player2.name]: player2.overall_clutch_score,
        unit: 'pts'
      },
      {
        metric: 'Chasing SR',
        [player1.name]: player1.batting.inn2_hp_sr || player1.batting.normal_strike_rate || player1.batting.strike_rate || 0,
        [player2.name]: player2.batting.inn2_hp_sr || player2.batting.normal_strike_rate || player2.batting.strike_rate || 0,
        unit: 'SR'
      },
      {
        metric: 'Suppression (x10)',
        [player1.name]: Math.max(0, player1.bowling.defending_suppression * 10),
        [player2.name]: Math.max(0, player2.bowling.defending_suppression * 10),
        unit: 'rpo*10'
      },
      {
        metric: 'Dot Ball %',
        [player1.name]: player1.role === 'Bowler' ? (player1.bowling.normal_dot_pct ?? player1.bowling.dot_pct) : (player1.batting.normal_dot_pct ?? Math.round(((player1.batting.normal_dots ?? player1.batting.dots ?? 0) / (player1.batting.total_normal_balls ?? player1.batting.balls_faced ?? 1)) * 100)),
        [player2.name]: player2.role === 'Bowler' ? (player2.bowling.normal_dot_pct ?? player2.bowling.dot_pct) : (player2.batting.normal_dot_pct ?? Math.round(((player2.batting.normal_dots ?? player2.batting.dots ?? 0) / (player2.batting.total_normal_balls ?? player2.batting.balls_faced ?? 1)) * 100)),
        unit: '%'
      },
      {
        metric: 'Boundary %',
        [player1.name]: player1.role === 'Bowler' ? 18.6 : Math.round((((player1.batting.normal_fours ?? player1.batting.fours ?? 0) + (player1.batting.normal_sixes ?? player1.batting.sixes ?? 0)) / (player1.batting.total_normal_balls ?? player1.batting.balls_faced ?? 1)) * 100),
        [player2.name]: player2.role === 'Bowler' ? 18.6 : Math.round((((player2.batting.normal_fours ?? player2.batting.fours ?? 0) + (player2.batting.normal_sixes ?? player2.batting.sixes ?? 0)) / (player2.batting.total_normal_balls ?? player2.batting.balls_faced ?? 1)) * 100),
        unit: '%'
      }
    ];
  }, [player1, player2]);

  // Cohort Group Filtering
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

  const customCohortPlayers = useMemo(() => {
    return players.filter((p) => cohortPlayerIds.includes(p.id));
  }, [players, cohortPlayerIds]);

  const currentCohortPlayers = useMemo(() => {
    if (selectedGroup === 'top_bowlers') return top10Bowlers;
    if (selectedGroup === 'top_batters') return top10Batters;
    return customCohortPlayers;
  }, [selectedGroup, top10Bowlers, top10Batters, customCohortPlayers]);

  const cohortChartData = useMemo(() => {
    return currentCohortPlayers.map((p) => {
      let val = 0;
      let label = '';
      if (cohortMetric === 'suppression') {
        val = p.bowling.defending_suppression;
        label = `+${val.toFixed(2)} rpo`;
      } else if (cohortMetric === 'chasing_sr') {
        val = p.batting.inn2_hp_sr || p.batting.normal_strike_rate || p.batting.strike_rate || 0;
        label = `${val.toFixed(1)} SR`;
      } else if (cohortMetric === 'win_pct') {
        val = p.hp_win_pct;
        label = `${val}%`;
      } else if (cohortMetric === 'workload') {
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
  }, [currentCohortPlayers, cohortMetric]);

  const toggleCohortPlayer = (id: string) => {
    if (cohortPlayerIds.includes(id)) {
      if (cohortPlayerIds.length > 2) {
        setCohortPlayerIds(cohortPlayerIds.filter((p) => p !== id));
      }
    } else {
      if (cohortPlayerIds.length < 8) {
        setCohortPlayerIds([...cohortPlayerIds, id]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-gradient-to-r from-[#0F2341] via-[#0A192F] to-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
              <Swords className="w-4 h-4 text-[#EB1485]" />
              <span>Rajasthan Royals Auction Lab • Multi-Player Comparative Intelligence</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Player Head-to-Head &amp; Cohort Comparison
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Select any 2 players from the full 231-player roster to view comprehensive, side-by-side analytics, wagon wheels, defending suppression, and biomechanical strengths.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
            <button
              onClick={() => setViewMode('head_to_head')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'head_to_head'
                  ? 'bg-[#EB1485] text-white shadow-lg shadow-[#EB1485]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>1v1 Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('cohort_chart')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'cohort_chart'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Cohort Bar Chart</span>
            </button>
          </div>
        </div>

        {/* 1v1 Quick Matchup Presets */}
        {viewMode === 'head_to_head' && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-slate-400 font-semibold mb-2">Featured Auction Matchups:</div>
            <div className="flex flex-wrap gap-2 text-xs">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPlayer1Id(preset.p1);
                    setPlayer2Id(preset.p2);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                    player1Id === preset.p1 && player2Id === preset.p2
                      ? 'bg-[#EB1485]/20 text-[#EB1485] border-[#EB1485]'
                      : 'bg-black/30 text-slate-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* VIEW MODE 1: 1v1 HEAD-TO-HEAD SIDE-BY-SIDE COMPARISON                   */}
      {/* ===================================================================== */}
      {viewMode === 'head_to_head' && player1 && player2 && (
        <div className="space-y-6">
          {/* Dual Player Selector Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player 1 Selector */}
            <div className="bg-[#0F2341] border border-[#EB1485]/40 rounded-2xl p-4 shadow-xl">
              <label className="text-xs font-bold text-[#EB1485] uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>Select Player 1 (Left Column)</span>
                <span className="text-[10px] text-slate-400">Total: {players.length} Players</span>
              </label>
              <select
                value={player1Id}
                onChange={(e) => setPlayer1Id(e.target.value)}
                className="w-full bg-[#050E1D] border border-white/20 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#EB1485] focus:ring-1 focus:ring-[#EB1485]"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.auction_rank} {p.name} ({p.role} — {p.team})
                  </option>
                ))}
              </select>
            </div>

            {/* Player 2 Selector */}
            <div className="bg-[#0F2341] border border-[#D4AF37]/40 rounded-2xl p-4 shadow-xl">
              <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>Select Player 2 (Right Column)</span>
                <span className="text-[10px] text-slate-400">Total: {players.length} Players</span>
              </label>
              <select
                value={player2Id}
                onChange={(e) => setPlayer2Id(e.target.value)}
                className="w-full bg-[#050E1D] border border-white/20 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.auction_rank} {p.name} ({p.role} — {p.team})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Direct Comparative Bar Chart: Player 1 vs Player 2 */}
          <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#EB1485]" />
                  <span>Head-to-Head Performance Benchmark ({player1.name} vs {player2.name})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Side-by-side grouped metrics normalized across High-Pressure conditions ($PI \ge 0.60$)
                </p>
              </div>
              <div className="flex items-center space-x-4 text-xs font-bold">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#EB1485]" />
                  <span className="text-slate-200">{player1.name}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                  <span className="text-slate-200">{player2.name}</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={headToHeadChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050E1D', borderColor: '#ffffff20', borderRadius: '12px' }}
                  />
                  <Bar dataKey={player1.name} fill={RR_PINK} radius={[6, 6, 0, 0]} />
                  <Bar dataKey={player2.name} fill={RR_GOLD} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SIDE-BY-SIDE ALL INFORMATIONS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* =============================================================== */}
            {/* COLUMN 1: PLAYER 1 COMPLETE INFORMATION                           */}
            {/* =============================================================== */}
            <div className="bg-[#0F2341] border-2 border-[#EB1485]/50 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#EB1485]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header Box */}
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-lg bg-[#EB1485] text-white text-xs font-black">
                    AUCTION RANK #{player1.auction_rank}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> {player1.hp_win_pct.toFixed(1)}% Win Rate
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">{player1.name}</h3>
                <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-[#EB1485] font-bold">{player1.role}</span>
                  <span>•</span>
                  <span>{player1.team}</span>
                  <span>•</span>
                  <span>{player1.country}</span>
                  <span>•</span>
                  <span className="text-slate-400">
                    {player1.role === 'Bowler' ? player1.bowling_type : player1.batting_type}
                  </span>
                </div>
                <div className="mt-2 text-xs font-bold text-[#D4AF37] bg-black/40 px-3 py-1 rounded-lg border border-white/5 inline-block">
                  Clutch Rating: {player1.overall_clutch_score} pts (BPI: {player1.bpi} / BoPI: {player1.bopi})
                </div>
              </div>

              {/* Tactical Archetype & Biomechanical Weapon */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-xs space-y-2">
                <div className="text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#EB1485]" />
                  <span>Tactical Archetype &amp; Biomechanical Strengths</span>
                </div>
                <div className="text-white font-semibold">{player1.tactical_role}</div>
                <p className="text-slate-300 leading-relaxed">{player1.strengths_summary}</p>
              </div>

              {/* Batting Information Box */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-white/10 pb-2">
                  <span>Batting Analytics (High-Pressure)</span>
                  <span className="text-[#EB1485]">{player1.batting.hp_runs} Total HP Runs</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">2nd Inn HP Runs</div>
                    <div className="text-sm font-bold text-[#EB1485]">{player1.batting.inn2_hp_runs} r</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Chasing SR</div>
                    <div className="text-sm font-bold text-[#D4AF37]">{player1.batting.inn2_hp_sr.toFixed(1)}</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">1st Inn Runs/SR</div>
                    <div className="text-sm font-bold text-white">{player1.batting.inn1_hp_runs}r ({player1.batting.inn1_hp_sr.toFixed(0)})</div>
                  </div>
                </div>

                {/* Off-side vs Leg-side Donut Chart */}
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-200 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-[#EB1485]" /> Off-side vs Leg-side Run Split
                    </span>
                    <span className="text-[11px] text-slate-400">{player1.batting.total_normal_runs ?? player1.batting.total_runs} career runs</span>
                  </div>

                  <div className="h-32 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Off-side', value: player1.batting.offside_runs, pct: player1.batting.offside_pct, color: RR_PINK },
                            { name: 'Leg-side', value: player1.batting.onside_runs, pct: player1.batting.onside_pct, color: RR_GOLD },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={48}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          <Cell fill={RR_PINK} />
                          <Cell fill={RR_GOLD} />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs mt-1">
                    <div className="p-1.5 rounded-lg bg-black/40">
                      <span className="text-slate-400 text-[10px]">Off-side: </span>
                      <strong className="text-[#EB1485]">{player1.batting.offside_pct}%</strong>
                      <span className="text-slate-500 text-[10px]"> ({player1.batting.offside_runs}r)</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/40">
                      <span className="text-slate-400 text-[10px]">Leg-side: </span>
                      <strong className="text-[#D4AF37]">{player1.batting.onside_pct}%</strong>
                      <span className="text-slate-500 text-[10px]"> ({player1.batting.onside_runs}r)</span>
                    </div>
                  </div>
                </div>

                {/* Additional Batting Signals */}
                <div className="text-xs text-slate-300 space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Career Normal:</span>
                    <strong className="text-white">
                      {player1.batting.total_normal_runs} r ({player1.batting.total_normal_balls}b @ {player1.batting.normal_strike_rate} SR)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dot Ball % Faced:</span>
                    <strong className="text-white">
                      {player1.batting.normal_dot_pct ?? Math.round(((player1.batting.normal_dots ?? player1.batting.dots ?? 0) / (player1.batting.total_normal_balls ?? player1.batting.balls_faced ?? 1)) * 100)}% ({player1.batting.normal_dots ?? player1.batting.dots ?? 0} dots)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Boundaries Scored:</span>
                    <strong className="text-[#EB1485]">
                      {(player1.batting.normal_fours ?? player1.batting.fours ?? 0) + (player1.batting.normal_sixes ?? player1.batting.sixes ?? 0)} ({(player1.batting.normal_fours ?? player1.batting.fours ?? 0)} fours, {(player1.batting.normal_sixes ?? player1.batting.sixes ?? 0)} sixes)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">vs Pace / vs Spin:</span>
                    <strong className="text-white">
                      {player1.batting.pace_sr.toFixed(0)} SR / {player1.batting.spin_sr.toFixed(0)} SR
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg RRR Faced / Team WIH:</span>
                    <strong className="text-[#D4AF37]">
                      {player1.batting.avg_rrr_faced.toFixed(1)} rpo / {player1.batting.team_wih} WIH
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Death Phase % (16-20):</span>
                    <strong className="text-white">{player1.batting.death_pct}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">10+ RRR Chase Avg:</span>
                    <strong className="text-[#D4AF37]">{player1.batting.ten_plus_rrr_display || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Chase Win % / Best:</span>
                    <strong className="text-emerald-400">
                      {player1.batting.chase_win_record || player1.batting.chase_win_pct || `${player1.hp_win_pct.toFixed(1)}%`} ({player1.batting.best_match_score || 'N/A'})
                    </strong>
                  </div>
                </div>
              </div>

              {/* Bowling Information Box */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-white/10 pb-2">
                  <span>Bowling Analytics (High-Pressure)</span>
                  <span className="text-[#D4AF37]">{player1.bowling.hp_overs} Total HP Overs</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Defending Sup.</div>
                    <div className="text-sm font-bold text-emerald-400">
                      +{player1.bowling.defending_suppression.toFixed(2)} rpo
                    </div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Inn 2 Econ</div>
                    <div className="text-sm font-bold text-white">{player1.bowling.inn2_economy.toFixed(2)}</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">HP Wickets</div>
                    <div className="text-sm font-bold text-[#EB1485]">{player1.bowling.hp_wickets} wkts</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Career Balls Bowled:</span>
                    <strong className="text-white">
                      {player1.bowling.total_normal_balls} b ({player1.bowling.total_normal_wickets}w @ {player1.bowling.normal_economy})
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">HP Economy &amp; Bowling SR:</span>
                    <strong className="text-white">{player1.bowling.hp_economy.toFixed(2)} rpo / {player1.bowling.normal_bowling_sr} SR</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target RRR Defended:</span>
                    <strong className="text-[#D4AF37]">{player1.bowling.avg_rrr_defended.toFixed(1)} rpo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dot Ball % Bowled:</span>
                    <strong className="text-white">{player1.bowling.dot_pct}% dots</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Defended Below RRR:</span>
                    <strong className="text-emerald-400">{player1.bowling.defended_below_rrr_display || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Best Bowling Match:</span>
                    <strong className="text-rose-300">{player1.bowling.best_bowling_match || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Speed Profile:</span>
                    <strong className="text-cyan-300 text-[11px]">{player1.bowling.speed_profile || (player1.bowling.avg_speed_kmh ? `${player1.bowling.avg_speed_kmh} km/h` : 'N/A')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Opponent WIH / Death %:</span>
                    <strong className="text-white">{player1.bowling.opponent_wih} WIH / {player1.bowling.death_pct}% death</strong>
                  </div>
                </div>
              </div>

              {/* View Deep Dive Button */}
              <button
                onClick={() => onSelectPlayer(player1)}
                className="w-full py-2.5 rounded-xl bg-[#EB1485] text-white font-bold text-xs shadow-lg shadow-[#EB1485]/20 hover:bg-[#EB1485]/90 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Open {player1.name}'s Deep Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* =============================================================== */}
            {/* COLUMN 2: PLAYER 2 COMPLETE INFORMATION                           */}
            {/* =============================================================== */}
            <div className="bg-[#0F2341] border-2 border-[#D4AF37]/50 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header Box */}
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-lg bg-[#D4AF37] text-black text-xs font-black">
                    AUCTION RANK #{player2.auction_rank}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> {player2.hp_win_pct.toFixed(1)}% Win Rate
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">{player2.name}</h3>
                <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-[#D4AF37] font-bold">{player2.role}</span>
                  <span>•</span>
                  <span>{player2.team}</span>
                  <span>•</span>
                  <span>{player2.country}</span>
                  <span>•</span>
                  <span className="text-slate-400">
                    {player2.role === 'Bowler' ? player2.bowling_type : player2.batting_type}
                  </span>
                </div>
                <div className="mt-2 text-xs font-bold text-[#EB1485] bg-black/40 px-3 py-1 rounded-lg border border-white/5 inline-block">
                  Clutch Rating: {player2.overall_clutch_score} pts (BPI: {player2.bpi} / BoPI: {player2.bopi})
                </div>
              </div>

              {/* Tactical Archetype & Biomechanical Weapon */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-xs space-y-2">
                <div className="text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#EB1485]" />
                  <span>Tactical Archetype &amp; Biomechanical Strengths</span>
                </div>
                <div className="text-white font-semibold">{player2.tactical_role}</div>
                <p className="text-slate-300 leading-relaxed">{player2.strengths_summary}</p>
              </div>

              {/* Batting Information Box */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-white/10 pb-2">
                  <span>Batting Analytics (High-Pressure)</span>
                  <span className="text-[#EB1485]">{player2.batting.hp_runs} Total HP Runs</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">2nd Inn HP Runs</div>
                    <div className="text-sm font-bold text-[#EB1485]">{player2.batting.inn2_hp_runs} r</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Chasing SR</div>
                    <div className="text-sm font-bold text-[#D4AF37]">{player2.batting.inn2_hp_sr.toFixed(1)}</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">1st Inn Runs/SR</div>
                    <div className="text-sm font-bold text-white">{player2.batting.inn1_hp_runs}r ({player2.batting.inn1_hp_sr.toFixed(0)})</div>
                  </div>
                </div>

                {/* Off-side vs Leg-side Donut Chart */}
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-200 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-[#EB1485]" /> Off-side vs Leg-side Run Split
                    </span>
                    <span className="text-[11px] text-slate-400">{player2.batting.total_normal_runs ?? player2.batting.total_runs} career runs</span>
                  </div>

                  <div className="h-32 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Off-side', value: player2.batting.offside_runs, pct: player2.batting.offside_pct, color: RR_PINK },
                            { name: 'Leg-side', value: player2.batting.onside_runs, pct: player2.batting.onside_pct, color: RR_GOLD },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={48}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          <Cell fill={RR_PINK} />
                          <Cell fill={RR_GOLD} />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs mt-1">
                    <div className="p-1.5 rounded-lg bg-black/40">
                      <span className="text-slate-400 text-[10px]">Off-side: </span>
                      <strong className="text-[#EB1485]">{player2.batting.offside_pct}%</strong>
                      <span className="text-slate-500 text-[10px]"> ({player2.batting.offside_runs}r)</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/40">
                      <span className="text-slate-400 text-[10px]">Leg-side: </span>
                      <strong className="text-[#D4AF37]">{player2.batting.onside_pct}%</strong>
                      <span className="text-slate-500 text-[10px]"> ({player2.batting.onside_runs}r)</span>
                    </div>
                  </div>
                </div>

                {/* Additional Batting Signals */}
                <div className="text-xs text-slate-300 space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Career Normal:</span>
                    <strong className="text-white">
                      {player2.batting.total_normal_runs} r ({player2.batting.total_normal_balls}b @ {player2.batting.normal_strike_rate} SR)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dot Ball % Faced:</span>
                    <strong className="text-white">
                      {player2.batting.normal_dot_pct ?? Math.round(((player2.batting.normal_dots ?? player2.batting.dots ?? 0) / (player2.batting.total_normal_balls ?? player2.batting.balls_faced ?? 1)) * 100)}% ({player2.batting.normal_dots ?? player2.batting.dots ?? 0} dots)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Boundaries Scored:</span>
                    <strong className="text-[#EB1485]">
                      {(player2.batting.normal_fours ?? player2.batting.fours ?? 0) + (player2.batting.normal_sixes ?? player2.batting.sixes ?? 0)} ({(player2.batting.normal_fours ?? player2.batting.fours ?? 0)} fours, {(player2.batting.normal_sixes ?? player2.batting.sixes ?? 0)} sixes)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">vs Pace / vs Spin:</span>
                    <strong className="text-white">
                      {player2.batting.pace_sr.toFixed(0)} SR / {player2.batting.spin_sr.toFixed(0)} SR
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg RRR Faced / Team WIH:</span>
                    <strong className="text-[#D4AF37]">
                      {player2.batting.avg_rrr_faced.toFixed(1)} rpo / {player2.batting.team_wih} WIH
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Death Phase % (16-20):</span>
                    <strong className="text-white">{player2.batting.death_pct}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">10+ RRR Chase Avg:</span>
                    <strong className="text-[#D4AF37]">{player2.batting.ten_plus_rrr_display || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Chase Win % / Best:</span>
                    <strong className="text-emerald-400">
                      {player2.batting.chase_win_record || player2.batting.chase_win_pct || `${player2.hp_win_pct.toFixed(1)}%`} ({player2.batting.best_match_score || 'N/A'})
                    </strong>
                  </div>
                </div>
              </div>

              {/* Bowling Information Box */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-white/10 pb-2">
                  <span>Bowling Analytics (High-Pressure)</span>
                  <span className="text-[#D4AF37]">{player2.bowling.hp_overs} Total HP Overs</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Defending Sup.</div>
                    <div className="text-sm font-bold text-emerald-400">
                      +{player2.bowling.defending_suppression.toFixed(2)} rpo
                    </div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Inn 2 Econ</div>
                    <div className="text-sm font-bold text-white">{player2.bowling.inn2_economy.toFixed(2)}</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">HP Wickets</div>
                    <div className="text-sm font-bold text-[#EB1485]">{player2.bowling.hp_wickets} wkts</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Career Balls Bowled:</span>
                    <strong className="text-white">
                      {player2.bowling.total_normal_balls} b ({player2.bowling.total_normal_wickets}w @ {player2.bowling.normal_economy})
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">HP Economy &amp; Bowling SR:</span>
                    <strong className="text-white">{player2.bowling.hp_economy.toFixed(2)} rpo / {player2.bowling.normal_bowling_sr} SR</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target RRR Defended:</span>
                    <strong className="text-[#D4AF37]">{player2.bowling.avg_rrr_defended.toFixed(1)} rpo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dot Ball % Bowled:</span>
                    <strong className="text-white">{player2.bowling.dot_pct}% dots</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Defended Below RRR:</span>
                    <strong className="text-emerald-400">{player2.bowling.defended_below_rrr_display || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Best Bowling Match:</span>
                    <strong className="text-rose-300">{player2.bowling.best_bowling_match || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Speed Profile:</span>
                    <strong className="text-cyan-300 text-[11px]">{player2.bowling.speed_profile || (player2.bowling.avg_speed_kmh ? `${player2.bowling.avg_speed_kmh} km/h` : 'N/A')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Opponent WIH / Death %:</span>
                    <strong className="text-white">{player2.bowling.opponent_wih} WIH / {player2.bowling.death_pct}% death</strong>
                  </div>
                </div>
              </div>

              {/* View Deep Dive Button */}
              <button
                onClick={() => onSelectPlayer(player2)}
                className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs shadow-lg shadow-[#D4AF37]/20 hover:bg-[#D4AF37]/90 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Open {player2.name}'s Deep Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW MODE 2: COHORT OVERVIEW (ORIGINAL BAR CHART VIEW)                 */}
      {/* ===================================================================== */}
      {viewMode === 'cohort_chart' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex space-x-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => {
                  setSelectedGroup('top_bowlers');
                  setCohortMetric('suppression');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedGroup === 'top_bowlers' ? 'bg-[#D4AF37] text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Top 10 Bowlers
              </button>
              <button
                onClick={() => {
                  setSelectedGroup('top_batters');
                  setCohortMetric('chasing_sr');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedGroup === 'top_batters' ? 'bg-[#EB1485] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Top 10 Batters
              </button>
              <button
                onClick={() => setSelectedGroup('custom')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedGroup === 'custom' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom Cohort
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => setCohortMetric('suppression')}
                className={`px-3 py-1 rounded-lg border font-bold ${
                  cohortMetric === 'suppression' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'text-slate-400 border-white/10'
                }`}
              >
                Defending Suppression
              </button>
              <button
                onClick={() => setCohortMetric('chasing_sr')}
                className={`px-3 py-1 rounded-lg border font-bold ${
                  cohortMetric === 'chasing_sr' ? 'bg-[#EB1485] text-white border-[#EB1485]' : 'text-slate-400 border-white/10'
                }`}
              >
                Chasing SR
              </button>
              <button
                onClick={() => setCohortMetric('win_pct')}
                className={`px-3 py-1 rounded-lg border font-bold ${
                  cohortMetric === 'win_pct' ? 'bg-emerald-500 text-black border-emerald-500' : 'text-slate-400 border-white/10'
                }`}
              >
                Win Rate %
              </button>
              <button
                onClick={() => setCohortMetric('workload')}
                className={`px-3 py-1 rounded-lg border font-bold ${
                  cohortMetric === 'workload' ? 'bg-sky-500 text-black border-sky-500' : 'text-slate-400 border-white/10'
                }`}
              >
                Workload
              </button>
            </div>
          </div>

          {/* Cohort Bar Chart */}
          <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-black text-white mb-1">
              Tournament Cohort Bar Chart Comparison
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Comparing across {cohortChartData.length} selected high-pressure contenders
            </p>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cohortChartData} margin={{ top: 20, right: 30, left: 10, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-30} textAnchor="end" interval={0} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050E1D', borderColor: '#ffffff20', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {cohortChartData.map((entry, index) => (
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
          </div>
        </div>
      )}
    </div>
  );
};
