import math
from typing import Dict, List
from .models import Habitation, SimulationPayload

class HazardEngine:
    """
    GeoAI Multi-Hazard Red-Zoning Engine
    Compliant with MHA/NDRF Problem Statement SIH26191
    Incorporates:
      1. Slope gradient & Elevation (DEM)
      2. Antecedent & Real-time Precipitation Intensity
      3. Soil Moisture Saturation Level
      4. Coastal Storm Surge / River Inundation Proximity
      5. Historical Disaster Recurrence Frequency
    """

    @staticmethod
    def evaluate_habitation_hazard(h: Habitation, sim: SimulationPayload) -> Habitation:
        # 1. Slope Stability / Landslide Factor of Safety (FS)
        # Infinite slope physics approximation
        slope_rad = math.radians(h.slope_degrees)
        c_prime = 14.5  # Effective soil cohesion kPa
        gamma = 18.0    # Soil unit weight kN/m3
        gamma_w = 9.81  # Water unit weight kN/m3
        z = 2.2         # Soil thickness m
        phi_prime = math.radians(28.0) # Soil internal friction angle

        # Water table height rises with rainfall and soil saturation
        h_w = min(z, (sim.rainfall_mm_hr / 150.0) * z * sim.soil_saturation)

        numerator = c_prime + (gamma * z - gamma_w * h_w) * (math.cos(slope_rad) ** 2) * math.tan(phi_prime)
        denominator = gamma * z * math.sin(slope_rad) * math.cos(slope_rad) + 1e-4
        fs = round(numerator / denominator, 2)
        fs = max(0.1, fs)

        # 2. Dynamic Rainfall Trigger Ratio
        caine_threshold_mm_hr = 45.0  # Critical intensity threshold
        rain_ratio = min(2.0, sim.rainfall_mm_hr / caine_threshold_mm_hr)

        # 3. River & Coastal Inundation Risk
        river_risk = 0.0
        if h.river_distance_m < 400.0:
            river_prox = max(0.1, 1.0 - h.river_distance_m / 400.0)
            discharge_factor = min(2.0, sim.dam_discharge_cusecs / 25000.0)
            rain_factor = sim.rainfall_mm_hr / 120.0
            river_risk = min(1.0, 0.40 * river_prox + 0.40 * rain_factor + 0.20 * (discharge_factor * 0.6))

        coastal_risk = 0.0
        if h.coastal_distance_m < 5000.0 and h.elevation_m < 25.0:
            coastal_prox = max(0.1, 1.0 - h.coastal_distance_m / 5000.0)
            coastal_risk = min(1.0, 0.40 * coastal_prox + 0.40 * (sim.rainfall_mm_hr / 120.0) + 0.20 * (sim.storm_surge_m / 3.0))

        # 4. Historical Recurrence Factor
        history_factor = min(1.0, h.historical_disaster_count / 5.0)

        # 5. Composite Hazard Score H_i [0.0, 1.0]
        # Weighted multi-hazard formulation
        slope_weight = 0.38
        rain_weight = 0.28
        soil_weight = 0.14
        inundation_weight = 0.12
        history_weight = 0.08

        raw_score = (
            slope_weight * (1.0 / max(fs, 0.4)) * 0.45 +
            rain_weight * (rain_ratio * 0.5) +
            soil_weight * sim.soil_saturation +
            inundation_weight * max(river_risk, coastal_risk) +
            history_weight * history_factor
        )

        hazard_score = min(1.0, max(0.0, round(raw_score, 3)))

        # 6. Determine Red/Orange/Green Zone (Calibrated to NDMA / Geological Survey of India thresholds)
        is_river_breach = (h.river_distance_m <= 300.0 and (sim.rainfall_mm_hr >= 65.0 or sim.dam_discharge_cusecs >= 25000.0))
        is_slope_failure = (h.slope_degrees >= 20.0 and (fs < 1.25 or sim.rainfall_mm_hr >= 65.0))
        is_coastal_surge = (h.coastal_distance_m <= 3500.0 and h.elevation_m <= 15.0 and sim.rainfall_mm_hr >= 70.0)
        is_extreme_cloudburst = sim.rainfall_mm_hr >= 85.0

        if hazard_score >= 0.58 or fs < 1.25 or is_river_breach or is_slope_failure or is_coastal_surge or is_extreme_cloudburst:
            zone = "RED"
        elif hazard_score >= 0.35 or sim.rainfall_mm_hr >= 40.0 or h.river_distance_m < 250.0:
            zone = "ORANGE"
        else:
            zone = "GREEN"

        # 7. Social Vulnerability Index (SoVI)
        # Demographic weighting: elderly (1.2), infants (1.3), PwD (2.0), kutcha homes (1.1)
        pop = max(1, h.population)
        sovi = (
            1.2 * h.elderly_count +
            1.3 * h.infant_count +
            2.0 * h.pwd_count +
            1.1 * h.kutcha_houses
        ) / pop
        sovi = round(min(1.0, sovi), 3)

        # 8. Composite Relocation Priority Score
        priority_score = round(hazard_score * (1.0 + 0.6 * sovi), 3)

        h.hazard_score = hazard_score
        h.factor_of_safety = fs
        h.zone = zone
        h.sovi_score = sovi
        h.priority_score = priority_score

        return h

    @classmethod
    def evaluate_all(cls, habitations: Dict[str, Habitation], sim: SimulationPayload) -> Dict[str, Habitation]:
        for h_id in habitations:
            habitations[h_id] = cls.evaluate_habitation_hazard(habitations[h_id], sim)
        return habitations
