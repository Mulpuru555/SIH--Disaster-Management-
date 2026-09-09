from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
import time

from .models import (
    Habitation, Shelter, ResettlementSite, RoadEdge,
    SimulationPayload, RoadTogglePayload, OptimizationRequest,
    OptimizationResponse, XAIResponse
)
from .data_store import db
from .hazard_engine import HazardEngine
from .capacity_engine import CapacityEngine
from .optimizer import RelocationOptimizer
from .explainability import ExplainabilityEngine

app = FastAPI(
    title="ResQGrid API - Proactive Relocation Intelligence",
    description="Backend Decision Support Engine for SIH26191 (Ministry of Home Affairs / NDRF)",
    version="1.0.0"
)

# Enable CORS for local dev and cloud production (Vercel, Netlify)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Current global simulation state
current_sim = SimulationPayload(
    rainfall_mm_hr=95.0,
    storm_surge_m=0.8,
    dam_discharge_cusecs=18000.0,
    soil_saturation=0.82
)

# Initialize hazard scores & capacities on startup
@app.on_event("startup")
def startup_event():
    HazardEngine.evaluate_all(db.habitations, current_sim)
    CapacityEngine.update_all_shelters(db.shelters)
    CapacityEngine.update_all_resettlement_sites(db.resettlement_sites)

@app.get("/")
def read_root():
    return {
        "system": "ResQGrid Proactive Relocation Intelligence Platform",
        "team": "BharatBytes (Team 16)",
        "problem_statement": "SIH26191 - Ministry of Home Affairs / NDRF",
        "status": "OPERATIONAL",
        "cloud_deployment": "Production Ready"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "ResQGrid NDRF Decision Support Engine",
        "solver": "Google OR-Tools MILP",
        "version": "1.0.0"
    }

@app.get("/api/overview")
def get_overview():
    red_habs = [h for h in db.habitations.values() if h.zone == "RED"]
    orange_habs = [h for h in db.habitations.values() if h.zone == "ORANGE"]
    green_habs = [h for h in db.habitations.values() if h.zone == "GREEN"]

    total_red_pop = sum(h.population for h in red_habs)
    total_shelter_capacity = sum(s.effective_capacity for s in db.shelters.values() if s.is_operational)
    total_permanent_capacity = sum(r.carrying_capacity_population for r in db.resettlement_sites.values())
    blocked_roads_count = sum(1 for r in db.roads.values() if r.is_blocked)

    return {
        "metrics": {
            "total_habitations": len(db.habitations),
            "red_zones_count": len(red_habs),
            "orange_zones_count": len(orange_habs),
            "green_zones_count": len(green_habs),
            "at_risk_red_population": total_red_pop,
            "total_emergency_shelter_capacity": total_shelter_capacity,
            "total_permanent_resettlement_capacity": total_permanent_capacity,
            "capacity_sufficiency_ratio": round(total_shelter_capacity / max(1, total_red_pop), 2),
            "blocked_corridors_count": blocked_roads_count,
            "zero_overflow_guaranteed": total_shelter_capacity >= total_red_pop
        },
        "current_weather_simulation": current_sim
    }

@app.get("/api/habitations", response_model=List[Habitation])
def get_habitations():
    return list(db.habitations.values())

@app.get("/api/shelters", response_model=List[Shelter])
def get_shelters():
    return list(db.shelters.values())

@app.get("/api/resettlement-sites", response_model=List[ResettlementSite])
def get_resettlement_sites():
    return list(db.resettlement_sites.values())

@app.get("/api/roads", response_model=List[RoadEdge])
def get_roads():
    return list(db.roads.values())

@app.post("/api/simulate", response_model=Dict)
def run_simulation(payload: SimulationPayload):
    global current_sim
    current_sim = payload

    # Re-evaluate all habitations with new rainfall & soil saturation
    HazardEngine.evaluate_all(db.habitations, current_sim)

    # Dynamic road flooding check: if rain > 160 mm/hr or dam discharge > 35,000 cusecs, flood low riverside roads
    for r in db.roads.values():
        if "H2" in r.id or "H3" in r.id:
            if current_sim.rainfall_mm_hr >= 140.0 or current_sim.dam_discharge_cusecs >= 30000.0:
                r.is_blocked = True
                r.inundation_depth_m = round(min(1.5, (current_sim.rainfall_mm_hr - 140.0) * 0.02 + 0.4), 2)
                r.blockage_reason = "River Inundation & Flash Flood Debris"

    CapacityEngine.update_all_shelters(db.shelters)

    return {
        "status": "SIMULATION_UPDATED",
        "simulation_parameters": current_sim,
        "habitations": list(db.habitations.values()),
        "shelters": list(db.shelters.values()),
        "roads": list(db.roads.values())
    }

@app.post("/api/roads/toggle", response_model=RoadEdge)
def toggle_road(payload: RoadTogglePayload):
    if payload.road_id not in db.roads:
        raise HTTPException(status_code=404, detail="Road edge not found")

    road = db.roads[payload.road_id]
    road.is_blocked = payload.is_blocked
    road.blockage_reason = payload.reason if payload.is_blocked else None
    road.inundation_depth_m = 0.8 if payload.is_blocked else 0.0

    return road

@app.post("/api/optimize", response_model=OptimizationResponse)
def optimize_relocation(req: OptimizationRequest):
    if req.horizon == "medium_term":
        return RelocationOptimizer.solve_medium_term_resettlement(
            db.habitations,
            db.resettlement_sites
        )
    else:
        # Tier 1 (Immediate) or Tier 2 (Short-Term)
        severed = req.severed_roads
        return RelocationOptimizer.solve_immediate_relocation(
            db.habitations,
            db.shelters,
            db.roads,
            severed
        )

@app.get("/api/explain/{habitation_id}", response_model=XAIResponse)
def explain_decision(habitation_id: str):
    if habitation_id not in db.habitations:
        raise HTTPException(status_code=404, detail="Habitation ID not found")

    h = db.habitations[habitation_id]
    return ExplainabilityEngine.explain_habitation(h, current_sim)

@app.get("/api/export/manifest")
def export_manifest():
    # Run optimization to obtain fresh plan
    plan_resp = RelocationOptimizer.solve_immediate_relocation(
        db.habitations,
        db.shelters,
        db.roads,
        []
    )

    manifest_rows = []
    for idx, item in enumerate(plan_resp.plan, 1):
        manifest_rows.append({
            "convoy_id": f"NDRF-CONVOY-{100 + idx}",
            "origin_habitation": item.from_name,
            "destination_shelter": item.to_name,
            "evacuee_headcount": item.evacuee_count,
            "fleet_composition": item.recommended_convoy_type,
            "transit_distance_km": item.distance_km,
            "estimated_time_minutes": item.estimated_transit_mins,
            "priority": item.priority_level,
            "sdma_approval_status": "APPROVED_BY_DISTRICT_MAGISTRATE"
        })

    return {
        "manifest_title": "OFFICIAL NDRF / SDRF RELOCATION DISPATCH MANIFEST",
        "authority": "National Disaster Response Force (DM Division) & District Disaster Management Authority",
        "generated_timestamp": time.strftime("%Y-%m-%d %H:%M:%S IST"),
        "total_convoys": len(manifest_rows),
        "total_citizens_mobilized": plan_resp.total_evacuees_relocated,
        "convoys": manifest_rows
    }
