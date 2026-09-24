import hashlib
import json
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, JSON, Text
)
from .database import Base
from .models import Habitation, Shelter, ResettlementSite, RoadEdge
from .spatial_utils import point_to_geojson_feature, linestring_to_geojson_feature

class HabitationORM(Base):
    __tablename__ = "habitations"

    id = Column(String(32), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    population = Column(Integer, default=0)
    elderly_count = Column(Integer, default=0)
    infant_count = Column(Integer, default=0)
    pwd_count = Column(Integer, default=0)
    kutcha_houses = Column(Integer, default=0)
    slope_degrees = Column(Float, default=0.0)
    elevation_m = Column(Float, default=0.0)
    river_distance_m = Column(Float, default=0.0)
    coastal_distance_m = Column(Float, default=0.0)
    historical_disaster_count = Column(Integer, default=0)
    hazard_score = Column(Float, default=0.0)
    factor_of_safety = Column(Float, default=1.5)
    zone = Column(String(16), default="GREEN")  # RED, ORANGE, GREEN
    sovi_score = Column(Float, default=0.0)
    priority_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_pydantic(self) -> Habitation:
        return Habitation(
            id=self.id,
            name=self.name,
            lat=self.lat,
            lng=self.lng,
            population=self.population,
            elderly_count=self.elderly_count,
            infant_count=self.infant_count,
            pwd_count=self.pwd_count,
            kutcha_houses=self.kutcha_houses,
            slope_degrees=self.slope_degrees,
            elevation_m=self.elevation_m,
            river_distance_m=self.river_distance_m,
            coastal_distance_m=self.coastal_distance_m,
            historical_disaster_count=self.historical_disaster_count,
            hazard_score=self.hazard_score,
            factor_of_safety=self.factor_of_safety,
            zone=self.zone,
            sovi_score=self.sovi_score,
            priority_score=self.priority_score
        )

    def to_geojson_feature(self) -> Dict[str, Any]:
        return point_to_geojson_feature(
            id_=self.id,
            lat=self.lat,
            lng=self.lng,
            properties={
                "id": self.id,
                "name": self.name,
                "type": "habitation",
                "population": self.population,
                "zone": self.zone,
                "hazard_score": self.hazard_score,
                "factor_of_safety": self.factor_of_safety,
                "sovi_score": self.sovi_score,
                "priority_score": self.priority_score,
                "slope_degrees": self.slope_degrees,
                "elevation_m": self.elevation_m,
                "river_distance_m": self.river_distance_m,
                "elderly_count": self.elderly_count,
                "infant_count": self.infant_count,
                "pwd_count": self.pwd_count,
                "kutcha_houses": self.kutcha_houses
            }
        )

class ShelterORM(Base):
    __tablename__ = "shelters"

    id = Column(String(32), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    usable_area_sqm = Column(Float, default=0.0)
    beds = Column(Integer, default=0)
    water_liters = Column(Float, default=0.0)
    ration_packets = Column(Integer, default=0)
    toilets_count = Column(Integer, default=0)
    medical_staff_count = Column(Integer, default=0)
    effective_capacity = Column(Integer, default=0)
    current_occupancy = Column(Integer, default=0)
    bottleneck_resource = Column(String(64), default="Beds")
    resource_limits = Column(JSON, default=dict)
    is_operational = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_pydantic(self) -> Shelter:
        return Shelter(
            id=self.id,
            name=self.name,
            lat=self.lat,
            lng=self.lng,
            usable_area_sqm=self.usable_area_sqm,
            beds=self.beds,
            water_liters=self.water_liters,
            ration_packets=self.ration_packets,
            toilets_count=self.toilets_count,
            medical_staff_count=self.medical_staff_count,
            effective_capacity=self.effective_capacity,
            current_occupancy=self.current_occupancy,
            bottleneck_resource=self.bottleneck_resource,
            resource_limits=self.resource_limits or {},
            is_operational=self.is_operational
        )

    def to_geojson_feature(self) -> Dict[str, Any]:
        return point_to_geojson_feature(
            id_=self.id,
            lat=self.lat,
            lng=self.lng,
            properties={
                "id": self.id,
                "name": self.name,
                "type": "shelter",
                "usable_area_sqm": self.usable_area_sqm,
                "beds": self.beds,
                "water_liters": self.water_liters,
                "ration_packets": self.ration_packets,
                "toilets_count": self.toilets_count,
                "medical_staff_count": self.medical_staff_count,
                "effective_capacity": self.effective_capacity,
                "current_occupancy": self.current_occupancy,
                "bottleneck_resource": self.bottleneck_resource,
                "is_operational": self.is_operational
            }
        )

class ResettlementSiteORM(Base):
    __tablename__ = "resettlement_sites"

    id = Column(String(32), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    available_land_sqm = Column(Float, default=0.0)
    slope_degrees = Column(Float, default=0.0)
    ground_water_depth_m = Column(Float, default=0.0)
    distance_to_highway_km = Column(Float, default=0.0)
    carrying_capacity_population = Column(Integer, default=0)
    suitability_score = Column(Float, default=0.0)
    is_hazard_free = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_pydantic(self) -> ResettlementSite:
        return ResettlementSite(
            id=self.id,
            name=self.name,
            lat=self.lat,
            lng=self.lng,
            available_land_sqm=self.available_land_sqm,
            slope_degrees=self.slope_degrees,
            ground_water_depth_m=self.ground_water_depth_m,
            distance_to_highway_km=self.distance_to_highway_km,
            carrying_capacity_population=self.carrying_capacity_population,
            suitability_score=self.suitability_score,
            is_hazard_free=self.is_hazard_free
        )

    def to_geojson_feature(self) -> Dict[str, Any]:
        return point_to_geojson_feature(
            id_=self.id,
            lat=self.lat,
            lng=self.lng,
            properties={
                "id": self.id,
                "name": self.name,
                "type": "resettlement_site",
                "available_land_sqm": self.available_land_sqm,
                "slope_degrees": self.slope_degrees,
                "ground_water_depth_m": self.ground_water_depth_m,
                "distance_to_highway_km": self.distance_to_highway_km,
                "carrying_capacity_population": self.carrying_capacity_population,
                "suitability_score": self.suitability_score,
                "is_hazard_free": self.is_hazard_free
            }
        )

class RoadEdgeORM(Base):
    __tablename__ = "road_edges"

    id = Column(String(64), primary_key=True, index=True)
    from_node = Column(String(32), nullable=False, index=True)
    to_node = Column(String(32), nullable=False, index=True)
    distance_km = Column(Float, default=0.0)
    is_blocked = Column(Boolean, default=False)
    inundation_depth_m = Column(Float, default=0.0)
    blockage_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_pydantic(self) -> RoadEdge:
        return RoadEdge(
            id=self.id,
            from_node=self.from_node,
            to_node=self.to_node,
            distance_km=self.distance_km,
            is_blocked=self.is_blocked,
            inundation_depth_m=self.inundation_depth_m,
            blockage_reason=self.blockage_reason
        )

    def to_geojson_feature(self, node_coords_map: Optional[Dict[str, list]] = None) -> Dict[str, Any]:
        coords = []
        if node_coords_map:
            p1 = node_coords_map.get(self.from_node)
            p2 = node_coords_map.get(self.to_node)
            if p1 and p2:
                # [lon, lat] order
                coords = [[p1[1], p1[0]], [p2[1], p2[0]]]
        return linestring_to_geojson_feature(
            id_=self.id,
            coords=coords,
            properties={
                "id": self.id,
                "from_node": self.from_node,
                "to_node": self.to_node,
                "distance_km": self.distance_km,
                "is_blocked": self.is_blocked,
                "inundation_depth_m": self.inundation_depth_m,
                "blockage_reason": self.blockage_reason
            }
        )

class EvacuationDispatchORM(Base):
    __tablename__ = "evacuation_dispatches"

    id = Column(Integer, primary_key=True, autoincrement=True)
    convoy_id = Column(String(64), unique=True, index=True, nullable=False)
    origin_id = Column(String(32), nullable=False)
    origin_name = Column(String(255), nullable=False)
    destination_id = Column(String(32), nullable=False)
    destination_name = Column(String(255), nullable=False)
    evacuee_headcount = Column(Integer, nullable=False)
    distance_km = Column(Float, default=0.0)
    estimated_transit_mins = Column(Integer, default=0)
    priority_level = Column(String(32), default="P1_CRITICAL")
    recommended_convoy_type = Column(String(128), default="50-Seater NDRF Buses")
    dispatch_status = Column(String(32), default="APPROVED_BY_DISTRICT_MAGISTRATE")
    approved_by = Column(String(128), default="District Collector & DDMA Chairman")
    timestamp = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "convoy_id": self.convoy_id,
            "origin_habitation": self.origin_name,
            "origin_id": self.origin_id,
            "destination_shelter": self.destination_name,
            "destination_id": self.destination_id,
            "evacuee_headcount": self.evacuee_headcount,
            "fleet_composition": self.recommended_convoy_type,
            "transit_distance_km": self.distance_km,
            "estimated_time_minutes": self.estimated_transit_mins,
            "priority": self.priority_level,
            "dispatch_status": self.dispatch_status,
            "approved_by": self.approved_by,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }

GENESIS_HASH = "0" * 64

def compute_audit_hash(id_val: int, timestamp_iso: str, event_type: str, actor_role: str, details: Any, ip_address: Optional[str], prev_hash: str) -> str:
    """Computes a SHA-256 tamper-evident digest over an audit log row."""
    details_str = json.dumps(details or {}, sort_keys=True, separators=(',', ':'), default=str)
    raw = f"{id_val}|{timestamp_iso}|{event_type}|{actor_role}|{details_str}|{ip_address or ''}|{prev_hash}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

class AuditLogORM(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    event_type = Column(String(64), nullable=False, index=True)
    actor_role = Column(String(64), default="NDRF_INCIDENT_COMMANDER")
    details = Column(JSON, default=dict)
    ip_address = Column(String(64), nullable=True)
    prev_hash = Column(String(64), nullable=True)
    record_hash = Column(String(64), nullable=True)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "event_type": self.event_type,
            "actor_role": self.actor_role,
            "details": self.details,
            "ip_address": self.ip_address,
            "prev_hash": self.prev_hash,
            "record_hash": self.record_hash
        }

class CWCGaugeReadingORM(Base):
    __tablename__ = "cwc_gauge_readings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    station_id = Column(String(32), index=True, nullable=False)
    station_name = Column(String(255), nullable=False)
    river_basin = Column(String(128), nullable=False)
    current_water_level_m = Column(Float, nullable=False)
    warning_level_m = Column(Float, nullable=False)
    danger_level_m = Column(Float, nullable=False)
    high_flood_level_m = Column(Float, nullable=False)
    discharge_cusecs = Column(Float, default=15000.0)
    trend = Column(String(16), default="STEADY")
    flood_status = Column(String(32), default="NORMAL")
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_id": self.station_id,
            "station_name": self.station_name,
            "river_basin": self.river_basin,
            "current_water_level_m": self.current_water_level_m,
            "warning_level_m": self.warning_level_m,
            "danger_level_m": self.danger_level_m,
            "high_flood_level_m": self.high_flood_level_m,
            "discharge_cusecs": self.discharge_cusecs,
            "trend": self.trend,
            "flood_status": self.flood_status,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }

class IMDRainfallReadingORM(Base):
    __tablename__ = "imd_rainfall_readings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    station_id = Column(String(32), index=True, nullable=False)
    station_name = Column(String(255), nullable=False)
    rainfall_last_hour_mm = Column(Float, default=0.0)
    rainfall_cumulative_24h_mm = Column(Float, default=0.0)
    alert_level = Column(String(16), default="GREEN")
    forecast_nowcast_text = Column(Text, default="Normal monsoon activity")
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_id": self.station_id,
            "station_name": self.station_name,
            "rainfall_last_hour_mm": self.rainfall_last_hour_mm,
            "rainfall_cumulative_24h_mm": self.rainfall_cumulative_24h_mm,
            "alert_level": self.alert_level,
            "forecast_nowcast_text": self.forecast_nowcast_text,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }

class HazardPolygonORM(Base):
    __tablename__ = "hazard_polygons"

    id = Column(Integer, primary_key=True, autoincrement=True)
    layer_name = Column(String(255), nullable=False)
    hazard_type = Column(String(64), default="FLASH_FLOOD")
    severity = Column(String(16), default="RED")
    geojson_data = Column(JSON, nullable=False)
    intersecting_habitations_count = Column(Integer, default=0)
    intersecting_roads_count = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "layer_name": self.layer_name,
            "hazard_type": self.hazard_type,
            "severity": self.severity,
            "geojson_data": self.geojson_data,
            "intersecting_habitations_count": self.intersecting_habitations_count,
            "intersecting_roads_count": self.intersecting_roads_count,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }

