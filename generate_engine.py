# Generate localEngine.js with 36 Indian States and UTs
import json

HOTSPOTS = [
  # 1. Himalayan & Hill States
  {
    'id': 'IND-UK-01', 'sector_key': 'uttarakhand', 'state': 'Uttarakhand', 'category': 'Himalayan & Hill States',
    'district': 'Chamoli & Joshimath', 'lat': 30.556, 'lng': 79.568, 'hazard_type': 'Slope Subsidence & GLOF',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 3200,
    'rainfall_rate': '85 mm/hr + Glacial Melt', 'wind_speed_kmh': 35, 'river_basin': 'Alaknanda & Dhauliganga',
    'status': 'Section 34 Evacuation Ordered', 'pilot_available': True
  },
  {
    'id': 'IND-HP-02', 'sector_key': 'himachal', 'state': 'Himachal Pradesh', 'category': 'Himalayan & Hill States',
    'district': 'Kullu & Mandi', 'lat': 31.957, 'lng': 77.109, 'hazard_type': 'Cloudburst & Flash Flood',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE ALERT', 'habitations_at_risk': 7, 'population_at_risk': 2600,
    'rainfall_rate': '95 mm/hr', 'wind_speed_kmh': 28, 'river_basin': 'Beas & Parvati River',
    'status': 'Detour Evacuation Active', 'pilot_available': True
  },
  {
    'id': 'IND-JK-03', 'sector_key': 'jammu_kashmir', 'state': 'Jammu & Kashmir', 'category': 'Himalayan & Hill States',
    'district': 'Ramban (NH-44)', 'lat': 33.240, 'lng': 75.240, 'hazard_type': 'Rockfalls & Highway Landslides',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 6, 'population_at_risk': 2100,
    'rainfall_rate': '70 mm/hr', 'wind_speed_kmh': 32, 'river_basin': 'Chenab & Jhelum Valleys',
    'status': 'Corridor Evacuation Active', 'pilot_available': True
  },
  {
    'id': 'IND-LA-04', 'sector_key': 'ladakh', 'state': 'Ladakh (UT)', 'category': 'Himalayan & Hill States',
    'district': 'Leh & Nubra Valley', 'lat': 34.152, 'lng': 77.577, 'hazard_type': 'Glacial Melt & Flash Surges',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 1800,
    'rainfall_rate': '45 mm/hr (Rapid Runoff)', 'wind_speed_kmh': 40, 'river_basin': 'Indus & Shyok Basin',
    'status': 'High-Altitude Shelters Ready', 'pilot_available': True
  },
  {
    'id': 'IND-SK-05', 'sector_key': 'sikkim', 'state': 'Sikkim', 'category': 'Himalayan & Hill States',
    'district': 'Mangan & Lachen', 'lat': 27.533, 'lng': 88.613, 'hazard_type': 'Moraine GLOF & Flash Flood',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 7, 'population_at_risk': 2800,
    'rainfall_rate': '110 mm/hr', 'wind_speed_kmh': 30, 'river_basin': 'Teesta River Basin',
    'status': 'Teesta Hydro Evacuation Deployed', 'pilot_available': True
  },
  {
    'id': 'IND-AR-06', 'sector_key': 'arunachal', 'state': 'Arunachal Pradesh', 'category': 'Himalayan & Hill States',
    'district': 'Itanagar & Papum Pare', 'lat': 27.084, 'lng': 93.605, 'hazard_type': 'Hill Slope Instability',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 6, 'population_at_risk': 2400,
    'rainfall_rate': '90 mm/hr', 'wind_speed_kmh': 24, 'river_basin': 'Subansiri & Dikrong',
    'status': 'Highland Relief Ready', 'pilot_available': True
  },
  {
    'id': 'IND-ML-07', 'sector_key': 'meghalaya', 'state': 'Meghalaya', 'category': 'Himalayan & Hill States',
    'district': 'Cherrapunji & Sohra', 'lat': 25.298, 'lng': 91.733, 'hazard_type': 'Torrential Inundation & Karst Slopes',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 3100,
    'rainfall_rate': '180 mm/hr', 'wind_speed_kmh': 38, 'river_basin': 'Surma & Shella Basins',
    'status': 'SDRF River Teams Deployed', 'pilot_available': True
  },
  {
    'id': 'IND-NL-08', 'sector_key': 'nagaland', 'state': 'Nagaland', 'category': 'Himalayan & Hill States',
    'district': 'Mokokchung & Kohima', 'lat': 26.324, 'lng': 94.516, 'hazard_type': 'Debris Slides & Highway Slump',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 1950,
    'rainfall_rate': '75 mm/hr', 'wind_speed_kmh: 22, 'river_basin': 'Dhansiri & Doyang Basin',
    'status': 'Standby Relief Camps Active', 'pilot_available': True
  },
  {
    'id': 'IND-MN-09', 'sector_key': 'manipur', 'state': 'Manipur', 'category': 'Himalayan & Hill States',
    'district': 'Churachandpur & Imphal', 'lat': 24.817, 'lng': 93.936, 'hazard_type': 'Estuary Surge & Hill Slips',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 6, 'population_at_risk': 2200,
    'rainfall_rate': '80 mm/hr', 'wind_speed_kmh': 26, 'river_basin': 'Barak & Imphal River',
    'status': 'Cordon Evacuation Ready', 'pilot_available': True
  },
  {
    'id': 'IND-MZ-10', 'sector_key': 'mizoram', 'state': 'Mizoram', 'category': 'Himalayan & Hill States',
    'district': 'Aizawl Ridge & Lunglei', 'lat': 23.727, 'lng': 92.717, 'hazard_type': 'Ridge Subsidence & Landslips',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 7, 'population_at_risk': 2700,
    'rainfall_rate': '115 mm/hr', 'wind_speed_kmh': 34, 'river_basin': 'Tlawng & Tuirial Basins',
    'status': 'Slope Displacement Warning Active', 'pilot_available': True
  },

  # 2. Coastal & Cyclone Corridors
  {
    'id': 'IND-KL-11', 'sector_key': 'kerala', 'state': 'Kerala', 'category': 'Coastal & Cyclone Corridors',
    'district': 'Wayanad & Idukki', 'lat': 11.640, 'lng': 76.100, 'hazard_type': 'Debris Flow & Slope Instability',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 10, 'population_at_risk': 4000,
    'rainfall_rate': '145 mm/hr', 'wind_speed_kmh': 42, 'river_basin': 'Chaliyar & Kabini Sub-catchment',
    'status': 'Preemptive Convoys Mobilized', 'pilot_available': True
  },
  {
    'id': 'IND-OD-12', 'sector_key': 'odisha', 'state': 'Odisha', 'category': 'Coastal & Cyclone Corridors',
    'district': 'Puri & Kendrapara', 'lat': 19.813, 'lng': 85.831, 'hazard_type': 'Severe Cyclonic Storm Surge',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 10, 'population_at_risk': 6800,
    'rainfall_rate': '115 mm/hr', 'wind_speed_kmh': 95, 'river_basin': 'Mahanadi Delta & Chilika',
    'status': '12 Cyclone Shelters on Standby', 'pilot_available': True
  },
  {
    'id': 'IND-AP-13', 'sector_key': 'andhra_pradesh', 'state': 'Andhra Pradesh', 'category': 'Coastal & Cyclone Corridors',
    'district': 'Visakhapatnam & Srikakulam', 'lat': 17.686, 'lng': 83.218, 'hazard_type': 'Coastal Gale & Storm Inundation',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 9, 'population_at_risk': 5100,
    'rainfall_rate': '120 mm/hr', 'wind_speed_kmh': 88, 'river_basin': 'Nagavali & Godavari Delta',
    'status': 'Coastal Fisher Hamlets Evacuating', 'pilot_available': True
  },
  {
    'id': 'IND-TN-14', 'sector_key': 'tamil_nadu', 'state': 'Tamil Nadu', 'category': 'Coastal & Cyclone Corridors',
    'district': 'Nilgiris & Cuddalore Coast', 'lat': 11.410, 'lng': 76.700, 'hazard_type': 'Hill Slope Failures & Coastal Surge',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 3900,
    'rainfall_rate': '130 mm/hr', 'wind_speed_kmh': 60, 'river_basin': 'Bhavani & Coleroon Basin',
    'status': 'Ghat Route Evacuations Live', 'pilot_available': True
  },
  {
    'id': 'IND-WB-15', 'sector_key': 'west_bengal', 'state': 'West Bengal', 'category': 'Coastal & Cyclone Corridors',
    'district': 'Sundarbans & 24 Parganas', 'lat': 21.950, 'lng': 88.800, 'hazard_type': 'Tidal Surges & Delta Breaches',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 12, 'population_at_risk': 7200,
    'rainfall_rate': '135 mm/hr', 'wind_speed_kmh': 85, 'river_basin': 'Hooghly & Matla Estuary',
    'status': 'Island Water Convoys Active', 'pilot_available': True
  },
  {
    'id': 'IND-GJ-16', 'sector_key': 'gujarat', 'state': 'Gujarat', 'category': 'Coastal & Cyclone Corridors',
    'district': 'Kutch & Mandvi Coast', 'lat': 23.242, 'lng': 69.666, 'hazard_type': 'Cyclonic Storm & Saline Surge',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 9, 'population_at_risk': 4800,
    'rainfall_rate': '105 mm/hr', 'wind_speed_kmh': 90, 'river_basin': 'Rann Coastal Estuary',
    'status': 'Transit Camps Operational', 'pilot_available': True
  },
  {
    'id': 'IND-MH-17', 'sector_key': 'maharashtra', 'state': 'Maharashtra', 'category': 'Coastal & Cyclone Corridors',
    'district': 'Raigad & Mahad (Konkan)', 'lat': 18.230, 'lng': 73.440, 'hazard_type': 'Konkan Ghat Landslides & Floods',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 4200,
    'rainfall_rate': '140 mm/hr', 'wind_speed_kmh': 55, 'river_basin': 'Savitri River Basin',
    'status': 'Section 34 Orders Enforced', 'pilot_available': True
  },
  {
    'id': 'IND-GA-18', 'sector_key': 'goa', 'state': 'Goa', 'category': 'Coastal & Cyclone Corridors',
    'district': 'North Goa & Mandovi Basin', 'lat': 15.490, 'lng': 73.827, 'hazard_type': 'Estuarine Flash Floods',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 4, 'population_at_risk': 1600,
    'rainfall_rate': '85 mm/hr', 'wind_speed_kmh': 48, 'river_basin': 'Mandovi & Zuari River',
    'status': 'Low-Lying Hamlets Alerted', 'pilot_available': True
  },
  {
    'id': 'IND-PY-19', 'sector_key': 'puducherry', 'state': 'Puducherry (UT)', 'category': 'Coastal & Cyclone Corridors',
    'district': 'Karaikal & Coastal Belt', 'lat': 11.941, 'lng': 79.808, 'hazard_type': 'Storm Surge Inundation',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 4, 'population_at_risk': 1750,
    'rainfall_rate': '80 mm/hr', 'wind_speed_kmh': 62, 'river_basin': 'Coromandel Coastal Front',
    'status': 'Cyclone Centres Stocked', 'pilot_available': True
  },

  # 3. Riverine Flood Basins
  {
    'id': 'IND-AS-20', 'sector_key': 'assam', 'state': 'Assam', 'category': 'Riverine Flood Basins',
    'district': 'Majuli Island & Dhemaji', 'lat': 26.962, 'lng': 94.185, 'hazard_type': 'Riverine Flooding & Erosion',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 10, 'population_at_risk': 5400,
    'rainfall_rate': '125 mm/hr', 'wind_speed_kmh': 30, 'river_basin': 'Brahmaputra & Subansiri',
    'status': 'SDRF Watercraft Deployed', 'pilot_available': True
  },
  {
    'id': 'IND-BR-21', 'sector_key': 'bihar', 'state': 'Bihar', 'category': 'Riverine Flood Basins',
    'district': 'Supaul & Saharsa (Kosi Basin)', 'lat': 26.120, 'lng': 86.600, 'hazard_type': 'Embankment Breach Inundation',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 11, 'population_at_risk': 6100,
    'rainfall_rate': '110 mm/hr', 'wind_speed_kmh': 25, 'river_basin': 'Kosi River System',
    'status': 'Emergency Shelters Live', 'pilot_available': True
  },
  {
    'id': 'IND-UP-22', 'sector_key': 'uttar_pradesh', 'state': 'Uttar Pradesh', 'category': 'Riverine Flood Basins',
    'district': 'Gorakhpur & Maharajganj', 'lat': 26.760, 'lng': 83.373, 'hazard_type': 'Rapti & Rohini Flood Inundation',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 9, 'population_at_risk': 5300,
    'rainfall_rate': '100 mm/hr', 'wind_speed_kmh': 22, 'river_basin': 'Rapti & Ghaghara River',
    'status': 'Panchayat Elevated Camps Open', 'pilot_available': True
  },
  {
    'id': 'IND-PB-23', 'sector_key': 'punjab', 'state': 'Punjab', 'category': 'Riverine Flood Basins',
    'district': 'Rupnagar & Gurdaspur', 'lat': 31.004, 'lng': 76.529, 'hazard_type': 'Sutlej & Beas Spillover Flooding',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 6, 'population_at_risk': 2900,
    'rainfall_rate': '75 mm/hr', 'wind_speed_kmh': 20, 'river_basin': 'Sutlej & Beas Basin',
    'status': 'Embankment Patrolling Active', 'pilot_available': True
  },
  {
    'id': 'IND-HR-24', 'sector_key': 'haryana', 'state': 'Haryana', 'category': 'Riverine Flood Basins',
    'district': 'Ambala & Yamunanagar', 'lat': 30.378, 'lng': 76.776, 'hazard_type': 'Ghaggar & Tangri River Surges',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 2400,
    'rainfall_rate': '70 mm/hr', 'wind_speed_kmh': 18, 'river_basin': 'Ghaggar River Catchment',
    'status': 'Drainage Pumping Active', 'pilot_available': True
  },
  {
    'id': 'IND-DL-25', 'sector_key': 'delhi', 'state': 'Delhi (NCT)', 'category': 'Riverine Flood Basins',
    'district': 'Yamuna Floodplain (Kashmere Gate)', 'lat': 28.613, 'lng': 77.209, 'hazard_type': 'Yamuna Barrage Overflow',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 4500,
    'rainfall_rate': '90 mm/hr + Hathnikund Release', 'wind_speed_kmh': 22, 'river_basin': 'Yamuna River Corridor',
    'status': 'Floodplain Relocation Convoys Active', 'pilot_available': True
  },
  {
    'id': 'IND-TR-26', 'sector_key': 'tripura', 'state': 'Tripura', 'category': 'Riverine Flood Basins',
    'district': 'Unakoti & Kailashahar', 'lat': 23.831, 'lng': 91.286, 'hazard_type': 'Manu River Flash Inundation',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 2100,
    'rainfall_rate': '85 mm/hr', 'wind_speed_kmh': 20, 'river_basin': 'Manu & Howrah Rivers',
    'status': 'Relief Centers Operational', 'pilot_available': True
  },

  # 4. Central, Plateau & Semi-Arid States
  {
    'id': 'IND-TG-27', 'sector_key': 'telangana', 'state': 'Telangana', 'category': 'Central, Plateau & Plains',
    'district': 'Bhadrachalam (Bhadradri)', 'lat': 17.668, 'lng': 80.893, 'hazard_type': 'Godavari River Deep Inundation',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 4600,
    'rainfall_rate': '115 mm/hr', 'wind_speed_kmh': 30, 'river_basin': 'Godavari River Basin',
    'status': '3rd Warning Level Exceeded (53 ft)', 'pilot_available': True
  },
  {
    'id': 'IND-KA-28', 'sector_key': 'karnataka', 'state': 'Karnataka', 'category': 'Central, Plateau & Plains',
    'district': 'Kodagu & Western Ghats', 'lat': 12.424, 'lng': 75.738, 'hazard_type': 'Debris Flow & Hill Subsidence',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 3700,
    'rainfall_rate': '130 mm/hr', 'wind_speed_kmh': 40, 'river_basin': 'Cauvery River Catchment',
    'status': 'Ghat Evacuation Convoys Ready', 'pilot_available': True
  },
  {
    'id': 'IND-MP-29', 'sector_key': 'madhya_pradesh', 'state': 'Madhya Pradesh', 'category': 'Central, Plateau & Plains',
    'district': 'Narmadapuram & Hoshangabad', 'lat': 22.751, 'lng': 77.728, 'hazard_type': 'Narmada Dam Discharge Flooding',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 6, 'population_at_risk': 3100,
    'rainfall_rate': '85 mm/hr', 'wind_speed_kmh': 24, 'river_basin': 'Narmada Basin & Tawa Dam',
    'status': 'Ghat Warning Sirens Active', 'pilot_available': True
  },
  {
    'id': 'IND-RJ-30', 'sector_key': 'rajasthan', 'state': 'Rajasthan', 'category': 'Central, Plateau & Plains',
    'district': 'Barmer & Jalore Basin', 'lat': 25.753, 'lng': 71.396, 'hazard_type': 'Flash Inundation & Desert Torrents',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 2300,
    'rainfall_rate': '65 mm/hr (Sudden Runoff)', 'wind_speed_kmh': 36, 'river_basin': 'Luni River Catchment',
    'status': 'High-Ground Camps Active', 'pilot_available': True
  },
  {
    'id': 'IND-CG-31', 'sector_key': 'chhattisgarh', 'state': 'Chhattisgarh', 'category': 'Central, Plateau & Plains',
    'district': 'Bastar & Sukma Valley', 'lat': 19.074, 'lng': 82.029, 'hazard_type': 'Indravati Flash Floods & Isolation',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 6, 'population_at_risk': 2500,
    'rainfall_rate': '90 mm/hr', 'wind_speed_kmh': 22, 'river_basin': 'Indravati & Sabari River',
    'status': 'SDRF Rescue Teams on Standby', 'pilot_available': True
  },
  {
    'id': 'IND-JH-32', 'sector_key': 'jharkhand', 'state': 'Jharkhand', 'category': 'Central, Plateau & Plains',
    'district': 'Dhanbad & Damodar Basin', 'lat': 23.795, 'lng': 86.430, 'hazard_type': 'Damodar Inundation & Mine Subsidence',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 2150,
    'rainfall_rate': '80 mm/hr', 'wind_speed_kmh': 20, 'river_basin': 'Damodar River Catchment',
    'status': 'Underground Safety Patrol Active', 'pilot_available': True
  },

  # 5. Island & Union Territories
  {
    'id': 'IND-AN-33', 'sector_key': 'andaman_nicobar', 'state': 'Andaman & Nicobar (UT)', 'category': 'Island & Union Territories',
    'district': 'South Andaman (Port Blair)', 'lat': 11.623, 'lng': 92.726, 'hazard_type': 'Tropical Cyclone Surge',
    'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 7, 'population_at_risk': 3400,
    'rainfall_rate': '140 mm/hr', 'wind_speed_kmh': 92, 'river_basin': 'Bay of Bengal Maritime Front',
    'status': 'Coastal Shelters Activated', 'pilot_available': True
  },
  {
    'id': 'IND-LD-34', 'sector_key': 'lakshadweep', 'state': 'Lakshadweep (UT)', 'category': 'Island & Union Territories',
    'district': 'Kavaratti & Agatti Atoll', 'lat': 10.566, 'lng': 72.641, 'hazard_type': 'Atoll Inundation & Marine Gales',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 4, 'population_at_risk': 1500,
    'rainfall_rate': '90 mm/hr', 'wind_speed_kmh': 80, 'river_basin': 'Arabian Sea Reef Basin',
    'status': 'Elevated Cyclone Shelters Ready', 'pilot_available': True
  },
  {
    'id': 'IND-CH-35', 'sector_key': 'chandigarh', 'state': 'Chandigarh (UT)', 'category': 'Island & Union Territories',
    'district': 'Sukhna Lake Catchment', 'lat': 30.733, 'lng': 76.779, 'hazard_type': 'Sukhna Overflow & Urban Surge',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 3, 'population_at_risk': 1200,
    'rainfall_rate': '65 mm/hr', 'wind_speed_kmh': 16, 'river_basin': 'Sukhna Choe Drainage',
    'status': 'Floodgates Monitored', 'pilot_available': True
  },
  {
    'id': 'IND-DD-36', 'sector_key': 'daman_diu', 'state': 'D&NH and D&D (UT)', 'category': 'Island & Union Territories',
    'district': 'Daman Coastal Belt', 'lat': 20.397, 'lng': 72.832, 'hazard_type': 'High Tide & Coastal Saline Floods',
    'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 4, 'population_at_risk': 1650,
    'rainfall_rate': '85 mm/hr', 'wind_speed_kmh': 55, 'river_basin': 'Daman Ganga Estuary',
    'status': 'Seawall Watch Operational', 'pilot_available': True
  }
]

print(f'Configured {len(HOTSPOTS)} Indian States & UTs.')
