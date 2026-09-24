from typing import List, Dict, Optional, Any
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
    wave_number: int = 1
    vehicles_count: int = 1
    ambulances_count: int = 0
    vulnerable_evacuees_count: int = 0
    fuel_liters_estimate: float = 0.0
    detour_hops: List[str] = []
    is_airlift_required: bool = False

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
    total_vehicles_mobilized: int = 0
    total_ambulances_mobilized: int = 0
    total_fuel_liters: float = 0.0
    isolated_habitations_count: int = 0
    average_transit_time_mins: float = 0.0

class XAIResponse(BaseModel):
    habitation_id: str
    habitation_name: str
    zone: str
    hazard_score: float
    factor_breakdown_percentages: Dict[str, float]
    plain_language_rationale: str
    mitigation_recommendation: str
    demographic_vulnerability_score: float = 0.0
    social_vulnerability_breakdown: Dict[str, float] = {}
    evacuation_wave_recommendation: str = "Wave 3: Standard Evacuation (6-12h)"
    cryptographic_audit_hash: Optional[str] = None

class CWCGaugeReading(BaseModel):
    station_id: str
    station_name: str
    river_basin: str
    current_water_level_m: float
    warning_level_m: float
    danger_level_m: float
    high_flood_level_m: float
    discharge_cusecs: float = 15000.0
    trend: str = "STEADY"  # RISING, STEADY, FALLING
    flood_status: str = "NORMAL"  # NORMAL, WARNING, DANGER, SEVERE_HFL_BREACH
    timestamp: Optional[str] = None

class IMDRainfallReading(BaseModel):
    station_id: str
    station_name: str
    rainfall_last_hour_mm: float
    rainfall_cumulative_24h_mm: float
    alert_level: str = "GREEN"  # GREEN, YELLOW, ORANGE, RED
    forecast_nowcast_text: str = "Normal monsoon activity"
    timestamp: Optional[str] = None

class GeoJSONHazardUploadPayload(BaseModel):
    layer_name: str
    hazard_type: str = "FLASH_FLOOD"  # FLASH_FLOOD, LANDSLIDE_DEBRIS, DAM_BREACH, COASTAL_SURGE
    severity: str = "RED"  # RED, ORANGE
    geojson: Dict[str, Any]

class GenAIQueryRequest(BaseModel):
    query: str
    include_citations: bool = True
    incident_context: Optional[str] = None

class GenAIQueryResponse(BaseModel):
    answer: str
    confidence_score: float
    is_grounded: bool
    sources: List[Dict[str, Any]]
    model_used: str
    verification_status: str
    latency_ms: float

class OperationalOrderResponse(BaseModel):
    op_ord_id: str
    authority: str
    timestamp: str
    verification_status: str
    order_content_markdown: str
    total_convoys: int
    total_citizens_evacuated: int
    total_vehicles: int
    total_ambulances: int
    airlift_missions_count: int

class OperationalOrderSignOffPayload(BaseModel):
    op_ord_id: str
    sign_off_officer: str = "District Magistrate / Incident Commander"
    designation: str = "Chairman, District Disaster Management Authority"
    comments: Optional[str] = "Approved for tactical execution."


