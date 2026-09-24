from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from .models import (
    CWCGaugeReading, IMDRainfallReading, GeoJSONHazardUploadPayload,
    SimulationPayload
)
from .db_models import (
    CWCGaugeReadingORM, IMDRainfallReadingORM, HazardPolygonORM,
    HabitationORM, RoadEdgeORM
)
from .spatial_utils import point_in_polygon
from .hazard_engine import HazardEngine
from .capacity_engine import CapacityEngine

class IngestionEngine:
    """
    Real-Time Hydro-Meteorological & Spatial Ingestion Pipeline (SIH26191)
    - Central Water Commission (CWC) River Gauge Telemetry
    - India Meteorological Department (IMD) Rainfall & Nowcast Radar Feeds
    - GeoJSON Spatial Inundation & Debris Flow Polygon Ingestion
    """

    @staticmethod
    def process_cwc_gauge(
        reading: CWCGaugeReading,
        session: Session,
        db_store,
        current_sim: SimulationPayload
    ) -> Dict[str, Any]:
        # 1. Determine Flood Status against CWC thresholds
        if reading.current_water_level_m >= reading.high_flood_level_m:
            status = "SEVERE_HFL_BREACH"
        elif reading.current_water_level_m >= reading.danger_level_m:
            status = "DANGER"
        elif reading.current_water_level_m >= reading.warning_level_m:
            status = "WARNING"
        else:
            status = "NORMAL"

        reading.flood_status = status

        # 2. Update global hydro simulation discharge
        if reading.discharge_cusecs > 0:
            current_sim.dam_discharge_cusecs = reading.discharge_cusecs

        # 3. Dynamic Road Flooding for River Inundation
        inundated_roads = []
        if status in ["DANGER", "SEVERE_HFL_BREACH"]:
            excess_depth = round(max(0.4, (reading.current_water_level_m - reading.danger_level_m) + 0.3), 2)
            # Find riverside roads
            for r_id, r in db_store.roads.items():
                if "H2" in r_id or "H3" in r_id or "H10" in r_id:
                    db_store.sync_road_to_db(
                        session=session,
                        road_id=r_id,
                        is_blocked=True,
                        reason=f"CWC Alert: {reading.station_name} River Surge ({reading.current_water_level_m}m)",
                        inundation_depth=excess_depth
                    )
                    inundated_roads.append(r_id)

        # 4. Persist to DB
        orm_record = CWCGaugeReadingORM(
            station_id=reading.station_id,
            station_name=reading.station_name,
            river_basin=reading.river_basin,
            current_water_level_m=reading.current_water_level_m,
            warning_level_m=reading.warning_level_m,
            danger_level_m=reading.danger_level_m,
            high_flood_level_m=reading.high_flood_level_m,
            discharge_cusecs=reading.discharge_cusecs,
            trend=reading.trend,
            flood_status=status,
            timestamp=datetime.utcnow()
        )
        session.add(orm_record)

        # 5. Audit Logging
        db_store.record_audit_log(
            session=session,
            event_type="CWC_GAUGE_TELEMETRY_INGESTED",
            actor_role="CWC_SATELLITE_FEED",
            details={
                "station_id": reading.station_id,
                "current_level": reading.current_water_level_m,
                "flood_status": status,
                "discharge_cusecs": reading.discharge_cusecs,
                "inundated_corridors": inundated_roads
            }
        )

        return {
            "status": "CWC_INGESTION_SUCCESS",
            "station_id": reading.station_id,
            "flood_status": status,
            "discharge_cusecs": current_sim.dam_discharge_cusecs,
            "inundated_corridors_count": len(inundated_roads),
            "inundated_corridors": inundated_roads
        }

    @staticmethod
    def process_imd_rainfall(
        reading: IMDRainfallReading,
        session: Session,
        db_store,
        current_sim: SimulationPayload
    ) -> Dict[str, Any]:
        # 1. IMD Rainfall Classification
        # Light: < 15.6mm, Heavy: 64.5 - 115.5mm, Very Heavy: 115.6 - 204.4mm, Extremely Heavy: > 204.4mm
        if reading.rainfall_last_hour_mm >= 70.0 or reading.rainfall_cumulative_24h_mm >= 204.4:
            alert = "RED"
        elif reading.rainfall_last_hour_mm >= 35.0 or reading.rainfall_cumulative_24h_mm >= 115.6:
            alert = "ORANGE"
        elif reading.rainfall_last_hour_mm >= 15.0 or reading.rainfall_cumulative_24h_mm >= 64.5:
            alert = "YELLOW"
        else:
            alert = "GREEN"

        reading.alert_level = alert

        # 2. Update Hydro-Met Simulation State
        current_sim.rainfall_mm_hr = reading.rainfall_last_hour_mm
        # Empirical soil saturation response: S_soil = 0.40 + (cum_rain / 250)
        current_sim.soil_saturation = round(min(1.0, 0.40 + (reading.rainfall_cumulative_24h_mm / 250.0)), 3)

        # 3. Dynamic Multi-Hazard Recalculation across all habitations
        HazardEngine.evaluate_all(db_store.habitations, current_sim)
        CapacityEngine.update_all_shelters(db_store.shelters)

        # Sync updated hazard scores & zones to persistent DB
        for h_id, h in db_store.habitations.items():
            h_orm = session.query(HabitationORM).filter(HabitationORM.id == h_id).first()
            if h_orm:
                h_orm.hazard_score = h.hazard_score
                h_orm.factor_of_safety = h.factor_of_safety
                h_orm.zone = h.zone
                h_orm.priority_score = h.priority_score
        session.commit()

        # 4. Persist to DB
        orm_record = IMDRainfallReadingORM(
            station_id=reading.station_id,
            station_name=reading.station_name,
            rainfall_last_hour_mm=reading.rainfall_last_hour_mm,
            rainfall_cumulative_24h_mm=reading.rainfall_cumulative_24h_mm,
            alert_level=alert,
            forecast_nowcast_text=reading.forecast_nowcast_text,
            timestamp=datetime.utcnow()
        )
        session.add(orm_record)

        # 5. Audit Logging
        db_store.record_audit_log(
            session=session,
            event_type="IMD_RAINFALL_TELEMETRY_INGESTED",
            actor_role="IMD_RADAR_FEED",
            details={
                "station_id": reading.station_id,
                "hourly_mm": reading.rainfall_last_hour_mm,
                "cumulative_24h_mm": reading.rainfall_cumulative_24h_mm,
                "alert_level": alert,
                "computed_soil_saturation": current_sim.soil_saturation
            }
        )

        red_count = sum(1 for h in db_store.habitations.values() if h.zone == "RED")

        return {
            "status": "IMD_INGESTION_SUCCESS",
            "station_id": reading.station_id,
            "alert_level": alert,
            "soil_saturation": current_sim.soil_saturation,
            "active_red_zones_count": red_count,
            "nowcast": reading.forecast_nowcast_text
        }

    @staticmethod
    def process_geojson_polygon(
        payload: GeoJSONHazardUploadPayload,
        session: Session,
        db_store
    ) -> Dict[str, Any]:
        # 1. Extract polygon rings from GeoJSON
        rings: List[List[List[float]]] = []
        geojson = payload.geojson

        if geojson.get("type") == "Feature":
            geom = geojson.get("geometry", {})
            if geom.get("type") == "Polygon":
                rings.append(geom.get("coordinates", [[]])[0])
            elif geom.get("type") == "MultiPolygon":
                for poly in geom.get("coordinates", []):
                    if poly:
                        rings.append(poly[0])
        elif geojson.get("type") == "FeatureCollection":
            for feat in geojson.get("features", []):
                geom = feat.get("geometry", {})
                if geom.get("type") == "Polygon":
                    rings.append(geom.get("coordinates", [[]])[0])
                elif geom.get("type") == "MultiPolygon":
                    for poly in geom.get("coordinates", []):
                        if poly:
                            rings.append(poly[0])
        elif geojson.get("type") == "Polygon":
            rings.append(geojson.get("coordinates", [[]])[0])

        if not rings or not rings[0]:
            return {
                "status": "INVALID_GEOJSON_FORMAT",
                "message": "No valid Polygon coordinates found in payload."
            }

        affected_habs: List[str] = []
        affected_pop = 0

        # 2. Point-in-Polygon spatial query for each habitation
        for ring in rings:
            for h_id, h in db_store.habitations.items():
                if point_in_polygon(h.lat, h.lng, ring):
                    if h_id not in affected_habs:
                        affected_habs.append(h_id)
                        affected_pop += h.population
                        # Elevate zone
                        h.zone = payload.severity
                        h.hazard_score = max(h.hazard_score, 0.95 if payload.severity == "RED" else 0.75)
                        h.factor_of_safety = min(h.factor_of_safety, 0.82 if payload.severity == "RED" else 1.10)

                        h_orm = session.query(HabitationORM).filter(HabitationORM.id == h_id).first()
                        if h_orm:
                            h_orm.zone = h.zone
                            h_orm.hazard_score = h.hazard_score
                            h_orm.factor_of_safety = h.factor_of_safety

        # 3. Corridors intersecting with affected habitations
        affected_roads: List[str] = []
        for r_id, r in db_store.roads.items():
            if r.from_node in affected_habs or r.to_node in affected_habs:
                if not r.is_blocked:
                    db_store.sync_road_to_db(
                        session=session,
                        road_id=r_id,
                        is_blocked=True,
                        reason=f"GIS Layer Inundation: {payload.layer_name} ({payload.hazard_type})",
                        inundation_depth=0.9
                    )
                    affected_roads.append(r_id)

        session.commit()

        # 4. Persist Hazard Polygon record
        poly_record = HazardPolygonORM(
            layer_name=payload.layer_name,
            hazard_type=payload.hazard_type,
            severity=payload.severity,
            geojson_data=payload.geojson,
            intersecting_habitations_count=len(affected_habs),
            intersecting_roads_count=len(affected_roads),
            timestamp=datetime.utcnow()
        )
        session.add(poly_record)
        session.commit()

        # 5. Audit Logging
        db_store.record_audit_log(
            session=session,
            event_type="HAZARD_POLYGON_LAYER_INGESTED",
            actor_role="GIS_SURVEY_TEAM",
            details={
                "layer_name": payload.layer_name,
                "hazard_type": payload.hazard_type,
                "severity": payload.severity,
                "affected_habitations": affected_habs,
                "affected_population": affected_pop,
                "blocked_roads": affected_roads
            }
        )

        return {
            "status": "HAZARD_POLYGON_APPLIED",
            "layer_name": payload.layer_name,
            "severity": payload.severity,
            "affected_habitations_count": len(affected_habs),
            "affected_habitations": affected_habs,
            "affected_population": affected_pop,
            "blocked_corridors_count": len(affected_roads),
            "blocked_corridors": affected_roads
        }
