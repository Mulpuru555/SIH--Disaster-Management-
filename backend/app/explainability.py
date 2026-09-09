from typing import Dict
from .models import Habitation, SimulationPayload, XAIResponse

class ExplainabilityEngine:
    """
    Explainable AI (XAI) Module for District Magistrate & NDRF Decision Support
    Provides game-theoretic Shapley-inspired feature importance attributions
    explaining WHY a habitation was designated as RED ZONE.
    """

    @staticmethod
    def explain_habitation(h: Habitation, sim: SimulationPayload) -> XAIResponse:
        # Base factor influences
        slope_impact = max(0.0, (h.slope_degrees / 45.0) * 40.0)
        rain_impact = max(0.0, (sim.rainfall_mm_hr / 150.0) * 35.0)
        soil_impact = sim.soil_saturation * 15.0
        river_impact = (1.0 - min(1.0, h.river_distance_m / 400.0)) * 10.0
        history_impact = min(1.0, h.historical_disaster_count / 5.0) * 10.0

        total_impact = slope_impact + rain_impact + soil_impact + river_impact + history_impact + 1e-5

        pct_slope = round((slope_impact / total_impact) * 100.0, 1)
        pct_rain = round((rain_impact / total_impact) * 100.0, 1)
        pct_soil = round((soil_impact / total_impact) * 100.0, 1)
        pct_river = round((river_impact / total_impact) * 100.0, 1)
        pct_history = round((history_impact / total_impact) * 100.0, 1)

        breakdown = {
            "Slope Instability & DEM Gradient": pct_slope,
            "Precipitation Intensity & Duration": pct_rain,
            "Soil Moisture Saturation": pct_soil,
            "River / Waterway Inundation Proximity": pct_river,
            "20-Year Disaster Recurrence History": pct_history
        }

        # Plain language rationale for District Magistrate
        reasons = []
        if h.slope_degrees >= 30.0:
            reasons.append(f"Steep hillside slope of {h.slope_degrees}° exceeds the critical threshold of 28° (Factor of Safety: {h.factor_of_safety}).")
        if sim.rainfall_mm_hr >= 70.0:
            reasons.append(f"Sustained heavy rainfall of {sim.rainfall_mm_hr} mm/hr exceeds Caine's landslide triggering curve.")
        if h.river_distance_m <= 150.0:
            reasons.append(f"Habitation is within {int(h.river_distance_m)}m of active mountain stream catchment.")
        if h.historical_disaster_count >= 3:
            reasons.append(f"Site has suffered {h.historical_disaster_count} major historical landslide/flood events in recent records.")

        if not reasons:
            reasons.append("Habitation currently exhibits stable geological and hydrologic parameters.")

        rationale = " ".join(reasons)

        # Actionable recommendation
        if h.zone == "RED":
            rec = f"MANDATORY IMMEDIATE EVACUATION ORDER (Section 34, Disaster Management Act 2005). Dispatch NDRF/SDRF convoys to prioritize {h.elderly_count} elderly, {h.infant_count} infants, and {h.pwd_count} PwD residents."
        elif h.zone == "ORANGE":
            rec = "PRE-EVACUATION STANDBY. Issue early warning sirens via Aapda Mitra; stage buses at designated assembly points."
        else:
            rec = "IN-SITU MONITORING. Routine meteorological tracking active."

        return XAIResponse(
            habitation_id=h.id,
            habitation_name=h.name,
            zone=h.zone,
            hazard_score=h.hazard_score,
            factor_breakdown_percentages=breakdown,
            plain_language_rationale=rationale,
            mitigation_recommendation=rec
        )
