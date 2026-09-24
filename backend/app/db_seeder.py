from datetime import datetime
from sqlalchemy.orm import Session
from .db_models import (
    HabitationORM, ShelterORM, ResettlementSiteORM, RoadEdgeORM,
    AuditLogORM, CWCGaugeReadingORM, IMDRainfallReadingORM
)

def seed_initial_data_if_needed(session: Session) -> bool:
    """
    Checks if the database tables are populated.
    If empty, seeds the official Wayanad/Western Ghats testbed dataset
    with full spatial coordinates, demographic counts, resources, and topology.
    Returns True if seeded, False if already populated.
    """
    existing_count = session.query(HabitationORM).count()
    if existing_count > 0:
        return False

    # 1. Habitations
    habitations = [
        HabitationORM(
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
            historical_disaster_count=4,
            hazard_score=0.78,
            factor_of_safety=1.05,
            zone="RED",
            sovi_score=0.82,
            priority_score=0.88
        ),
        HabitationORM(
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
            historical_disaster_count=5,
            hazard_score=0.92,
            factor_of_safety=0.88,
            zone="RED",
            sovi_score=0.89,
            priority_score=0.96
        ),
        HabitationORM(
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
            historical_disaster_count=6,
            hazard_score=0.95,
            factor_of_safety=0.79,
            zone="RED",
            sovi_score=0.91,
            priority_score=0.98
        ),
        HabitationORM(
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
            historical_disaster_count=3,
            hazard_score=0.74,
            factor_of_safety=1.12,
            zone="ORANGE",
            sovi_score=0.75,
            priority_score=0.76
        ),
        HabitationORM(
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
            historical_disaster_count=2,
            hazard_score=0.55,
            factor_of_safety=1.35,
            zone="ORANGE",
            sovi_score=0.62,
            priority_score=0.58
        ),
        HabitationORM(
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
            historical_disaster_count=1,
            hazard_score=0.38,
            factor_of_safety=1.55,
            zone="GREEN",
            sovi_score=0.45,
            priority_score=0.39
        ),
        HabitationORM(
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
            historical_disaster_count=1,
            hazard_score=0.29,
            factor_of_safety=1.80,
            zone="GREEN",
            sovi_score=0.38,
            priority_score=0.31
        ),
        HabitationORM(
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
            historical_disaster_count=3,
            hazard_score=0.68,
            factor_of_safety=1.20,
            zone="ORANGE",
            sovi_score=0.68,
            priority_score=0.70
        ),
        HabitationORM(
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
            historical_disaster_count=1,
            hazard_score=0.25,
            factor_of_safety=1.95,
            zone="GREEN",
            sovi_score=0.34,
            priority_score=0.28
        ),
        HabitationORM(
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
            historical_disaster_count=4,
            hazard_score=0.62,
            factor_of_safety=1.28,
            zone="ORANGE",
            sovi_score=0.71,
            priority_score=0.65
        )
    ]
    session.add_all(habitations)

    # 2. Shelters
    shelters = [
        ShelterORM(
            id="S1",
            name="Kalpetta District Multi-Purpose Hall",
            lat=11.6140,
            lng=76.0890,
            usable_area_sqm=5600.0,
            beds=1600,
            water_liters=120000.0,
            ration_packets=8500,
            toilets_count=85,
            medical_staff_count=35,
            effective_capacity=1600,
            current_occupancy=0,
            bottleneck_resource="Beds",
            resource_limits={"usable_area": 1600, "beds": 1600, "water": 1600, "rations": 1700, "toilets": 1700},
            is_operational=True
        ),
        ShelterORM(
            id="S2",
            name="Sulthan Bathery Indoor Stadium Camp",
            lat=11.6620,
            lng=76.2580,
            usable_area_sqm=8200.0,
            beds=2300,
            water_liters=175000.0,
            ration_packets=12000,
            toilets_count=110,
            medical_staff_count=48,
            effective_capacity=2200,
            current_occupancy=0,
            bottleneck_resource="Toilets",
            resource_limits={"usable_area": 2342, "beds": 2300, "water": 2333, "rations": 2400, "toilets": 2200},
            is_operational=True
        ),
        ShelterORM(
            id="S3",
            name="Mananthavady St. Joseph Complex",
            lat=11.8020,
            lng=76.0020,
            usable_area_sqm=4500.0,
            beds=1250,
            water_liters=95000.0,
            ration_packets=6500,
            toilets_count=65,
            medical_staff_count=26,
            effective_capacity=1250,
            current_occupancy=0,
            bottleneck_resource="Beds",
            resource_limits={"usable_area": 1285, "beds": 1250, "water": 1266, "rations": 1300, "toilets": 1300},
            is_operational=True
        ),
        ShelterORM(
            id="S4",
            name="Kozhikode Gateway Transit Shelter",
            lat=11.4850,
            lng=75.9850,
            usable_area_sqm=7000.0,
            beds=2000,
            water_liters=150000.0,
            ration_packets=10500,
            toilets_count=100,
            medical_staff_count=40,
            effective_capacity=2000,
            current_occupancy=0,
            bottleneck_resource="Beds",
            resource_limits={"usable_area": 2000, "beds": 2000, "water": 2000, "rations": 2100, "toilets": 2000},
            is_operational=True
        ),
        ShelterORM(
            id="S5",
            name="Ambalavayal Agriculture Research Camp",
            lat=11.6180,
            lng=76.2150,
            usable_area_sqm=3600.0,
            beds=1000,
            water_liters=80000.0,
            ration_packets=5200,
            toilets_count=52,
            medical_staff_count=20,
            effective_capacity=1000,
            current_occupancy=0,
            bottleneck_resource="Beds",
            resource_limits={"usable_area": 1028, "beds": 1000, "water": 1066, "rations": 1040, "toilets": 1040},
            is_operational=True
        ),
        ShelterORM(
            id="S6",
            name="Panamaram Community Health Shelter",
            lat=11.7450,
            lng=76.0750,
            usable_area_sqm=4200.0,
            beds=1150,
            water_liters=90000.0,
            ration_packets=6000,
            toilets_count=60,
            medical_staff_count=24,
            effective_capacity=1150,
            current_occupancy=0,
            bottleneck_resource="Beds",
            resource_limits={"usable_area": 1200, "beds": 1150, "water": 1200, "rations": 1200, "toilets": 1200},
            is_operational=True
        )
    ]
    session.add_all(shelters)

    # 3. Resettlement Sites
    resettlement_sites = [
        ResettlementSiteORM(
            id="RS1",
            name="Kaniyambetta Safe Plateau Township",
            lat=11.6850,
            lng=76.1240,
            available_land_sqm=350000.0,
            slope_degrees=5.2,
            ground_water_depth_m=8.5,
            distance_to_highway_km=1.2,
            carrying_capacity_population=4500,
            suitability_score=94.5,
            is_hazard_free=True
        ),
        ResettlementSiteORM(
            id="RS2",
            name="Kenichira High-Tableland Resettlement Park",
            lat=11.7120,
            lng=76.2050,
            available_land_sqm=280000.0,
            slope_degrees=6.8,
            ground_water_depth_m=11.0,
            distance_to_highway_km=2.4,
            carrying_capacity_population=3600,
            suitability_score=91.0,
            is_hazard_free=True
        ),
        ResettlementSiteORM(
            id="RS3",
            name="Muttil Stable Ridge Colony",
            lat=11.6420,
            lng=76.1320,
            available_land_sqm=220000.0,
            slope_degrees=7.5,
            ground_water_depth_m=9.2,
            distance_to_highway_km=0.8,
            carrying_capacity_population=2800,
            suitability_score=88.5,
            is_hazard_free=True
        )
    ]
    session.add_all(resettlement_sites)

    # 4. Road Edges
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
        ("H1", "RS1", 16.2),
        ("H2", "RS1", 17.8),
        ("H3", "RS1", 19.5),
        ("H4", "RS2", 22.0),
        ("H2", "RS3", 14.5),
        ("H3", "RS3", 16.0)
    ]

    road_edges = []
    for from_n, to_n, dist in edge_pairs:
        road_edges.append(
            RoadEdgeORM(
                id=f"R_{from_n}_{to_n}",
                from_node=from_n,
                to_node=to_n,
                distance_km=dist,
                is_blocked=False,
                inundation_depth_m=0.0,
                blockage_reason=None
            )
        )
    session.add_all(road_edges)

    # 5. Default CWC River Gauges
    cwc_gauges = [
        CWCGaugeReadingORM(
            station_id="CWC-KABINI-01",
            station_name="Muthanga Kabini River Basin Gauge",
            river_basin="Kabini River (Cauvery Sub-basin)",
            current_water_level_m=642.80,
            warning_level_m=643.50,
            danger_level_m=644.20,
            high_flood_level_m=645.10,
            discharge_cusecs=18000.0,
            trend="RISING",
            flood_status="NORMAL",
            timestamp=datetime.utcnow()
        ),
        CWCGaugeReadingORM(
            station_id="CWC-CHALIYAR-02",
            station_name="Nilambur / Chaliyar Confluence Gauge",
            river_basin="Chaliyar River Basin",
            current_water_level_m=38.40,
            warning_level_m=39.50,
            danger_level_m=40.20,
            high_flood_level_m=41.50,
            discharge_cusecs=22000.0,
            trend="RISING",
            flood_status="NORMAL",
            timestamp=datetime.utcnow()
        )
    ]
    session.add_all(cwc_gauges)

    # 6. Default IMD Weather Stations
    imd_stations = [
        IMDRainfallReadingORM(
            station_id="IMD-MEPPADI-AWS",
            station_name="Meppadi Automated Weather Station",
            rainfall_last_hour_mm=95.0,
            rainfall_cumulative_24h_mm=260.4,
            alert_level="RED",
            forecast_nowcast_text="Extremely heavy precipitation ongoing. High threat of debris flows in Meppadi, Chooralmala & Mundakkai.",
            timestamp=datetime.utcnow()
        ),
        IMDRainfallReadingORM(
            station_id="IMD-VYTHIRI-AWS",
            station_name="Vythiri Ridge Weather Station",
            rainfall_last_hour_mm=62.0,
            rainfall_cumulative_24h_mm=175.0,
            alert_level="ORANGE",
            forecast_nowcast_text="Intense rainfall spell expected to continue for next 3 hours.",
            timestamp=datetime.utcnow()
        )
    ]
    session.add_all(imd_stations)

    # 7. Initial Audit Log
    initial_log = AuditLogORM(
        timestamp=datetime.utcnow(),
        event_type="DATABASE_INITIALIZED",
        actor_role="SYSTEM_AUTOMATION",
        details={
            "message": "ResQGrid Spatial Database initialized and seeded with Wayanad disaster testbed data.",
            "total_habitations": len(habitations),
            "total_shelters": len(shelters),
            "total_resettlement_sites": len(resettlement_sites),
            "total_road_edges": len(road_edges),
            "total_cwc_gauges": len(cwc_gauges),
            "total_imd_stations": len(imd_stations)
        },
        ip_address="127.0.0.1"
    )
    session.add(initial_log)

    session.commit()
    return True

