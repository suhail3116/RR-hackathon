import React from 'react';
import { BookOpen, Shield, Target, Flame, FileText, CheckCircle2, AlertTriangle, Zap, Compass } from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Card */}
      <div className="bg-gradient-to-r from-[#0F2341] via-[#0A192F] to-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4 text-[#EB1485]" />
          <span>Rajasthan Royals • Analytics Methodology Guide</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          High-Pressure Engineering Framework &amp; Technical Definitions
        </h2>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          Detailed mathematical formulations and tactical justifications answering the official Unstop Round 1 submission criteria. Evaluated across 200,999 deliveries in 883 matches (2022–2026).
        </p>
      </div>

      {/* Grid of Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Concept 1: Pressure Index Formulation */}
        <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center space-x-3 text-[#EB1485]">
            <Flame className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">1. Pressure Index ($PI_t \in [0.0, 1.0]$)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rather than defining pressure arbitrarily by over numbers, every single ball is evaluated dynamically based on five simultaneous dimensions:
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pl-2 list-disc list-inside">
            <li><strong>Required Run Rate (RRR):</strong> Clipped linear ramp above 4.0 rpo up to 14.0+ rpo.</li>
            <li><strong>Wickets in Hand (WIH):</strong> Resource decay curve measuring tailender exposure.</li>
            <li><strong>Balls Remaining / Stage:</strong> Urgency multiplier as deliveries expire in Overs 16–20.</li>
            <li><strong>Contest Closeness:</strong> Live finish filter (≤30 runs needed in final 3 overs boosts PI ≥ 0.75; dead rubbers drop to 0.25).</li>
            <li><strong>Tournament Stakes:</strong> 1.15x multiplier on IPL Playoffs and ICC knockout fixtures.</li>
          </ul>
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-[#D4AF37] font-semibold">
            High-Pressure Threshold: Deliveries with $PI \ge 0.60$ isolate exactly 70,739 balls (35.2% of dataset).
          </div>
        </div>

        {/* Concept 2: What is WIH? */}
        <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center space-x-3 text-[#D4AF37]">
            <Shield className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">2. What is WIH (Wickets in Hand)?</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In cricket, a batting side has 10 wickets before the innings terminates:
          </p>
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center text-xs text-white font-mono font-bold">
            WIH (Wickets in Hand) = 10 - Wickets Lost
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>For Batters:</strong> Facing 12.0 RRR with 3 WIH is maximum crisis because losing one more wicket ends the game. Finishers like <strong>Shashank Singh</strong> (5.4 WIH) and <strong>Rinku Singh</strong> (5.7 WIH) enter in extreme crisis.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>For Bowlers:</strong> Defending against opponents with 7.5 WIH (e.g. <strong>Axar Patel</strong>, <strong>Arshdeep Singh</strong>) is far harder because batters can hit freely without fear of dismissal.
          </p>
        </div>

        {/* Concept 3: Defending Suppression */}
        <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center space-x-3 text-emerald-400">
            <Target className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">3. Defending Suppression Margin</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Measures how effectively a bowler restricts the chasing team compared to the run rate they actually needed:
          </p>
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center text-xs text-white font-mono font-bold">
            Defending Suppression = Avg RRR Defended - Actual Innings 2 Economy
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Why Raw Economy Fails:</strong> A bowler conceding 7.5 rpo when the opponent only needed 6.0 rpo is losing the match (-1.5 rpo). But <strong>Matheesha Pathirana</strong> conceding 8.53 rpo when the opponent needed 15.81 rpo gives <strong>+7.28 rpo suppression</strong>, winning the match!
          </p>
        </div>

        {/* Concept 4: The Bumrah & Narine Paradox */}
        <div className="bg-[#0F2341] border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center space-x-3 text-purple-400">
            <Zap className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">4. The High Baseline Paradox (Bumrah &amp; Narine)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Why were Bumrah and Narine selected despite traditional models showing flat personal delta shifts?
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pl-2 list-disc list-inside">
            <li><strong>Jasprit Bumrah:</strong> Normal baseline economy is already 6.99 rpo. In the death overs, conceding 7.43 gives a flat delta (-0.44), yet he holds <strong>+4.15 defending suppression</strong> and delivered <strong>165 yorkers with only 6 boundaries (96.4% control)</strong>.</li>
            <li><strong>Sunil Narine:</strong> Holds the lowest economy under pressure in cricket history (<strong>6.01 rpo over 80.2 HP overs</strong>) with an <strong>83.3% match win rate</strong>.</li>
            <li>Penalizing legendary bowlers for having near-perfect baselines is solved by factoring cumulative runs saved (+218.2 for Bumrah).</li>
          </ul>
        </div>
      </div>

      {/* Official PDF Download Card */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0F2341] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#EB1485]" />
            <span>Official Round 1 Methodology Report (5-Page PDF)</span>
          </h4>
          <p className="text-xs text-slate-200 mt-1">
            Complete formal documentation prepared for the Rajasthan Royals selection board, including comparison tables, biomechanical profiles, and statistical auditing.
          </p>
        </div>

        <a
          href="/docs/Rajasthan_Royals_SupeRR_Selector_Methodology_Report.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#EB1485] hover:bg-[#EB1485]/90 text-white font-bold text-xs shadow-lg shadow-[#EB1485]/30 transition-all whitespace-nowrap"
        >
          <span>Open PDF Document</span>
        </a>
      </div>
    </div>
  );
};
