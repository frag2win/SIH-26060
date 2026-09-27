# PRITHVI-TWIN: MoES Antarctic Digital Twin Operations Command

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Engine-8e75ff?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Serverless_Edge-white?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Smart India Hackathon (SIH) Problem Statement:** `PS 26060`  
**Problem Title:** Digital Platform for efficient remote management of Indian Antarctic Research Stations  
**Target Organization:** Ministry of Earth Sciences (MoES) & National Centre for Polar and Ocean Research (NCPOR), Government of India  
**Stations Monitored:**
- **Bharati Station** (Larsemann Hills, East Antarctica: 69°24′28″S, 76°11′14″E)
- **Maitri Station** (Schirmacher Oasis, Queen Maud Land: 70°45′57″S, 11°44′09″E)

---

## ❄️ Executive Overview

Operating in sub **-50°C** katabatic blizzards with 6 months of polar darkness presents extreme mission-critical challenges. A 30-minute failure of power, trace heating, or snowmelt water production can lead to catastrophic life support failure.

**PRITHVI-TWIN** is a zero-latency, government-ready Network Operations Center (NOC) Digital Twin engineered for MoES leadership and polar station engineers. It provides:
1. **Unified Dual-Station Telemetry:** Instant, zero-reload state switching between Bharati and Maitri.
2. **Interactive 2D Architectural Digital Twin:** Top-down vector schematic with live pulsing sensor nodes, utility umbilicals, and deep click-to-diagnose modals.
3. **Gemini Autonomous Mission Overseer:** AI predictive failure forecasting, root-cause hypotheses, and automated SOP protocol generation before physical breakdowns occur.
4. **1-Click Autonomous Mitigation:** Remote actuator control that rebalances generator loads, purges waxing fuel lines, and restores safe operating envelopes.
5. **MoES Incident Audit Register:** Verifiable, exportable CSV compliance logging for government debriefs.

---

## 🏛️ Domain Architecture

The platform is organized into 6 specialized operational views:
- **Executive NOC Overview:** Real-time multi-metric master dashboard, crisis alert banners, and telemetry speeds (1x, 2x, 5x, pause).
- **Digital Twin Schematic:** Interactive 2D SVG architectural schematic with sub-component telemetry inspection and remote actuator overrides.
- **Energy & Microgrid Intelligence:** Multi-source generation mix (Diesel generators, Wind turbines, Solar PV, Battery bank), 24h demand curve, and 6-hour thermal load forecast model.
- **Polar Environmental Network:** 24h temperature curve (-45°C to -15°C), katabatic anemometer, auroral Kp-index space weather, and 4 transducer cluster health states.
- **Logistics & Survival Runway:** Multi-resource runways for Arctic Diesel (ATF-50), glacial snowmelt water, food rations, medical ICU stock, and expedition resupply voyage tracking (*MV Vasiliy Golovnin*).
- **AI Mission Overseer & Incident Audit:** Threat score gauge (0-100), tactical voice speech synthesis (Web Speech API), and downloadable `.csv` incident audit logs.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+` or `v10+` or `v11+`

### Installation & Local Run
```bash
# 1. Clone repository
git clone https://github.com/frag2win/SIH-26060.git
cd SIH-26060

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm run start
```

---

## ⚡ Deployment to Vercel

The application is completely optimized for Vercel Serverless Edge deployment without external database dependencies:

```bash
# Deploy with Vercel CLI
npx vercel deploy --prod
```

*(Optional: Configure `GEMINI_API_KEY` in Vercel Project Settings → Environment Variables to enable live Gemini AI queries).*

---

## 🏆 SIH PS 26060 Presentation Script (5-Minute Winning Pitch)

1. **Station Switch:** Toggle between **Maitri** and **Bharati** in the top bar to show instantaneous zero-reload switching.
2. **Inject Crisis:** Click **"Simulate Crisis"** in the top bar and choose **"Generator 1 Coolant Boiling & Cavitation"**:
   - The map pulses red on the Primary Power Generation Plant.
   - An audible tactical klaxon fires.
   - Coolant temperature jumps to `99.4°C` with vibration warnings.
3. **AI Threat Forecast:** Showcase the **Gemini Autonomous Mission Overseer** panel:
   - Threat Score: `94/100` (Critical).
   - Time-to-Impact: `42 Minutes` (before thermal circuit trip).
   - AI SOP: `PROTOCOL-BRAVO` (pre-lubricate Standby Gen 3 and transfer 45 kW bus load).
4. **Auto-Mitigate:** Click the **"1-Click Auto-Mitigate"** button:
   - Remote actuator command executes.
   - Load shifts to Generator 3; temperatures cool and normalize.
   - Confetti celebration and success chime play.
5. **Government Compliance Export:** Click **"Export Audit Trail"** to download the timestamped `.csv` incident report for Ministry officials.

---

## 📄 License
Developed for Smart India Hackathon (SIH) 2026 under the aegis of the Ministry of Earth Sciences (MoES), Government of India.
