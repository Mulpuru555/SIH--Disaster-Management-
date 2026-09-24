import math
from typing import Dict, List
from .models import Habitation, Shelter, ResettlementSite, RoadEdge

class DataStore:
    def __init__(self):
        self.habitations: Dict[str, Habitation] = {}
        self.shelters: Dict[str, Shelter] = {}
        self.resettlement_sites: Dict[str, ResettlementSite] = {}
        self.roads: Dict[str, RoadEdge] = {}
        self.initialize_data()

    def initialize_data(self):
        # Realistic district testbed modeled on Wayanad / Western Ghats hill terrain (Lat ~11.6 to 11.8, Lng ~76.0 to 76.3)
        raw_habitations = [
            Habitation(
                id="H1",
                name="Meppadi Hill Hamlet",
                lat=11.5542,
                lng=76.1265,
                population=1200,
                elderly_count=210,
                infant_count=145,
                pwd_count=38,
                kutcha_houses=220,
                slope_degrees=38.5,
                elevation_m=920.0,
                river_distance_m=180.0,
                coastal_distance_m=62000.0,
                historical_disaster_count=4
            ),
            Habitation(
                id="H2",
                name="Chooralmala Valley Colony",
                lat=11.5410,
                lng=76.1550,
                population=1850,
                elderly_count=320,
                infant_count=210,
                pwd_count=65,
                kutcha_houses=410,
                slope_degrees=34.0,
                elevation_m=840.0,
                river_distance_m=60.0,
                coastal_distance_m=64000.0,
                historical_disaster_count=5
            ),
            Habitation(
                id="H3",
                name="Mundakkai Riverside Settlement",
                lat=11.5305,
                lng=76.1680,
                population=950,
                elderly_count=160,
                infant_count=90,
                pwd_count=29,
                kutcha_houses=190,
                slope_degrees=42.0,
                elevation_m=980.0,
                river_distance_m=45.0,
                coastal_distance_m=65000.0,
                historical_disaster_count=6
            ),
            Habitation(
                id="H4",
                name="Vellarmala Tea Plantation Ward",
                lat=11.5200,
                lng=76.1820,
                population=1400,
                elderly_count=240,
                infant_count=130,
                pwd_count=45,
                kutcha_houses=290,
                slope_degrees=36.0,
                elevation_m=1050.0,
                river_distance_m=320.0,
                coastal_distance_m=67000.0,
                historical_disaster_count=3
            ),
            Habitation(
                id="H5",
                name="Vythiri Ridge Village",
                lat=11.5520,
                lng=76.0420,
                population=1600,
                elderly_count=190,
                infant_count=150,
                pwd_count=30,
                kutcha_houses=150,
                slope_degrees=26.5,
                elevation_m=710.0,
                river_distance_m=450.0,
                coastal_distance_m=58000.0,
                historical_disaster_count=2
            ),
            Habitation(
                id="H6",
                name="Pozhuthana Watershed Cluster",
                lat=11.5850,
                lng=76.0120,
                population=1100,
                elderly_count=130,
                infant_count=110,
                pwd_count=22,
                kutcha_houses=120,
                slope_degrees=19.0,
                elevation_m=640.0,
                river_distance_m=550.0,
                coastal_distance_m=55000.0,
                historical_disaster_count=1
            ),
            Habitation(
                id="H7",
                name="Kalpetta Foothill Basti",
                lat=11.6080,
                lng=76.0820,
                population=2200,
                elderly_count=260,
                infant_count=200,
                pwd_count=40,
                kutcha_houses=180,
                slope_degrees=14.0,
                elevation_m=780.0,
                river_distance_m=800.0,
                coastal_distance_m=60000.0,
                historical_disaster_count=1
            ),
            Habitation(
                id="H8",
                name="Thariode Dam Downstream Zone",
                lat=11.6320,
                lng=75.9850,
                population=1350,
                elderly_count=170,
                infant_count=140,
                pwd_count=35,
                kutcha_houses=175,
                slope_degrees=21.0,
                elevation_m=690.0,
                river_distance_m=110.0,
                coastal_distance_m=52000.0,
                historical_disaster_count=3
            ),
            Habitation(
                id="H9",
                name="Padinjarathara Basin Habitation",
                lat=11.6650,
                lng=75.9520,
                population=1500,
                elderly_count=180,
                infant_count=160,
                pwd_count=28,
                kutcha_houses=140,
                slope_degrees=12.0,
                elevation_m=720.0,
                river_distance_m=950.0,
                coastal_distance_m=49000.0,
                historical_disaster_count=1
            ),
            Habitation(
                id="H10",
                name="Kavumannam Coastal Estuary Ward",
                lat=11.7100,
                lng=75.9100,
                population=1750,
                elderly_count=220,
                infant_count=190,
                pwd_count=44,
                kutcha_houses=310,
                slope_degrees=6.0,
                elevation_m=18.0,
                river_distance_m=120.0,
                coastal_distance_m=1800.0,
                historical_disaster_count=4
            )
        ]
        self.habitations = {h.id: h for h in raw_habitations}

        # Safe Emergency Relief Shelters located in low-hazard zones
        raw_shelters = [
            Shelter(
                id="S1",
                name="Kalpetta District Multi-Purpose Hall",
                lat=11.6140,
                lng=76.0890,
                usable_area_sqm=5600.0,
                beds=1600,
                water_liters=120000.0,  # 120,000 L / (15*5) = 1,600 people for 5 days
                ration_packets=8500,    # 8,500 / 5 = 1,700
                toilets_count=85,       # 85 * 20 = 1,700
                medical_staff_count=35
            ),
            Shelter(
                id="S2",
                name="Sulthan Bathery Indoor Stadium Camp",
                lat=11.6620,
                lng=76.2580,
                usable_area_sqm=8200.0,
                beds=2300,
                water_liters=175000.0,  # ~2,333
                ration_packets=12000,   # ~2,400
                toilets_count=110,      # 2,200
                medical_staff_count=48
            ),
            Shelter(
                id="S3",
                name="Mananthavady St. Joseph Complex",
                lat=11.8020,
                lng=76.0020,
                usable_area_sqm=4500.0,
                beds=1250,
                water_liters=95000.0,   # ~1,266
                ration_packets=6500,    # 1,300
                toilets_count=65,       # 1,300
                medical_staff_count=26
            ),
            Shelter(
                id="S4",
                name="Kozhikode Gateway Transit Shelter",
                lat=11.4850,
                lng=75.9850,
                usable_area_sqm=7000.0,
                beds=2000,
                water_liters=150000.0,  # 2,000
                ration_packets=10500,   # 2,100
                toilets_count=100,      # 2,000
                medical_staff_count=40
            ),
            Shelter(
                id="S5",
                name="Ambalavayal Agriculture Research Camp",
                lat=11.6180,
                lng=76.2150,
                usable_area_sqm=3600.0,
                beds=1000,
                water_liters=80000.0,   # ~1,066
                ration_packets=5200,    # 1,040
                toilets_count=52,       # 1,040
                medical_staff_count=20
            ),
            Shelter(
                id="S6",
                name="Panamaram Community Health Shelter",
                lat=11.7450,
                lng=76.0750,
                usable_area_sqm=4200.0,
                beds=1150,
                water_liters=90000.0,   # 1,200
                ration_packets=6000,    # 1,200
                toilets_count=60,       # 1,200
                medical_staff_count=24
            )
        ]
        self.shelters = {s.id: s for s in raw_shelters}

        # Safer Permanent Resettlement Sites outside Hazard Zones (Tier 3 - Medium-Term Relocation)
        raw_resettlement = [
            ResettlementSite(
                id="RS1",
                name="Kaniyambetta Safe Plateau Township",
                lat=11.6850,
                lng=76.1240,
                available_land_sqm=350000.0,  # 35 Hectares
                slope_degrees=5.2,
                ground_water_depth_m=8.5,
                distance_to_highway_km=1.2,
                carrying_capacity_population=4500,
                suitability_score=94.5,
                is_hazard_free=True
            ),
            ResettlementSite(
                id="RS2",
                name="Kenichira High-Tableland Resettlement Park",
                lat=11.7120,
                lng=76.2050,
                available_land_sqm=280000.0,  # 28 Hectares
                slope_degrees=6.8,
                ground_water_depth_m=11.0,
                distance_to_highway_km=2.4,
                carrying_capacity_population=3600,
                suitability_score=91.0,
                is_hazard_free=True
            ),
            ResettlementSite(
                id="RS3",
                name="Muttil Stable Ridge Colony",
                lat=11.6420,
                lng=76.1320,
                available_land_sqm=220000.0,  # 22 Hectares
                slope_degrees=7.5,
                ground_water_depth_m=9.2,
                distance_to_highway_km=0.8,
                carrying_capacity_population=2800,
                suitability_score=88.5,
                is_hazard_free=True
            )
        ]
        self.resettlement_sites = {r.id: r for r in raw_resettlement}

        # Road Network graph with real distances
        self.roads = self._generate_road_network()

    def _calculate_haversine_distance(self, lat1, lon1, lat2, lon2) -> float:
        R = 6371.0  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2.0) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon / 2.0) ** 2)
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        # Add road curvature factor (1.28x of straight line in hilly terrain)
        return round(R * c * 1.28, 2)

    def _generate_road_network(self) -> Dict[str, RoadEdge]:
        roads = {}
        # Predefined key critical corridors between habitations and shelters
        edge_pairs = [
            ("H1", "S1", 12.5),
            ("H1", "S4", 18.2),
            ("H1", "S5", 14.8),
            ("H2", "S1", 15.4),
            ("H2", "S2", 21.0),
            ("H2", "S5", 13.2),
            ("H3", "S1", 18.6),
            ("H3", "S2", 23.4),
            ("H3", "S5", 16.5),
            ("H4", "S2", 24.1),
            ("H4", "S5", 17.8),
            ("H4", "S1", 21.2),
            ("H5", "S1", 11.2),
            ("H5", "S4", 14.6),
            ("H6", "S1", 14.3),
            ("H6", "S4", 19.5),
            ("H6", "S3", 26.0),
            ("H7", "S1", 3.2),
            ("H7", "S5", 16.8),
            ("H7", "S6", 18.4),
            ("H8", "S1", 15.8),
            ("H8", "S6", 19.1),
            ("H8", "S3", 24.5),
            ("H9", "S6", 17.5),
            ("H9", "S3", 21.3),
            ("H10", "S4", 28.5),
            ("H10", "S3", 32.0),
            # Permanent resettlement links
            ("H1", "RS1", 16.2),
            ("H2", "RS1", 17.8),
            ("H3", "RS1", 19.5),
            ("H4", "RS2", 22.0),
            ("H2", "RS3", 14.5),
            ("H3", "RS3", 16.0)
        ]

        for from_n, to_n, dist in edge_pairs:
            road_id = f"R_{from_n}_{to_n}"
            roads[road_id] = RoadEdge(
                id=road_id,
                from_node=from_n,
                to_node=to_n,
                distance_km=dist,
                is_blocked=False,
                inundation_depth_m=0.0
            )
        return roads

    def load_from_database(self, session):
        """Loads cached in-memory state from the persistent SQLAlchemy spatial database."""
        from .db_models import HabitationORM, ShelterORM, ResettlementSiteORM, RoadEdgeORM
        habs = session.query(HabitationORM).all()
        if habs:
            self.habitations = {h.id: h.to_pydantic() for h in habs}

        shelters = session.query(ShelterORM).all()
        if shelters:
            self.shelters = {s.id: s.to_pydantic() for s in shelters}

        sites = session.query(ResettlementSiteORM).all()
        if sites:
            self.resettlement_sites = {r.id: r.to_pydantic() for r in sites}

        roads = session.query(RoadEdgeORM).all()
        if roads:
            self.roads = {r.id: r.to_pydantic() for r in roads}

    def sync_road_to_db(self, session, road_id: str, is_blocked: bool, reason: str = None, inundation_depth: float = 0.0):
        """Persists road blockage status into database and in-memory cache simultaneously."""
        from .db_models import RoadEdgeORM
        road_orm = session.query(RoadEdgeORM).filter(RoadEdgeORM.id == road_id).first()
        if road_orm:
            road_orm.is_blocked = is_blocked
            road_orm.blockage_reason = reason
            road_orm.inundation_depth_m = inundation_depth
            session.commit()
        if road_id in self.roads:
            self.roads[road_id].is_blocked = is_blocked
            self.roads[road_id].blockage_reason = reason
            self.roads[road_id].inundation_depth_m = inundation_depth

    def record_audit_log(self, session, event_type: str, actor_role: str = "NDRF_INCIDENT_COMMANDER", details: dict = None, ip_address: str = None):
        """Records an immutable, cryptographically chained audit event in the database."""
        from .db_models import AuditLogORM, compute_audit_hash, GENESIS_HASH
        from datetime import datetime

        if session is None:
            return {
                "id": 0,
                "timestamp": datetime.utcnow().isoformat(),
                "event_type": event_type,
                "actor_role": actor_role,
                "details": details or {},
                "ip_address": ip_address,
                "prev_hash": GENESIS_HASH,
                "record_hash": "IN_MEMORY_SIMULATION"
            }

        # Query the latest record to link prev_hash
        last_log = session.query(AuditLogORM).order_by(AuditLogORM.id.desc()).first()
        prev_hash = last_log.record_hash if (last_log and last_log.record_hash) else GENESIS_HASH

        now = datetime.utcnow()
        log = AuditLogORM(
            timestamp=now,
            event_type=event_type,
            actor_role=actor_role,
            details=details or {},
            ip_address=ip_address,
            prev_hash=prev_hash,
            record_hash="PENDING"
        )
        session.add(log)
        session.flush()

        # Compute tamper-evident SHA-256 hash
        log.record_hash = compute_audit_hash(
            id_val=log.id,
            timestamp_iso=log.timestamp.isoformat(),
            event_type=log.event_type,
            actor_role=log.actor_role,
            details=log.details,
            ip_address=log.ip_address,
            prev_hash=log.prev_hash
        )
        session.commit()
        return log.to_dict()

    def record_dispatch(self, session, convoy_data: dict, approved_by: str = "District Collector"):
        """Persists an official evacuation convoy dispatch into the database."""
        from .db_models import EvacuationDispatchORM
        from datetime import datetime
        dispatch = EvacuationDispatchORM(
            convoy_id=convoy_data.get("convoy_id"),
            origin_id=convoy_data.get("origin_id", ""),
            origin_name=convoy_data.get("origin_habitation", ""),
            destination_id=convoy_data.get("destination_id", ""),
            destination_name=convoy_data.get("destination_shelter", ""),
            evacuee_headcount=convoy_data.get("evacuee_headcount", 0),
            distance_km=convoy_data.get("transit_distance_km", 0.0),
            estimated_transit_mins=convoy_data.get("estimated_time_minutes", 0),
            priority_level=convoy_data.get("priority", "P1_CRITICAL"),
            recommended_convoy_type=convoy_data.get("fleet_composition", "50-Seater NDRF Buses"),
            dispatch_status="APPROVED_BY_DISTRICT_MAGISTRATE",
            approved_by=approved_by,
            timestamp=datetime.utcnow()
        )
        session.add(dispatch)
        session.commit()
        return dispatch.to_dict()

# Singleton instance for the backend
db = DataStore()

