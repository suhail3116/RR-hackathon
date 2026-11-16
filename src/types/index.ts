export interface StrokeItem {
  name: string;
  runs: number;
  balls: number;
}

export interface BattingStats {
  total_runs: number;
  balls_faced: number;
  strike_rate: number;
  offside_runs: number;
  offside_balls: number;
  offside_pct: number;
  onside_runs: number;
  onside_balls: number;
  onside_pct: number;
  pace_runs: number;
  pace_balls: number;
  pace_sr: number;
  spin_runs: number;
  spin_balls: number;
  spin_sr: number;
  fours: number;
  sixes: number;
  dots: number;
  top_strokes: StrokeItem[];
  hp_runs: number;
  hp_balls: number;
  hp_sr: number;
  hp_avg: number;
  inn2_hp_runs: number;
  inn2_hp_sr: number;
  inn1_hp_runs: number;
  inn1_hp_sr: number;
  avg_rrr_faced: number;
  team_wih: number;
  death_pct: number;
  clutch_delta: number;
  runs_above_par_100: number;
}

export interface BowlingStats {
  hp_overs: number;
  hp_balls: number;
  hp_runs: number;
  hp_wickets: number;
  hp_economy: number;
  inn2_economy: number;
  inn1_economy: number;
  avg_rrr_defended: number;
  defending_suppression: number;
  opponent_wih: number;
  death_pct: number;
  dot_pct: number;
  runs_saved_100: number;
  clutch_delta: number;
  delivery_styles: Record<string, number>;
}

export interface Player {
  id: string;
  name: string;
  role: 'Batter' | 'Bowler' | 'All-rounder';
  team: string;
  country: string;
  batting_type: string;
  bowling_type: string;
  auction_rank: number;
  clutch_tier: string;
  bpi: number;
  bopi: number;
  overall_clutch_score: number;
  hp_win_pct: number;
  tactical_role: string;
  strengths_summary: string;
  batting: BattingStats;
  bowling: BowlingStats;
}

export interface DashboardData {
  generated_at: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    blue: string;
  };
  summary_stats: {
    total_balls_evaluated: number;
    total_matches: number;
    hp_balls_count: number;
    hp_balls_pct: number;
    total_players_profiled: number;
    top_clutch_batters: number;
    top_clutch_bowlers: number;
  };
  players: Player[];
}
