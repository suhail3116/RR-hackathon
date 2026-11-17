export interface StrokeItem {
  name: string;
  runs: number;
  balls: number;
}

export interface DeliveryStyleItem {
  style: string;
  balls: number;
  pct: number;
}

export interface WicketStyleItem {
  style: string;
  wickets: number;
  pct: number;
}

export interface BattingStats {
  // Total normal runs scored & career numbers
  total_normal_runs: number;
  total_normal_balls: number;
  normal_strike_rate: number;
  normal_batting_avg: number;
  normal_fours: number;
  normal_sixes: number;
  normal_dots: number;
  normal_dot_pct: number;

  // Convenience aliases for backward compatibility
  total_runs?: number;
  balls_faced?: number;
  strike_rate?: number;
  dots?: number;
  fours?: number;
  sixes?: number;
  batting_avg?: number;

  // Off vs On side splits
  offside_runs: number;
  offside_balls: number;
  offside_pct: number;
  onside_runs: number;
  onside_balls: number;
  onside_pct: number;

  // Pace vs Spin splits
  pace_runs: number;
  pace_balls: number;
  pace_sr: number;
  spin_runs: number;
  spin_balls: number;
  spin_sr: number;

  // Stroke breakdown
  top_strokes: StrokeItem[];

  // High Pressure metrics
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

  // Innings 2 Chasing Master & Tactical metrics
  ten_plus_rrr_display?: string;
  ten_plus_rrr_avg?: string;
  ten_plus_rrr_sr?: string;
  chase_win_pct?: string;
  chase_win_record?: string;
  best_match_score?: string;
  defeat_margin?: string;
  top_boundary_stroke_inn2?: string;
}

export interface BowlingStats {
  // Total balls bowled & normal career numbers
  total_normal_balls: number;
  total_normal_overs: number;
  total_normal_runs: number;
  total_normal_wickets: number;
  normal_economy: number;
  normal_bowling_sr: number;
  normal_bowling_avg: number;
  normal_dot_pct: number;

  // High Pressure metrics
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

  // Delivery style bars & wicket style analysis
  delivery_styles: Record<string, number>;
  delivery_styles_list: DeliveryStyleItem[];
  wicket_delivery_styles: Record<string, number>;
  wicket_delivery_styles_list: WicketStyleItem[];

  // Innings 2 Defending Master & Tactical metrics
  defended_below_rrr_display?: string;
  defended_below_rrr_count?: number | string;
  defended_win_record?: string;
  best_bowling_match?: string;
  speed_profile?: string;
  avg_speed_kmh?: number;
  min_speed_kmh?: number;
  max_speed_kmh?: number;
  defending_margin?: string;
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
  overall_win_pct: number;
  total_matches: number;
  hp_matches: number;
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
