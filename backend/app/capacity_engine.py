from typing import Dict
from .models import Shelter, ResettlementSite

class CapacityEngine:
    """
    Dual-Horizon Carrying Capacity Assessment Engine
    Compliant with Sphere Humanitarian Standards and MHA/NDRF guidelines
    1. Short-Term / Emergency Relief Shelters (Resource bottleneck tracking)
    2. Medium-Term / Permanent Resettlement Sites (Land, slope, water carrying capacity)
    """

    @staticmethod
    def update_shelter_capacity(s: Shelter) -> Shelter:
        if not s.is_operational:
            s.effective_capacity = 0
            s.bottleneck_resource = "Out of Service"
            s.resource_limits = {}
            return s

        # Sphere Standard Constraints
        # 1. Usable floor space (3.5 m2 per person)
        cap_bed = int(min(s.beds, s.usable_area_sqm // 3.5))

        # 2. Potable drinking water (15 L/day/person for 5-day emergency target)
        cap_water = int(s.water_liters // (15.0 * 5.0))

        # 3. Rations (1 unit per person per day for 5 days)
        cap_food = int(s.ration_packets // 5)

        # 4. Sanitation (1 toilet per 20 persons)
        cap_sanitation = int(s.toilets_count * 20)

        # 5. Medical Triage Capacity
        cap_medical = int(s.medical_staff_count * 50)

        limits = {
            "Beds": cap_bed,
            "Water": cap_water,
            "Food": cap_food,
            "Sanitation": cap_sanitation,
            "Medical": cap_medical
        }

        # Effective carrying capacity is the minimum bottleneck
        effective_capacity = min(limits.values())

        # Determine bottleneck name
        bottlenecks = [name for name, cap in limits.items() if cap == effective_capacity]
        bottleneck_resource = bottlenecks[0] if bottlenecks else "Beds"

        s.effective_capacity = max(0, effective_capacity)
        s.bottleneck_resource = bottleneck_resource
        s.resource_limits = limits

        return s

    @classmethod
    def update_all_shelters(cls, shelters: Dict[str, Shelter]) -> Dict[str, Shelter]:
        for s_id in shelters:
            shelters[s_id] = cls.update_shelter_capacity(shelters[s_id])
        return shelters

    @staticmethod
    def evaluate_resettlement_site(site: ResettlementSite) -> ResettlementSite:
        # Town planning carrying capacity: ~75 m2 gross land per person (housing, roads, greens, water)
        cap_land = int(site.available_land_sqm // 75.0)

        # Suitability deductions
        suitability = 100.0
        if site.slope_degrees > 10.0:
            suitability -= (site.slope_degrees - 10.0) * 3.5
        if site.distance_to_highway_km > 2.0:
            suitability -= (site.distance_to_highway_km - 2.0) * 4.0
        if site.ground_water_depth_m > 15.0:
            suitability -= (site.ground_water_depth_m - 15.0) * 2.0

        site.carrying_capacity_population = cap_land
        site.suitability_score = round(max(0.0, min(100.0, suitability)), 1)
        site.is_hazard_free = site.slope_degrees < 15.0 and site.suitability_score >= 70.0

        return site

    @classmethod
    def update_all_resettlement_sites(cls, sites: Dict[str, ResettlementSite]) -> Dict[str, ResettlementSite]:
        for rs_id in sites:
            sites[rs_id] = cls.evaluate_resettlement_site(sites[rs_id])
        return sites
