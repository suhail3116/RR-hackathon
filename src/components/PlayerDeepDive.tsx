import React from 'react';
import { Player } from '../types';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import {
  Shield,
  Trophy,
  Activity,
  Zap,
  Target,
  Clock,
  Compass,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  X,
  Flame,
  Crosshair
} from 'lucide-react';

interface PlayerDeepDiveProps {
  player: Player;
  onBackToSelection?: () => void;
  isModal?: boolean;
}

const RR_PINK = '#EB1485';
const RR_NAVY = '#0F2341';
const RR_GOLD = '#D4AF37';
const RR_BLUE = '#1E3A8A';
const RR_CYAN = '#06B6D4';
const RR_EMERALD = '#10B981';
const RR_PURPLE = '#8B5CF6';

const STYLE_COLORS = [
  '#EB1485', '#D4AF37', '#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#3B82F6'
];

export const PlayerDeepDive: React.FC<PlayerDeepDiveProps> = ({
  player,
  onBackToSelection,
  isModal = false
}) => {
  const isBowler = player.role === 'Bowler';
  const bat = player.batting;
  const bowl = player.bowling;

  // Off-side vs Leg-side Data for Batter Pie Chart
  const offLegData = [
    { name: 'Off-side Runs', value: bat.offside_runs, pct: bat.offside_pct, color: RR_PINK },
    { name: 'Leg-side (On-side) Runs', value: bat.onside_runs, pct: bat.onside_pct, color: RR_GOLD },
  ];

  // Pace vs Spin Data
  const paceSpinData = [
    { name: 'vs Pace', runs: bat.pace_runs, sr: bat.pace_sr, balls: bat.pace_balls },
    { name: 'vs Spin', runs: bat.spin_runs, sr: bat.spin_sr, balls: bat.spin_balls },
  ];

  // Top Strokes Data
  const strokesData = bat.top_strokes.map((s) => ({
    name: s.name,
    runs: s.runs,
    balls: s.balls,
  }));

  // Innings 1 vs Innings 2 High Pressure Data
  const bowlerInnData = [
    { name: 'Innings 1 (Setting)', econ: bowl.inn1_economy, rrr: 0 },
    { name: 'Innings 2 (Defending)', econ: bowl.inn2_economy, rrr: bowl.avg_rrr_defended },
  ];

  const batterInnData = [
    { name: 'Innings 1 (Setting)', runs: bat.inn1_hp_runs, sr: bat.inn1_hp_sr },
    { name: 'Innings 2 (Chasing)', runs: bat.inn2_hp_runs, sr: bat.inn2_hp_sr },
  ];

  // Bowler phase breakdown
  const bowlerPhaseData = [
    { name: 'Death Phase (16-20)', value: bowl.death_pct, color: RR_PINK },
    { name: 'Overs 1-15 (PP & Middle)', value: Math.max(0, 100 - bowl.death_pct), color: RR_BLUE },
  ];

  // Bowler delivery styles for bar chart
  const bowlerStylesData = (bowl.delivery_styles_list || []).map((item, idx) => ({
    name: item.style,
    balls: item.balls,
    pct: item.pct,
    fill: STYLE_COLORS[idx % STYLE_COLORS.length]
  }));

  // Bowler all wicket-taking delivery styles
  const bowlerWktStylesData = (bowl.wicket_delivery_styles_list || []).map((item, idx) => ({
    name: item.style,
    wickets: item.wickets,
    pct: item.pct,
    fill: STYLE_COLORS[idx % STYLE_COLORS.length]
  }));

  return (
    <div className={`space-y-6 ${isModal ? 'max-h-[85vh] overflow-y-auto pr-2' : ''}`}>
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#0F2341] via-[#0A192F] to-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#EB1485]/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            {onBackToSelection && (
              <button
                onClick={onBackToSelection}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-white mb-2 transition-colors"
              >
                <span>&larr; Back to Selection Board</span>
              </button>
            )}
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black">
                AUCTION RANK #{player.auction_rank}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#EB1485]/20 border border-[#EB1485]/40 text-[#EB1485] text-xs font-bold">
                {player.role}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3" /> {player.hp_win_pct.toFixed(1)}% Win Rate
              </span>
            </div>

            <h2 className="text-3xl font-black text-white mt-1 tracking-tight">
              {player.name}
            </h2>
            <div className="text-xs text-slate-300 flex items-center space-x-3 mt-1">
              <span>{player.team}</span>
              <span>•</span>
              <span>{player.country}</span>
              <span>•</span>
              <span className="text-[#D4AF37] font-semibold">
                {isBowler ? player.bowling_type : player.batting_type}
              </span>
              <span>•</span>
              <span className="text-slate-400">Rating: {player.overall_clutch_score}</span>
            </div>
          </div>

          {/* Quick Metrics KPI cards including Total Normal Runs and Total Balls Bowled */}
          <div className="flex flex-wrap gap-3">
            {isBowler ? (
              <>
                <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[110px]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Balls Bowled</div>
                  <div className="text-lg font-black text-white">
                    {bowl.total_normal_balls} b
                  </div>
                  <div className="text-[10px] text-slate-400">{bowl.total_normal_overs} ov @ {bowl.normal_economy} econ</div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[100px]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Career Wickets</div>
                  <div className="text-lg font-black text-[#EB1485]">
                    {bowl.total_normal_wickets} w
                  </div>
                  <div className="text-[10px] text-slate-400">{bowl.normal_bowling_avg} avg</div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[100px]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Suppression</div>
                  <div className="text-lg font-black text-[#D4AF37]">
                    +{bowl.defending_suppression.toFixed(2)} rpo
                  </div>
                  <div className="text-[10px] text-slate-400">vs target RRR</div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[100px]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">HP Overs</div>
                  <div className="text-lg font-black text-white">
                    {bowl.hp_overs} ov
                  </div>
                  <div className="text-[10px] text-slate-400">{bowl.hp_wickets} HP wkts</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[110px]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Normal Runs</div>
                  <div className="text-lg font-black text-white">
                    {bat.total_normal_runs} r
                  </div>
                  <div className="text-[10px] text-slate-400">{bat.total_normal_balls} balls faced</div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[100px]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Career SR / Avg</div>
                  <div className="text-lg font-black text-[#D4AF37]">
                    {bat.normal_strike_rate}
                  </div>
                  <div className="text-[10px] text-slate-400">{bat.normal_batting_avg} Avg</div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[100px]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Inn 2 HP Runs</div>
                  <div className="text-lg font-black text-[#EB1485]">
                    {bat.inn2_hp_runs} r
                  </div>
                  <div className="text-[10px] text-slate-400">{bat.inn2_hp_sr.toFixed(1)} Chasing SR</div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[100px]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total HP Runs</div>
                  <div className="text-lg font-black text-white">
                    {bat.hp_runs} r
                  </div>
                  <div className="text-[10px] text-slate-400">{bat.hp_sr.toFixed(1)} HP SR</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tactical Strengths & Biomechanics Banner */}
        <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
          <div className="text-[#D4AF37] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#EB1485]" />
            <span>Tactical Archetype &amp; Biomechanical Strengths</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-medium">
            {player.strengths_summary}
          </p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Off-side vs Leg-side PIE CHART (for Batters) or High Pressure Phase (for Bowlers) */}
        {!isBowler ? (
          <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#EB1485]" />
                  <span>Off-side vs Leg-side Run Distribution (Pie Chart)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Percentage of total scoring shots executed to off-side vs on-side
                </p>
              </div>
              <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/20">
                Off {bat.offside_pct}% | Leg {bat.onside_pct}%
              </span>
            </div>

            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={offLegData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, pct }: any) => `${name ? name.split(' ')[0] : ''}: ${pct}%`}
                  >
                    {offLegData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#050E1D" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#050E1D] border border-white/20 p-2.5 rounded-xl shadow-xl text-xs">
                            <div className="font-bold text-white">{data.name}</div>
                            <div className="text-[#EB1485] font-semibold">{data.value} Runs ({data.pct}%)</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Stats Summary Box */}
            <div className="grid grid-cols-2 gap-3 mt-2 text-center text-xs">
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-slate-400">Off-side Runs</div>
                <div className="text-base font-bold text-[#EB1485]">{bat.offside_runs} r ({bat.offside_pct}%)</div>
                <div className="text-[10px] text-slate-500">{bat.offside_balls} balls faced</div>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-slate-400">Leg-side (On-side) Runs</div>
                <div className="text-base font-bold text-[#D4AF37]">{bat.onside_runs} r ({bat.onside_pct}%)</div>
                <div className="text-[10px] text-slate-500">{bat.onside_balls} balls faced</div>
              </div>
            </div>
          </div>
        ) : (
          /* Bowler Death vs Middle Phase Pie Chart */
          <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#EB1485]" />
                  <span>High-Pressure Phase Allocation (Pie Chart)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Death Overs (16–20) vs Powerplay / Middle overs
                </p>
              </div>
              <span className="text-xs font-bold text-[#EB1485] bg-[#EB1485]/10 px-2 py-0.5 rounded-full border border-[#EB1485]/20">
                Death %: {bowl.death_pct}%
              </span>
            </div>

            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={bowlerPhaseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }: any) => `${name ? name.split(' ')[0] : ''}: ${value}%`}
                  >
                    {bowlerPhaseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#050E1D" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2 text-center text-xs">
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-slate-400">Death Phase Burden</div>
                <div className="text-base font-bold text-[#EB1485]">{bowl.death_pct}%</div>
                <div className="text-[10px] text-slate-500">Overs 16 to 20 crunch</div>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-slate-400">High-Pressure Dot %</div>
                <div className="text-base font-bold text-[#D4AF37]">{bowl.dot_pct}%</div>
                <div className="text-[10px] text-slate-500">Dot ball percentage under fire</div>
              </div>
            </div>
          </div>
        )}

        {/* CHART 2: Innings 2 Chasing vs Innings 1 Setting */}
        <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {isBowler
                    ? 'Innings 2 Defending vs Innings 1 Economy'
                    : 'Innings 2 Chasing vs Innings 1 Runs & Strike Rate'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isBowler
                  ? `Target RRR Defended: ${bowl.avg_rrr_defended.toFixed(1)} rpo`
                  : `Avg RRR Faced in Chases: ${bat.avg_rrr_faced.toFixed(1)} rpo | Team WIH: ${bat.team_wih}`}
              </p>
            </div>
            <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
              {isBowler ? `Suppression: +${bowl.defending_suppression.toFixed(2)}` : `Inn 2 SR: ${bat.inn2_hp_sr.toFixed(1)}`}
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {isBowler ? (
                <BarChart data={bowlerInnData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 16]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050E1D', borderColor: '#ffffff20', borderRadius: '12px' }}
                  />
                  <Legend />
                  <Bar dataKey="econ" name="Actual Economy (rpo)" fill={RR_PINK} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="rrr" name="Target RRR Defended" fill={RR_GOLD} radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={batterInnData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050E1D', borderColor: '#ffffff20', borderRadius: '12px' }}
                  />
                  <Legend />
                  <Bar dataKey="runs" name="HP Runs Scored" fill={RR_PINK} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="sr" name="Strike Rate" fill={RR_GOLD} radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-slate-300 p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
            {isBowler ? (
              <>
                <span>Inn 1 Econ: <strong className="text-white">{bowl.inn1_economy.toFixed(2)}</strong></span>
                <span>•</span>
                <span>Inn 2 Econ: <strong className="text-[#EB1485]">{bowl.inn2_economy.toFixed(2)}</strong></span>
                <span>•</span>
                <span>Opponent WIH: <strong className="text-[#D4AF37]">{bowl.opponent_wih}</strong></span>
              </>
            ) : (
              <>
                <span>Inn 1 Runs: <strong className="text-white">{bat.inn1_hp_runs}r ({bat.inn1_hp_sr.toFixed(1)} SR)</strong></span>
                <span>•</span>
                <span>Inn 2 Runs: <strong className="text-[#EB1485]">{bat.inn2_hp_runs}r ({bat.inn2_hp_sr.toFixed(1)} SR)</strong></span>
              </>
            )}
          </div>
        </div>

        {/* CHART 3: Bowlers Bowling Style Bar (Requested Specifically by User) */}
        {isBowler ? (
          <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#EB1485]" />
                  <span>Bowlers Bowling Style Distribution (Delivery Variations)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Total deliveries tracked by variation style from ball-by-ball sensor tracking
                </p>
              </div>
              <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/20">
                {bowl.total_normal_balls} Total Balls
              </span>
            </div>

            {/* Segmented Horizontal Bar */}
            <div className="w-full bg-black/40 rounded-xl p-3 border border-white/10 mb-4">
              <div className="h-6 w-full rounded-lg overflow-hidden flex shadow-inner">
                {bowlerStylesData.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${item.pct}%`, backgroundColor: item.fill }}
                    title={`${item.name}: ${item.balls} balls (${item.pct}%)`}
                    className="h-full transition-all hover:opacity-80"
                  />
                ))}
              </div>
            </div>

            {/* Variation Styles Breakdown List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {bowlerStylesData.slice(0, 8).map((item, idx) => (
                <div key={idx} className="bg-black/30 p-2 rounded-xl border border-white/5 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-[11px] font-bold text-white truncate max-w-[90px]">{item.name}</span>
                  </div>
                  <div className="text-xs font-black text-[#D4AF37]">{item.balls} balls</div>
                  <div className="text-[10px] text-slate-400">{item.pct}% share</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* CHART 3 for Batters: Top Stroke Types */
          <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#EB1485]" />
                  <span>Top Scoring Shot Types (Stroke Analysis)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Runs accumulated by shot execution from ball-by-ball tracking
                </p>
              </div>
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strokesData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={85} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050E1D', borderColor: '#ffffff20', borderRadius: '12px' }}
                  />
                  <Bar dataKey="runs" name="Runs Scored" fill={RR_PINK} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 4: Bowlers All Wickets Taking Ball Style (Requested Specifically by User) */}
        {isBowler ? (
          <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-[#D4AF37]" />
                  <span>Bowlers All Wickets Taking Ball Style</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Delivery variations that successfully claimed wickets in career
                </p>
              </div>
              <span className="text-xs font-bold text-[#EB1485] bg-[#EB1485]/10 px-2.5 py-0.5 rounded-full border border-[#EB1485]/20">
                {bowl.total_normal_wickets} Total Wickets
              </span>
            </div>

            {bowlerWktStylesData.length > 0 ? (
              <>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bowlerWktStylesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#050E1D', borderColor: '#ffffff20', borderRadius: '12px' }}
                      />
                      <Bar dataKey="wickets" name="Wickets Taken" fill={RR_GOLD} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
                  {bowlerWktStylesData.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="bg-black/30 p-2 rounded-xl border border-white/5 text-center">
                      <div className="text-[11px] font-bold text-white truncate">{item.name}</div>
                      <div className="text-sm font-black text-emerald-400">{item.wickets} wkts</div>
                      <div className="text-[10px] text-slate-400">{item.pct}% of dismissals</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-44 flex items-center justify-center text-xs text-slate-400">
                No recorded wicket delivery variations in database.
              </div>
            )}
          </div>
        ) : (
          /* Pace vs Spin for Batters */
          <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#D4AF37]" />
                  <span>Performance Against Bowling Types (Pace vs Spin)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Strike rate and run distribution against express pace vs spin choke
                </p>
              </div>
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paceSpinData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050E1D', borderColor: '#ffffff20', borderRadius: '12px' }}
                  />
                  <Legend />
                  <Bar dataKey="runs" name="Runs" fill={RR_PINK} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="sr" name="Strike Rate" fill={RR_GOLD} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
