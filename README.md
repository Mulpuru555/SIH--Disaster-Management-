# 🛡️ ResQGrid: AI-Powered Proactive Relocation Intelligence
**Team BharatBytes (Team 16) | Smart India Hackathon 2026**  
**Problem Statement ID:** `SIH26191`  
**Ministry of Home Affairs & National Disaster Response Force (NDRF, DM Division)**  
**Category:** Software | **Theme:** Disaster Management  

---

## 📌 Executive Summary
**ResQGrid** is an intelligent, GIS-enabled decision support platform developed for the **Ministry of Home Affairs & NDRF (DM Division)** to solve Problem Statement `SIH26191`. It replaces reactive, post-disaster evacuations with a **proactive, evidence-based relocation engine**:
1. **Dynamic Multi-Hazard Red-Zoning:** Real-time GeoAI fusion of digital elevation models (DEM), slope stability physics, live IMD rainfall forecasts, and 20-year disaster recurrence.
2. **Dual-Horizon Carrying Capacity Assessment:** Evaluates both temporary relief camps (minimum bottleneck of beds, drinking water $15L/\text{day}$, food rations, and sanitation) AND safer permanent resettlement land parcels outside hazard zones.
3. **3-Tier Relocation Engine:**
   - 🚨 **Immediate Relocation (0–48 Hours):** Google OR-Tools Mixed-Integer Linear Programming (MILP) calculates optimal convoy routes along safe roads with **0% shelter overflow**.
   - ⏳ **Short-Term Relocation (Seasonal/Pre-Monsoon):** Proactive staging for vulnerable habitations (high concentration of elderly, infants, PwD, and kutcha mud dwellings).
   - 🏡 **Medium-Term Relocation (Permanent):** Land suitability and carrying capacity mapping for permanent safe township rehabilitation.
4. **Explainable AI (XAI) for District Magistrates:** Transparent game-theoretic Shapley factor breakdowns ensuring legal compliance (Section 34, DM Act 2005).

---

## 🏗️ System Architecture & Tech Stack

```
                              ResQGrid Cloud Architecture
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         ▼                                                                   ▼
[ Cloud Frontend (Vercel) ]                                     [ Cloud Backend (Render) ]
• React.js + Vite + Leaflet                                      • FastAPI (Python 3.11)
• Dark-Mode Tactical GIS Map                                     • Google OR-Tools MILP Solver (<6ms)
• Live "What-If" Hazard Sliders                                  • GeoPandas & Shapely Spatial Pipeline
• 1-Click NDRF Convoy PDF & SMS                                  • Explainable AI (SHAP attributions)
```

---


## 💻 Local Quickstart (For Development)

### Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
* Interactive API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
* Tactical GIS Dashboard: [http://localhost:5173](http://localhost:5173)

---


**Team BharatBytes &bull; Vignan's Foundation for Science, Technology & Research &bull; SIH 2026**
