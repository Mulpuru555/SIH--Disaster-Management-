from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class Habitation(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    population: int
    elderly_count: int
    infant_count: int
    pwd_count: int
    kutcha_houses: int
    slope_degrees: float
    elevation_m: float
    river_distance_m: float
    coastal_distance_m: float
    historical_disaster_count: int
    hazard_score: float = 0.0
    factor_of_safety: float = 1.5
    zone: str = "GREEN"  # "RED", "ORANGE", "GREEN"
    sovi_score: float = 0.0
    priority_score: float = 0.0

class Shelter(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    usable_area_sqm: float
    beds: int
    water_liters: float
    ration_packets: int
    toilets_count: int
    medical_staff_count: int
    effective_capacity: int = 0
    current_occupancy: int = 0
    bottleneck_resource: str = "Beds"
    resource_limits: Dict[str, int] = {}
    is_operational: bool = True

class ResettlementSite(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    available_land_sqm: float
    slope_degrees: float
    ground_water_depth_m: float
    distance_to_highway_km: float
    carrying_capacity_population: int
    suitability_score: float  # 0 to 100
    is_hazard_free: bool = True

class RoadEdge(BaseModel):
    id: str
    from_node: str
    to_node: str
    distance_km: float
    is_blocked: bool = False
    inundation_depth_m: float = 0.0
    blockage_reason: Optional[str] = None

class SimulationPayload(BaseModel):
    rainfall_mm_hr: float = Field(default=85.0, ge=0.0, le=300.0)
    storm_surge_m: float = Field(default=0.5, ge=0.0, le=5.0)
    dam_discharge_cusecs: float = Field(default=15000.0, ge=0.0, le=100000.0)
    soil_saturation: float = Field(default=0.75, ge=0.0, le=1.0)

class RoadTogglePayload(BaseModel):
    road_id: str
    is_blocked: bool
    reason: Optional[str] = "Simulated Hazard Cutoff"

class OptimizationRequest(BaseModel):
    horizon: str = Field(default="immediate", description="immediate, short_term, medium_term")
    rainfall_mm_hr: float = 85.0
    soil_saturation: float = 0.75
    severed_roads: List[str] = []

class EvacuationPlanItem(BaseModel):
    from_id: str
    from_name: str
    to_id: str
    to_name: str
    evacuee_count: int
    distance_km: float
    estimated_transit_mins: int
    priority_level: str
    recommended_convoy_type: str
    corridor_route: List[List[float]] = []

class OptimizationResponse(BaseModel):
    status: str
    horizon: str
    total_evacuees_relocated: int
    total_red_zone_population: int
    shelter_overflow_count: int = 0
    overflow_percentage: float = 0.0
    active_corridors_count: int
    average_distance_km: float
    plan: List[EvacuationPlanItem]
    solver_runtime_ms: float
    message: str

class XAIResponse(BaseModel):
    habitation_id: str
    habitation_name: str
    zone: str
    hazard_score: float
    factor_breakdown_percentages: Dict[str, float]
    plain_language_rationale: str
    mitigation_recommendation: str
