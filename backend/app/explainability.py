from typing import Dict
from .models import Habitation, SimulationPayload, XAIResponse

class ExplainabilityEngine:
    """
    Explainable AI (XAI) Module for District Magistrate & NDRF Decision Support
    Provides game-theoretic Shapley-inspired feature importance attributions
    explaining WHY a habitation was designated as RED/ORANGE ZONE and
    breaking down both physical landslide/flood drivers and demographic vulnerabilities.
    """

    @staticmethod
    def explain_habitation(h: Habitation, sim: SimulationPayload) -> XAIResponse:
        # 1. Physical Hazard Feature Impacts
        slope_impact = max(0.0, (h.slope_degrees / 45.0) * 40.0)
        rain_impact = max(0.0, (sim.rainfall_mm_hr / 150.0) * 35.0)
        soil_impact = sim.soil_saturation * 15.0
        river_impact = (1.0 - min(1.0, h.river_distance_m / 400.0)) * 10.0
        history_impact = min(1.0, h.historical_disaster_count / 5.0) * 10.0

        total_impact = slope_impact + rain_impact + soil_impact + river_impact + history_impact + 1e-5

        breakdown = {
            "Slope Instability & DEM Gradient": round((slope_impact / total_impact) * 100.0, 1),
            "Precipitation Intensity & Duration": round((rain_impact / total_impact) * 100.0, 1),
            "Soil Moisture Saturation": round((soil_impact / total_impact) * 100.0, 1),
            "River / Waterway Inundation Proximity": round((river_impact / total_impact) * 100.0, 1),
            "20-Year Disaster Recurrence History": round((history_impact / total_impact) * 100.0, 1)
        }

        # 2. Social Vulnerability Index (SoVI) Demographic Breakdown
        pop = max(1, h.population)
        elderly_impact = (h.elderly_count / pop) * 35.0
        infant_impact = (h.infant_count / pop) * 25.0
        pwd_impact = (h.pwd_count / pop) * 30.0
        kutcha_impact = (h.kutcha_houses / max(1, h.kutcha_houses + 50)) * 10.0
        total_demo = elderly_impact + infant_impact + pwd_impact + kutcha_impact + 1e-5

        social_breakdown = {
            "Geriatric / Elderly Dependency": round((elderly_impact / total_demo) * 100.0, 1),
            "Pediatric / Infant Vulnerability": round((infant_impact / total_demo) * 100.0, 1),
            "Persons with Disabilities (PwD) Mobility Limitation": round((pwd_impact / total_demo) * 100.0, 1),
            "Kutcha / Structural Fragility": round((kutcha_impact / total_demo) * 100.0, 1)
        }

        demographic_score = round(min(1.0, (h.elderly_count * 2.5 + h.infant_count * 2.0 + h.pwd_count * 3.5 + h.kutcha_houses * 0.8) / pop), 2)

        # 3. Wave Prioritization Recommendation
        if h.zone == "RED" or h.hazard_score >= 70.0 or demographic_score >= 0.35:
            evac_wave = "Wave 1: Immediate Critical Evacuation (0-2 Hours)"
        elif h.zone == "ORANGE" or h.hazard_score >= 40.0 or demographic_score >= 0.20:
            evac_wave = "Wave 2: High Priority Evacuation (2-6 Hours)"
        else:
            evac_wave = "Wave 3: Standard Precautionary Evacuation (6-12 Hours)"

        # 4. Plain language rationale for District Magistrate & DEOC
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

        reasons.append(
            f"Demographic vulnerability score is {demographic_score} ({'Critical' if demographic_score >= 0.35 else 'Elevated' if demographic_score >= 0.20 else 'Low'}), with {h.elderly_count} senior citizens, {h.infant_count} infants, and {h.pwd_count} PwD residents requiring priority dispatch."
        )

        rationale = " ".join(reasons)

        # 5. Actionable recommendation
        if h.zone == "RED":
            rec = f"MANDATORY IMMEDIATE EVACUATION ORDER (Section 34, Disaster Management Act 2005). Dispatch NDRF/SDRF convoys to prioritize {h.elderly_count} elderly, {h.infant_count} infants, and {h.pwd_count} PwD residents under {evac_wave}."
        elif h.zone == "ORANGE":
            rec = f"PRE-EVACUATION STANDBY. Issue early warning sirens via Aapda Mitra; stage 4x4 buses at designated assembly points for {evac_wave}."
        else:
            rec = f"IN-SITU MONITORING. Routine meteorological tracking active under {evac_wave}."

        return XAIResponse(
            habitation_id=h.id,
            habitation_name=h.name,
            zone=h.zone,
            hazard_score=h.hazard_score,
            factor_breakdown_percentages=breakdown,
            plain_language_rationale=rationale,
            mitigation_recommendation=rec,
            demographic_vulnerability_score=demographic_score,
            social_vulnerability_breakdown=social_breakdown,
            evacuation_wave_recommendation=evac_wave
        )
