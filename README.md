# Rajasthan Royals — SupeRR Selector Season 2 Dashboard
### High-Pressure Player Selection & Valuation Analytics Hub (IPL 2027 Auction)

An interactive, production-grade analytics web application designed for Rajasthan Royals decision-makers and auction strategists. Built with **React 19, Vite, Tailwind CSS, Recharts, and Lightswind UI-inspired aesthetic components**.

---

## 🚀 How to Run the Application

### Option A: Double-Click Launcher
Simply double-click `run_app.bat` in this folder. It will start the server and open `http://localhost:5173/` in your browser.

### Option B: Terminal Command
```bash
npm install
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

---

## 🌟 Key Features & Tabs

### 1. 🎯 SupeRR Selection Panel (Landing Interface)
* **Live Roster Exploration:** Filter across 231 profiled players from the official 883-match tournament dataset (200,999 deliveries).
* **Role Toggles:** Batters, Bowlers, All-rounders.
* **Quick Presets:**
  - 🔥 Top Chasing Batters (Innings 2 HP Runs & SR)
  - 🛡️ Top Defending Bowlers (Suppression > +2.5 rpo)
  - 🏆 Proven Winners (Match Win % ≥ 60%)
* **Player Cards:** Lightswind UI-styled cards featuring player rank, tactical role, Defending Suppression, Innings 2 Economy vs Target RRR, Chasing SR, and Off/Leg-side split previews.

### 2. 📊 Player Deep Dive (Interactive Charts & Wagon Wheel)
* **Off-side vs Leg-side (On-side) Run Percentage Pie Chart:**
  - Full breakdown of career runs scored through the off-side vs leg-side (on-side) with hover percentages.
* **Shot Type / Stroke Breakdown (Wagon Wheel Analysis):**
  - Horizontal bar chart tracking runs by stroke execution (Cover Drive, Pull shot, Flick, Square Cut, Ramp, Lofted Drive).
* **Pace vs Spin Breakdown:**
  - Strike rate and run distribution against express pace vs spin choke.
* **Innings 1 Setting vs Innings 2 Chasing High-Pressure Comparison:**
  - Strike rate and run shifts under fire.
* **Defending Suppression Margin:**
  - Target RRR Defended vs Actual 2nd Innings Economy.
* **Biomechanical Weapons & Tactical Archetype:**
  - Explanations of Bumrah's late release, Narine's seam concealment, Pathirana's sling angle, Miller's base stability, and Jurel's 360 ramps.

### 3. 📈 Multi-Player Comparisons (Bar Chart View)
* **Comparative Bar Chart Representation:**
  - Compare Defending Suppression Margins across all top bowlers (+7.28 Pathirana, +4.16 Axar, +4.15 Bumrah, +4.06 Arshdeep).
  - Compare 2nd Innings Chasing Strike Rates (199.4 Klaasen, 197.1 Rinku, 194.4 Tim David, 189.8 Shashank, 184.3 Tilak, 181.2 Jurel, 176.0 Miller).
  - Compare High-Pressure Match Win Rates % (Narine 83.3%, Varun 88.9%, Kuldeep 77.8%, Rashid 73.9%, Rinku 66.7%).
* **Custom Head-to-Head:** Select any 2 to 8 candidates to benchmark side-by-side.

### 4. 📑 Top 100 Excel Master Explorer
* Full interactive data table mirroring our master Excel workbook (`RR_SupeRR_Selector_Top100_Tactical_Master.xlsx`).
* Real-time search, sorting on any column, and role filters.
* **1-Click "Export to CSV" button** to download the complete 100-player dataset.

### 5. 📘 Methodology & Technical Definitions
* Clear breakdown of:
  - **Pressure Index ($PI_t \in [0.0, 1.0]$)** across all 5 dimensions.
  - **WIH (Wickets in Hand)**: Formula and tactical impact for batters and bowlers.
  - **Defending Suppression Margin**: Formula and why raw economy fails.
  - **The High Baseline Paradox**: Resolving flat deltas for Jasprit Bumrah and Sunil Narine.
  - Direct access link to the 5-page formal PDF report.

---

## 🎨 Theme & Styling
* **Primary Background:** Royal Deep Navy (`#050E1D`, `#0A192F`)
* **Signature Accent:** Rajasthan Royals Royal Pink (`#EB1485`)
* **Imperial Accent:** Championship Gold (`#D4AF37`)
* **Supporting Accents:** Royal Blue (`#1E3A8A`), Emerald Green (`#10B981`)
