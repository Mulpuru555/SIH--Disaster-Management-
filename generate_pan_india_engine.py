import json

HOTSPOTS = [
  # 1. Himalayan & Hill States
  { 'id': 'IND-UK-01', 'sector_key': 'uttarakhand', 'state': 'Uttarakhand', 'category': 'Himalayan & Hill States', 'district': 'Chamoli & Joshimath', 'lat': 30.556, 'lng': 79.568, 'hazard_type': 'Slope Subsidence & GLOF', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 3200, 'rainfall_rate': '85 mm/hr + Glacial Melt', 'wind_speed_kmh': 35, 'river_basin': 'Alaknanda & Dhauliganga', 'status': 'Section 34 Evacuation Ordered', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-HP-02', 'sector_key': 'himachal', 'state': 'Himachal Pradesh', 'category': 'Himalayan & Hill States', 'district': 'Kullu & Mandi', 'lat': 31.957, 'lng': 77.109, 'hazard_type': 'Cloudburst & Flash Flood', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE ALERT', 'habitations_at_risk': 7, 'population_at_risk': 2600, 'rainfall_rate': '95 mm/hr', 'wind_speed_kmh': 28, 'river_basin': 'Beas & Parvati River', 'status': 'Detour Evacuation Active', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-JK-03', 'sector_key': 'jammu_kashmir', 'state': 'Jammu & Kashmir', 'category': 'Himalayan & Hill States', 'district': 'Ramban District (NH-44 Corridor)', 'lat': 33.240, 'lng': 75.240, 'hazard_type': 'Rockfalls & Highway Landslides', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 6, 'population_at_risk': 2100, 'rainfall_rate': '70 mm/hr', 'wind_speed_kmh': 32, 'river_basin': 'Chenab & Jhelum Valleys', 'status': 'Corridor Evacuation Active', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-LA-04', 'sector_key': 'ladakh', 'state': 'Ladakh (UT)', 'category': 'Himalayan & Hill States', 'district': 'Leh & Nubra Valley', 'lat': 34.152, 'lng': 77.577, 'hazard_type': 'Glacial Melt & Flash Surges', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 1800, 'rainfall_rate': '45 mm/hr (Rapid Runoff)', 'wind_speed_kmh': 40, 'river_basin': 'Indus & Shyok Basin', 'status': 'High-Altitude Shelters Ready', 'pilot_available': True, 'zoom': 10 },
  { 'id': 'IND-SK-05', 'sector_key': 'sikkim', 'state': 'Sikkim', 'category': 'Himalayan & Hill States', 'district': 'Mangan & Lachen', 'lat': 27.533, 'lng': 88.613, 'hazard_type': 'Moraine GLOF & Flash Flood', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 7, 'population_at_risk': 2800, 'rainfall_rate': '110 mm/hr', 'wind_speed_kmh': 30, 'river_basin': 'Teesta River Basin', 'status': 'Teesta Hydro Evacuation Deployed', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-AR-06', 'sector_key': 'arunachal', 'state': 'Arunachal Pradesh', 'category': 'Himalayan & Hill States', 'district': 'Itanagar & Papum Pare', 'lat': 27.084, 'lng': 93.605, 'hazard_type': 'Hill Slope Instability', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 6, 'population_at_risk': 2400, 'rainfall_rate': '90 mm/hr', 'wind_speed_kmh': 24, 'river_basin': 'Subansiri & Dikrong', 'status': 'Highland Relief Ready', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-ML-07', 'sector_key': 'meghalaya', 'state': 'Meghalaya', 'category': 'Himalayan & Hill States', 'district': 'Cherrapunji & Sohra', 'lat': 25.298, 'lng': 91.733, 'hazard_type': 'Torrential Inundation & Karst Slopes', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 3100, 'rainfall_rate': '180 mm/hr', 'wind_speed_kmh': 38, 'river_basin': 'Surma & Shella Basins', 'status': 'SDRF River Teams Deployed', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-NL-08', 'sector_key': 'nagaland', 'state': 'Nagaland', 'category': 'Himalayan & Hill States', 'district': 'Mokokchung & Kohima', 'lat': 26.324, 'lng': 94.516, 'hazard_type': 'Debris Slides & Highway Slump', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 1950, 'rainfall_rate': '75 mm/hr', 'wind_speed_kmh': 22, 'river_basin': 'Dhansiri & Doyang Basin', 'status': 'Standby Relief Camps Active', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-MN-09', 'sector_key': 'manipur', 'state': 'Manipur', 'category': 'Himalayan & Hill States', 'district': 'Churachandpur & Imphal', 'lat': 24.817, 'lng': 93.936, 'hazard_type': 'Estuary Surge & Hill Slips', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 6, 'population_at_risk': 2200, 'rainfall_rate': '80 mm/hr', 'wind_speed_kmh': 26, 'river_basin': 'Barak & Imphal River', 'status': 'Cordon Evacuation Ready', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-MZ-10', 'sector_key': 'mizoram', 'state': 'Mizoram', 'category': 'Himalayan & Hill States', 'district': 'Aizawl Ridge & Lunglei', 'lat': 23.727, 'lng': 92.717, 'hazard_type': 'Ridge Subsidence & Landslips', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 7, 'population_at_risk': 2700, 'rainfall_rate': '115 mm/hr', 'wind_speed_kmh': 34, 'river_basin': 'Tlawng & Tuirial Basins', 'status': 'Slope Displacement Warning Active', 'pilot_available': True, 'zoom': 11 },

  # 2. Coastal & Cyclone Corridors
  { 'id': 'IND-KL-11', 'sector_key': 'kerala', 'state': 'Kerala', 'category': 'Coastal & Cyclone Corridors', 'district': 'Wayanad & Idukki', 'lat': 11.640, 'lng': 76.100, 'hazard_type': 'Debris Flow & Slope Instability', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 10, 'population_at_risk': 4000, 'rainfall_rate': '145 mm/hr', 'wind_speed_kmh': 42, 'river_basin': 'Chaliyar & Kabini Sub-catchment', 'status': 'Preemptive Convoys Mobilized', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-OD-12', 'sector_key': 'odisha', 'state': 'Odisha', 'category': 'Coastal & Cyclone Corridors', 'district': 'Puri & Kendrapara', 'lat': 19.813, 'lng': 85.831, 'hazard_type': 'Severe Cyclonic Storm Surge', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 10, 'population_at_risk': 6800, 'rainfall_rate': '115 mm/hr', 'wind_speed_kmh': 95, 'river_basin': 'Mahanadi Delta & Chilika', 'status': '12 Cyclone Shelters on Standby', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-AP-13', 'sector_key': 'andhra_pradesh', 'state': 'Andhra Pradesh', 'category': 'Coastal & Cyclone Corridors', 'district': 'Visakhapatnam & Anakapalle', 'lat': 17.686, 'lng': 83.218, 'hazard_type': 'Coastal Gale & Storm Inundation', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 9, 'population_at_risk': 5100, 'rainfall_rate': '120 mm/hr', 'wind_speed_kmh': 88, 'river_basin': 'Nagavali & Sarada Delta', 'status': 'Coastal Fisher Hamlets Evacuating', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-TN-14', 'sector_key': 'tamil_nadu', 'state': 'Tamil Nadu', 'category': 'Coastal & Cyclone Corridors', 'district': 'Nilgiris & Cuddalore Coast', 'lat': 11.410, 'lng': 76.700, 'hazard_type': 'Hill Slope Failures & Coastal Surge', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 3900, 'rainfall_rate': '130 mm/hr', 'wind_speed_kmh': 60, 'river_basin': 'Bhavani & Coleroon Basin', 'status': 'Ghat Route Evacuations Live', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-WB-15', 'sector_key': 'west_bengal', 'state': 'West Bengal', 'category': 'Coastal & Cyclone Corridors', 'district': 'Sundarbans & 24 Parganas', 'lat': 21.950, 'lng': 88.800, 'hazard_type': 'Tidal Surges & Delta Breaches', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 12, 'population_at_risk': 7200, 'rainfall_rate': '135 mm/hr', 'wind_speed_kmh': 85, 'river_basin': 'Hooghly & Matla Estuary', 'status': 'Island Water Convoys Active', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-GJ-16', 'sector_key': 'gujarat', 'state': 'Gujarat', 'category': 'Coastal & Cyclone Corridors', 'district': 'Kutch & Mandvi Coast', 'lat': 23.242, 'lng': 69.666, 'hazard_type': 'Cyclonic Storm & Saline Surge', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 9, 'population_at_risk': 4800, 'rainfall_rate': '105 mm/hr', 'wind_speed_kmh': 90, 'river_basin': 'Rann Coastal Estuary', 'status': 'Transit Camps Operational', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-MH-17', 'sector_key': 'maharashtra', 'state': 'Maharashtra', 'category': 'Coastal & Cyclone Corridors', 'district': 'Raigad & Mahad (Konkan)', 'lat': 18.230, 'lng': 73.440, 'hazard_type': 'Konkan Ghat Landslides & Floods', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 4200, 'rainfall_rate': '140 mm/hr', 'wind_speed_kmh': 55, 'river_basin': 'Savitri River Basin', 'status': 'Section 34 Orders Enforced', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-GA-18', 'sector_key': 'goa', 'state': 'Goa', 'category': 'Coastal & Cyclone Corridors', 'district': 'North Goa & Mandovi Basin', 'lat': 15.490, 'lng': 73.827, 'hazard_type': 'Estuarine Flash Floods', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 4, 'population_at_risk': 1600, 'rainfall_rate': '85 mm/hr', 'wind_speed_kmh': 48, 'river_basin': 'Mandovi & Zuari River', 'status': 'Low-Lying Hamlets Alerted', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-PY-19', 'sector_key': 'puducherry', 'state': 'Puducherry (UT)', 'category': 'Coastal & Cyclone Corridors', 'district': 'Karaikal & Coastal Belt', 'lat': 11.941, 'lng': 79.808, 'hazard_type': 'Storm Surge Inundation', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 4, 'population_at_risk': 1750, 'rainfall_rate': '80 mm/hr', 'wind_speed_kmh': 62, 'river_basin': 'Coromandel Coastal Front', 'status': 'Cyclone Centres Stocked', 'pilot_available': True, 'zoom': 11 },

  # 3. Riverine Flood Basins
  { 'id': 'IND-AS-20', 'sector_key': 'assam', 'state': 'Assam', 'category': 'Riverine Flood Basins', 'district': 'Majuli Island & Dhemaji', 'lat': 26.962, 'lng': 94.185, 'hazard_type': 'Riverine Flooding & Erosion', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 10, 'population_at_risk': 5400, 'rainfall_rate': '125 mm/hr', 'wind_speed_kmh': 30, 'river_basin': 'Brahmaputra & Subansiri', 'status': 'SDRF Watercraft Deployed', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-BR-21', 'sector_key': 'bihar', 'state': 'Bihar', 'category': 'Riverine Flood Basins', 'district': 'Supaul & Saharsa (Kosi Basin)', 'lat': 26.120, 'lng': 86.600, 'hazard_type': 'Embankment Breach Inundation', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 11, 'population_at_risk': 6100, 'rainfall_rate': '110 mm/hr', 'wind_speed_kmh': 25, 'river_basin': 'Kosi River System', 'status': 'Emergency Shelters Live', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-UP-22', 'sector_key': 'uttar_pradesh', 'state': 'Uttar Pradesh', 'category': 'Riverine Flood Basins', 'district': 'Gorakhpur & Maharajganj', 'lat': 26.760, 'lng': 83.373, 'hazard_type': 'Rapti & Rohini Flood Inundation', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 9, 'population_at_risk': 5300, 'rainfall_rate': '100 mm/hr', 'wind_speed_kmh': 22, 'river_basin': 'Rapti & Ghaghara River', 'status': 'Panchayat Elevated Camps Open', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-PB-23', 'sector_key': 'punjab', 'state': 'Punjab', 'category': 'Riverine Flood Basins', 'district': 'Rupnagar & Gurdaspur', 'lat': 31.004, 'lng': 76.529, 'hazard_type': 'Sutlej & Beas Spillover Flooding', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 6, 'population_at_risk': 2900, 'rainfall_rate': '75 mm/hr', 'wind_speed_kmh': 20, 'river_basin': 'Sutlej & Beas Basin', 'status': 'Embankment Patrolling Active', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-HR-24', 'sector_key': 'haryana', 'state': 'Haryana', 'category': 'Riverine Flood Basins', 'district': 'Ambala & Yamunanagar', 'lat': 30.378, 'lng': 76.776, 'hazard_type': 'Ghaggar & Tangri River Surges', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 2400, 'rainfall_rate': '70 mm/hr', 'wind_speed_kmh': 18, 'river_basin': 'Ghaggar River Catchment', 'status': 'Drainage Pumping Active', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-DL-25', 'sector_key': 'delhi', 'state': 'Delhi (NCT)', 'category': 'Riverine Flood Basins', 'district': 'North & Central Delhi (Yamuna Khadar Corridor)', 'lat': 28.613, 'lng': 77.209, 'hazard_type': 'Yamuna Barrage Overflow', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 4500, 'rainfall_rate': '90 mm/hr + Hathnikund Release', 'wind_speed_kmh': 22, 'river_basin': 'Yamuna River Corridor', 'status': 'Floodplain Relocation Convoys Active', 'pilot_available': True, 'zoom': 12 },
  { 'id': 'IND-TR-26', 'sector_key': 'tripura', 'state': 'Tripura', 'category': 'Riverine Flood Basins', 'district': 'Unakoti & Kailashahar', 'lat': 23.831, 'lng': 91.286, 'hazard_type': 'Manu River Flash Inundation', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 2100, 'rainfall_rate': '85 mm/hr', 'wind_speed_kmh': 20, 'river_basin': 'Manu & Howrah Rivers', 'status': 'Relief Centers Operational', 'pilot_available': True, 'zoom': 11 },

  # 4. Central, Plateau & Semi-Arid States
  { 'id': 'IND-TG-27', 'sector_key': 'telangana', 'state': 'Telangana', 'category': 'Central, Plateau & Plains', 'district': 'Bhadrachalam (Bhadradri)', 'lat': 17.668, 'lng': 80.893, 'hazard_type': 'Godavari River Deep Inundation', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 4600, 'rainfall_rate': '115 mm/hr', 'wind_speed_kmh': 30, 'river_basin': 'Godavari River Basin', 'status': '3rd Warning Level Exceeded (53 ft)', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-KA-28', 'sector_key': 'karnataka', 'state': 'Karnataka', 'category': 'Central, Plateau & Plains', 'district': 'Kodagu & Western Ghats', 'lat': 12.424, 'lng': 75.738, 'hazard_type': 'Debris Flow & Hill Subsidence', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 8, 'population_at_risk': 3700, 'rainfall_rate': '130 mm/hr', 'wind_speed_kmh': 40, 'river_basin': 'Cauvery River Catchment', 'status': 'Ghat Evacuation Convoys Ready', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-MP-29', 'sector_key': 'madhya_pradesh', 'state': 'Madhya Pradesh', 'category': 'Central, Plateau & Plains', 'district': 'Narmadapuram & Hoshangabad', 'lat': 22.751, 'lng': 77.728, 'hazard_type': 'Narmada Dam Discharge Flooding', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 6, 'population_at_risk': 3100, 'rainfall_rate': '85 mm/hr', 'wind_speed_kmh': 24, 'river_basin': 'Narmada Basin & Tawa Dam', 'status': 'Ghat Warning Sirens Active', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-RJ-30', 'sector_key': 'rajasthan', 'state': 'Rajasthan', 'category': 'Central, Plateau & Plains', 'district': 'Barmer & Jalore Basin', 'lat': 25.753, 'lng': 71.396, 'hazard_type': 'Flash Inundation & Desert Torrents', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 2300, 'rainfall_rate': '65 mm/hr (Sudden Runoff)', 'wind_speed_kmh': 36, 'river_basin': 'Luni River Catchment', 'status': 'High-Ground Camps Active', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-CG-31', 'sector_key': 'chhattisgarh', 'state': 'Chhattisgarh', 'category': 'Central, Plateau & Plains', 'district': 'Bastar & Sukma Valley', 'lat': 19.074, 'lng': 82.029, 'hazard_type': 'Indravati Flash Floods & Isolation', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 6, 'population_at_risk': 2500, 'rainfall_rate': '90 mm/hr', 'wind_speed_kmh': 22, 'river_basin': 'Indravati & Sabari River', 'status': 'SDRF Rescue Teams on Standby', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-JH-32', 'sector_key': 'jharkhand', 'state': 'Jharkhand', 'category': 'Central, Plateau & Plains', 'district': 'Dhanbad & Damodar Basin', 'lat': 23.795, 'lng': 86.430, 'hazard_type': 'Damodar Inundation & Mine Subsidence', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 5, 'population_at_risk': 2150, 'rainfall_rate': '80 mm/hr', 'wind_speed_kmh': 20, 'river_basin': 'Damodar River Catchment', 'status': 'Underground Safety Patrol Active', 'pilot_available': True, 'zoom': 11 },

  # 5. Island & Union Territories
  { 'id': 'IND-AN-33', 'sector_key': 'andaman_nicobar', 'state': 'Andaman & Nicobar (UT)', 'category': 'Island & Union Territories', 'district': 'South Andaman District (Port Blair)', 'lat': 11.623, 'lng': 92.726, 'hazard_type': 'Tropical Cyclone Surge', 'alert_level': 'RED', 'alert_badge': '🚨 RED ALERT', 'habitations_at_risk': 7, 'population_at_risk': 3400, 'rainfall_rate': '140 mm/hr', 'wind_speed_kmh': 92, 'river_basin': 'Bay of Bengal Maritime Front', 'status': 'Coastal Shelters Activated', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-LD-34', 'sector_key': 'lakshadweep', 'state': 'Lakshadweep (UT)', 'category': 'Island & Union Territories', 'district': 'Kavaratti & Agatti Atoll', 'lat': 10.566, 'lng': 72.641, 'hazard_type': 'Atoll Inundation & Marine Gales', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 4, 'population_at_risk': 1500, 'rainfall_rate': '90 mm/hr', 'wind_speed_kmh': 80, 'river_basin': 'Arabian Sea Reef Basin', 'status': 'Elevated Cyclone Shelters Ready', 'pilot_available': True, 'zoom': 11 },
  { 'id': 'IND-CH-35', 'sector_key': 'chandigarh', 'state': 'Chandigarh (UT)', 'category': 'Island & Union Territories', 'district': 'Chandigarh (Sukhna Catchment & Choe Basin)', 'lat': 30.733, 'lng': 76.779, 'hazard_type': 'Sukhna Overflow & Urban Surge', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 3, 'population_at_risk': 1200, 'rainfall_rate': '65 mm/hr', 'wind_speed_kmh': 16, 'river_basin': 'Sukhna Choe Drainage', 'status': 'Floodgates Monitored', 'pilot_available': True, 'zoom': 12 },
  { 'id': 'IND-DD-36', 'sector_key': 'daman_diu', 'state': 'D&NH and D&D (UT)', 'category': 'Island & Union Territories', 'district': 'Daman & Diu (Daman Ganga Estuary)', 'lat': 20.397, 'lng': 72.832, 'hazard_type': 'High Tide & Coastal Saline Floods', 'alert_level': 'ORANGE', 'alert_badge': '⚠️ ORANGE WARNING', 'habitations_at_risk': 4, 'population_at_risk': 1650, 'rainfall_rate': '85 mm/hr', 'wind_speed_kmh': 55, 'river_basin': 'Daman Ganga Estuary', 'status': 'Seawall Watch Operational', 'pilot_available': True, 'zoom': 11 }
]

OPERATIONAL_SECTORS = [
  { 'id': 'all_india', 'state': 'National', 'category': 'Pan-India Overview', 'label': '🇮🇳 All-India National Multi-Hazard Overview (All 36 States & UTs)', 'center': [22.8, 80.0], 'zoom': 5, 'districtName': 'National Multi-District Scope' }
]

for h in HOTSPOTS:
  OPERATIONAL_SECTORS.append({
    'id': h['sector_key'],
    'state': h['state'],
    'category': h['category'],
    'label': f"{h['state']}: {h['district']} ({h['hazard_type'].split('&')[0].strip()})",
    'center': [h['lat'], h['lng']],
    'zoom': h['zoom'],
    'districtName': f"{h['district']}, {h['state']}"
  })

DISTRICT_HABITATIONS = {}
DISTRICT_SHELTERS = {}
DISTRICT_RESETTLEMENT = {}

for h in HOTSPOTS:
  k = h['sector_key']
  lat, lng = h['lat'], h['lng']
  pop = h['population_at_risk']
  d_first = h['district'].split('&')[0].strip()
  d_last = h['district'].split('&')[-1].strip()
  st = h['state'].split('(')[0].strip()

  DISTRICT_HABITATIONS[k] = [
    {
      'id': f"{k.upper()[:3]}-H1",
      'name': f"{d_first} High-Terrace Ward",
      'taluk': f"{d_first} Sub-Division",
      'district': h['district'],
      'state': h['state'],
      'lat': round(lat + 0.022, 4),
      'lng': round(lng + 0.032, 4),
      'population': int(pop * 0.55),
      'elderly_count': int(pop * 0.08),
      'infant_count': int(pop * 0.06),
      'pwd_count': int(pop * 0.02),
      'kutcha_houses': int(pop * 0.22),
      'slope_degrees': 36.5 if 'Himalayan' in h['category'] or 'Western Ghats' in h['state'] or k in ['kerala', 'karnataka', 'tamil_nadu', 'maharashtra'] else 2.5,
      'elevation_m': 950.0 if 'Himalayan' in h['category'] else 80.0,
      'river_distance_m': 65.0,
      'terrain_description': f"Riparian Embankment Ward (65m from high-water bund)",
      'historical_disaster_count': 5,
      'zone': h['alert_level'],
      'hazard_score': 0.82 if h['alert_level'] == 'RED' else 0.58,
      'factor_of_safety': 1.04 if h['alert_level'] == 'RED' else 1.35,
      'sovi_score': 0.64,
      'priority_score': 1.08 if h['alert_level'] == 'RED' else 0.72
    },
    {
      'id': f"{k.upper()[:3]}-H2",
      'name': f"{d_last} Inland Settlement",
      'taluk': f"{d_last} Tehsil",
      'district': h['district'],
      'state': h['state'],
      'lat': round(lat - 0.028, 4),
      'lng': round(lng - 0.035, 4),
      'population': int(pop * 0.45),
      'elderly_count': int(pop * 0.06),
      'infant_count': int(pop * 0.05),
      'pwd_count': int(pop * 0.015),
      'kutcha_houses': int(pop * 0.18),
      'slope_degrees': 32.0 if 'Himalayan' in h['category'] else 1.8,
      'elevation_m': 820.0 if 'Himalayan' in h['category'] else 65.0,
      'river_distance_m': 120.0,
      'terrain_description': f"Elevated Terrace Ground (120m from riverline)",
      'historical_disaster_count': 4,
      'zone': h['alert_level'],
      'hazard_score': 0.76 if h['alert_level'] == 'RED' else 0.52,
      'factor_of_safety': 1.12 if h['alert_level'] == 'RED' else 1.45,
      'sovi_score': 0.58,
      'priority_score': 0.98 if h['alert_level'] == 'RED' else 0.65
    }
  ]

  DISTRICT_SHELTERS[k] = [
    {
      'id': f"S-{k.upper()[:3]}-1",
      'name': f"{st} Multi-Purpose Relief Complex",
      'taluk': f"{d_first} Municipality",
      'district': h['district'],
      'state': h['state'],
      'lat': round(lat + 0.055, 4),
      'lng': round(lng - 0.030, 4),
      'usable_area_sqm': 6500,
      'beds': int(pop * 0.65),
      'water_liters': 150000,
      'ration_packets': 10000,
      'toilets_count': 90,
      'medical_staff_count': 35,
      'effective_capacity': int(pop * 0.65),
      'current_occupancy': int(pop * 0.65) if h['alert_level'] == 'RED' else int(pop * 0.3),
      'bottleneck_resource': 'Beds'
    },
    {
      'id': f"S-{k.upper()[:3]}-2",
      'name': f"{d_first} Stadium Disaster Centre",
      'taluk': f"{d_last} Sub-Division",
      'district': h['district'],
      'state': h['state'],
      'lat': round(lat - 0.045, 4),
      'lng': round(lng + 0.050, 4),
      'usable_area_sqm': 8000,
      'beds': int(pop * 0.70),
      'water_liters': 180000,
      'ration_packets': 12500,
      'toilets_count': 110,
      'medical_staff_count': 45,
      'effective_capacity': int(pop * 0.70),
      'current_occupancy': 0,
      'bottleneck_resource': 'Sanitation'
    }
  ]

  rs_pop = int(pop * 1.4)
  DISTRICT_RESETTLEMENT[k] = [
    {
      'id': f"RS-{k.upper()[:3]}-1",
      'name': f"{d_first} Safe Tableland Township",
      'lat': round(lat + 0.095, 4),
      'lng': round(lng + 0.075, 4),
      'available_land_sqm': 380000,
      'slope_degrees': 4.5,
      'carrying_capacity_population': rs_pop,
      'suitability_score': 94.5,
      'survey_nos': f"Sy. Nos. {k.upper()[:3]}-REV-104/1, 105/A",
      'taluk': f"{d_first} Revenue Division",
      'water_table_depth_m': 16.5,
      'planned_houses': int(rs_pop / 4.0),
      'civic_amenities': [
        "Sub-District Hospital (30-Bed)",
        "Protected Piped Drinking Water (RO)",
        "Govt Higher Secondary School & Anganwadi",
        "All-Weather Paved Arterial Road",
        "Dedicated 11kV Power Feeder & Microgrid"
      ],
      'target_population': f"{h['district']} Multi-Hazard Vulnerable Communities",
      'status': "Cadastral Survey Approved & Collector Sanction Issued under DM Act"
    }
  ]

# --- Curated High-Accuracy Benchmark Data for TELANGANA (Bhadrachalam / Godavari Basin) ---
DISTRICT_HABITATIONS['telangana'] = [
  {
    'id': 'TG-H1',
    'name': 'Bhadrachalam Ghat Ward (North Bank Levee)',
    'taluk': 'Bhadrachalam Urban Mandal',
    'district': 'Bhadrachalam (Bhadradri)',
    'state': 'Telangana',
    'lat': 17.6710,
    'lng': 80.8940,
    'population': 2530,
    'elderly_count': 320,
    'infant_count': 210,
    'pwd_count': 64,
    'kutcha_houses': 540,
    'slope_degrees': 2.0,
    'elevation_m': 48.0,
    'river_distance_m': 65.0,
    'terrain_description': 'North Bank Floodplain Levee (65m from Godavari bund)',
    'historical_disaster_count': 6,
    'zone': 'RED',
    'hazard_score': 0.82,
    'factor_of_safety': 1.04,
    'sovi_score': 0.64,
    'priority_score': 1.08
  },
  {
    'id': 'TG-H2',
    'name': 'Sarapaka Colony (North-West Bank Terrace)',
    'taluk': 'Burgampahad Mandal',
    'district': 'Bhadrachalam (Bhadradri)',
    'state': 'Telangana',
    'lat': 17.6860,
    'lng': 80.8650,
    'population': 2070,
    'elderly_count': 270,
    'infant_count': 180,
    'pwd_count': 48,
    'kutcha_houses': 380,
    'slope_degrees': 3.5,
    'elevation_m': 54.0,
    'river_distance_m': 140.0,
    'terrain_description': 'Sarapaka High-Terrace Settlement (140m from river channel)',
    'historical_disaster_count': 5,
    'zone': 'RED',
    'hazard_score': 0.76,
    'factor_of_safety': 1.12,
    'sovi_score': 0.58,
    'priority_score': 0.98
  }
]

DISTRICT_SHELTERS['telangana'] = [
  {
    'id': 'S-TG-1',
    'name': 'Bhadrachalam Govt Junior College Emergency Camp',
    'taluk': 'Bhadrachalam Urban Mandal',
    'district': 'Bhadrachalam (Bhadradri)',
    'state': 'Telangana',
    'lat': 17.6760,
    'lng': 80.8990,
    'usable_area_sqm': 6500,
    'beds': 2800,
    'water_liters': 160000,
    'ration_packets': 11000,
    'toilets_count': 95,
    'medical_staff_count': 38,
    'effective_capacity': 2800,
    'current_occupancy': 2530,
    'bottleneck_resource': 'Beds'
  },
  {
    'id': 'S-TG-2',
    'name': 'Sarapaka ITC High-Ground Relief Complex',
    'taluk': 'Burgampahad Mandal',
    'district': 'Bhadrachalam (Bhadradri)',
    'state': 'Telangana',
    'lat': 17.6930,
    'lng': 80.8610,
    'usable_area_sqm': 7500,
    'beds': 2500,
    'water_liters': 150000,
    'ration_packets': 10000,
    'toilets_count': 85,
    'medical_staff_count': 32,
    'effective_capacity': 2500,
    'current_occupancy': 0,
    'bottleneck_resource': 'Sanitation'
  }
]

DISTRICT_RESETTLEMENT['telangana'] = [
  {
    'id': 'RS-TG-1',
    'name': 'Palwancha Safe Tableland Township (Non-Flood Zone)',
    'lat': 17.5950,
    'lng': 80.7100,
    'available_land_sqm': 450000,
    'slope_degrees': 4.2,
    'carrying_capacity_population': 6500,
    'suitability_score': 95.8,
    'survey_nos': 'Sy. Nos. 88/2, 91/1, 94/A (Palwancha Circle)',
    'taluk': 'Palwancha Mandal / Kothagudem Division',
    'water_table_depth_m': 17.8,
    'planned_houses': 1550,
    'civic_amenities': [
      'Community Health Centre (30-Bed CHC)',
      'Zilla Parishad High School & Anganwadi Hub',
      'Mission Bhagiratha Protected Piped Water Grid',
      'Concrete Arterial Evacuation Route Links',
      'Dedicated 33/11kV Power Feeder Substation'
    ],
    'target_population': 'Bhadrachalam Godavari Levee & Sarapaka Flood Basin Habitations',
    'status': 'Government Land Allocated & Land Bank Notified by DDMA'
  }
]

# --- Curated High-Accuracy Benchmark Data for ANDHRA PRADESH (Visakhapatnam & Anakapalle) ---
DISTRICT_HABITATIONS['andhra_pradesh'] = [
  {
    'id': 'AP-H1',
    'name': 'Visakhapatnam Fishing Harbour Ward',
    'taluk': 'Visakhapatnam Urban (Maharanipeta Mandal)',
    'district': 'Visakhapatnam & Anakapalle',
    'state': 'Andhra Pradesh',
    'lat': 17.6980,
    'lng': 83.3050,
    'population': 2800,
    'elderly_count': 350,
    'infant_count': 230,
    'pwd_count': 70,
    'kutcha_houses': 590,
    'slope_degrees': 2.5,
    'elevation_m': 6.0,
    'river_distance_m': 75.0,
    'terrain_description': 'Coastal Lowland Settlement (75m from high-tide line)',
    'historical_disaster_count': 6,
    'zone': 'RED',
    'hazard_score': 0.82,
    'factor_of_safety': 1.04,
    'sovi_score': 0.64,
    'priority_score': 1.08
  },
  {
    'id': 'AP-H2',
    'name': 'Anakapalle Sarada River Basin Basti',
    'taluk': 'Anakapalle Revenue Mandal',
    'district': 'Visakhapatnam & Anakapalle',
    'state': 'Andhra Pradesh',
    'lat': 17.6850,
    'lng': 83.0120,
    'population': 2300,
    'elderly_count': 290,
    'infant_count': 190,
    'pwd_count': 55,
    'kutcha_houses': 430,
    'slope_degrees': 1.8,
    'elevation_m': 28.0,
    'river_distance_m': 85.0,
    'terrain_description': 'Sarada River Floodplain Ward (85m from embankment)',
    'historical_disaster_count': 5,
    'zone': 'RED',
    'hazard_score': 0.76,
    'factor_of_safety': 1.12,
    'sovi_score': 0.58,
    'priority_score': 0.98
  }
]

DISTRICT_SHELTERS['andhra_pradesh'] = [
  {
    'id': 'S-AP-1',
    'name': 'Andhra University Indoor Stadium Relief Complex',
    'taluk': 'Visakhapatnam East Mandal',
    'district': 'Visakhapatnam & Anakapalle',
    'state': 'Andhra Pradesh',
    'lat': 17.7280,
    'lng': 83.3220,
    'usable_area_sqm': 8500,
    'beds': 3200,
    'water_liters': 190000,
    'ration_packets': 14000,
    'toilets_count': 120,
    'medical_staff_count': 45,
    'effective_capacity': 3200,
    'current_occupancy': 2800,
    'bottleneck_resource': 'Beds'
  },
  {
    'id': 'S-AP-2',
    'name': 'Anakapalle Govt Polytechnic Emergency Centre',
    'taluk': 'Anakapalle Urban Mandal',
    'district': 'Visakhapatnam & Anakapalle',
    'state': 'Andhra Pradesh',
    'lat': 17.6950,
    'lng': 83.0250,
    'usable_area_sqm': 7000,
    'beds': 2600,
    'water_liters': 150000,
    'ration_packets': 11000,
    'toilets_count': 95,
    'medical_staff_count': 35,
    'effective_capacity': 2600,
    'current_occupancy': 0,
    'bottleneck_resource': 'Sanitation'
  }
]

DISTRICT_RESETTLEMENT['andhra_pradesh'] = [
  {
    'id': 'RS-AP-1',
    'name': 'Pendurthi Safe Tableland Township',
    'lat': 17.8350,
    'lng': 83.2050,
    'available_land_sqm': 500000,
    'slope_degrees': 3.8,
    'carrying_capacity_population': 8000,
    'suitability_score': 95.2,
    'survey_nos': 'Sy. Nos. 142/3, 145/1, 148/B (Pendurthi Revenue Circle)',
    'taluk': 'Pendurthi Mandal / Visakhapatnam Revenue Division',
    'water_table_depth_m': 18.5,
    'planned_houses': 1900,
    'civic_amenities': [
      '30-Bed Sub-District Hospital & Trauma Care Unit',
      'AP Model Higher Secondary School & Anganwadi',
      'GVMC 2.5 MLD RO Water Treatment Plant',
      'Stormwater Drainage & Paved Arterial Road Grid',
      '33/11kV Dedicated Electrical Feeder Substation'
    ],
    'target_population': 'Visakhapatnam Fishing Harbour & Anakapalle River Basin Displaced Families',
    'status': 'Cadastral Survey Approved & Collector Sanction Issued under DM Act'
  }
]

# --- Curated benchmark datasets for WAYANAD (Kerala) ---
DISTRICT_HABITATIONS['kerala'] = [
  { 'id': 'H1', 'name': 'Meppadi Hill Hamlet', 'taluk': 'Vythiri (Meppadi Village)', 'district': 'Wayanad & Idukki', 'state': 'Kerala', 'lat': 11.5542, 'lng': 76.1265, 'population': 1200, 'elderly_count': 210, 'infant_count': 145, 'pwd_count': 38, 'kutcha_houses': 220, 'slope_degrees': 38.5, 'elevation_m': 920.0, 'river_distance_m': 180.0, 'terrain_description': 'Upper Slope Plantation Hamlet (180m from seasonal stream)', 'historical_disaster_count': 4, 'zone': 'RED', 'hazard_score': 0.74, 'factor_of_safety': 1.12, 'sovi_score': 0.58, 'priority_score': 0.98 },
  { 'id': 'H2', 'name': 'Chooralmala Valley Colony', 'taluk': 'Vythiri (Chooralmala Village)', 'district': 'Wayanad & Idukki', 'state': 'Kerala', 'lat': 11.5410, 'lng': 76.1550, 'population': 1850, 'elderly_count': 320, 'infant_count': 210, 'pwd_count': 65, 'kutcha_houses': 410, 'slope_degrees': 34.0, 'elevation_m': 840.0, 'river_distance_m': 60.0, 'terrain_description': 'Valley Floor Residential Colony (60m from Chaliyar bank)', 'historical_disaster_count': 5, 'zone': 'RED', 'hazard_score': 0.78, 'factor_of_safety': 1.05, 'sovi_score': 0.62, 'priority_score': 1.04 },
  { 'id': 'H3', 'name': 'Mundakkai Riverside Settlement', 'taluk': 'Vythiri (Mundakkai Village)', 'district': 'Wayanad & Idukki', 'state': 'Kerala', 'lat': 11.5305, 'lng': 76.1680, 'population': 950, 'elderly_count': 160, 'infant_count': 90, 'pwd_count': 29, 'kutcha_houses': 190, 'slope_degrees': 42.0, 'elevation_m': 980.0, 'river_distance_m': 45.0, 'terrain_description': 'Steep Ridge Hamlet (45m from debris flow path)', 'historical_disaster_count': 6, 'zone': 'RED', 'hazard_score': 0.82, 'factor_of_safety': 0.98, 'sovi_score': 0.56, 'priority_score': 1.08 },
  { 'id': 'H4', 'name': 'Vellarmala Tea Plantation Ward', 'taluk': 'Vythiri (Vellarmala Village)', 'district': 'Wayanad & Idukki', 'state': 'Kerala', 'lat': 11.5200, 'lng': 76.1820, 'population': 1400, 'elderly_count': 240, 'infant_count': 130, 'pwd_count': 45, 'kutcha_houses': 290, 'slope_degrees': 36.0, 'elevation_m': 1050.0, 'river_distance_m': 320.0, 'terrain_description': 'Tea Plantation Slopes (320m above water line)', 'historical_disaster_count': 3, 'zone': 'ORANGE', 'hazard_score': 0.58, 'factor_of_safety': 1.28, 'sovi_score': 0.52, 'priority_score': 0.74 },
  { 'id': 'H5', 'name': 'Vythiri Ridge Village', 'taluk': 'Vythiri Central', 'district': 'Wayanad & Idukki', 'state': 'Kerala', 'lat': 11.5520, 'lng': 76.0420, 'population': 1600, 'elderly_count': 190, 'infant_count': 150, 'pwd_count': 30, 'kutcha_houses': 150, 'slope_degrees': 26.5, 'elevation_m': 710.0, 'river_distance_m': 450.0, 'terrain_description': 'Ghat Ridge Settlement (450m from valley stream)', 'historical_disaster_count': 2, 'zone': 'ORANGE', 'hazard_score': 0.49, 'factor_of_safety': 1.55, 'sovi_score': 0.44, 'priority_score': 0.61 },
  { 'id': 'H6', 'name': 'Kalpetta Foothill Basti', 'taluk': 'Kalpetta Municipality', 'district': 'Wayanad & Idukki', 'state': 'Kerala', 'lat': 11.6080, 'lng': 76.0820, 'population': 2200, 'elderly_count': 260, 'infant_count': 200, 'pwd_count': 40, 'kutcha_houses': 180, 'slope_degrees': 14.0, 'elevation_m': 780.0, 'river_distance_m': 800.0, 'terrain_description': 'Elevated Foothill Town Ward (800m inland)', 'historical_disaster_count': 1, 'zone': 'GREEN', 'hazard_score': 0.28, 'factor_of_safety': 2.30, 'sovi_score': 0.38, 'priority_score': 0.32 }
]

DISTRICT_SHELTERS['kerala'] = [
  { 'id': 'S1', 'name': 'Kalpetta District Multi-Purpose Hall', 'taluk': 'Kalpetta Municipality', 'district': 'Wayanad & Idukki', 'state': 'Kerala', 'lat': 11.6140, 'lng': 76.0890, 'usable_area_sqm': 5600, 'beds': 1600, 'water_liters': 120000, 'ration_packets': 8500, 'toilets_count': 85, 'medical_staff_count': 35, 'effective_capacity': 1600, 'current_occupancy': 1600, 'bottleneck_resource': 'Beds' },
  { 'id': 'S2', 'name': 'Sulthan Bathery Indoor Stadium Camp', 'taluk': 'Sulthan Bathery', 'district': 'Wayanad & Idukki', 'state': 'Kerala', 'lat': 11.6620, 'lng': 76.2580, 'usable_area_sqm': 8200, 'beds': 2300, 'water_liters': 175000, 'ration_packets': 12000, 'toilets_count': 110, 'medical_staff_count': 48, 'effective_capacity': 2200, 'current_occupancy': 0, 'bottleneck_resource': 'Sanitation' },
  { 'id': 'S3', 'name': 'Mananthavady St. Joseph Complex', 'taluk': 'Mananthavady', 'district': 'Wayanad & Idukki', 'state': 'Kerala', 'lat': 11.8020, 'lng': 76.0020, 'usable_area_sqm': 4500, 'beds': 1250, 'water_liters': 95000, 'ration_packets': 6500, 'toilets_count': 65, 'medical_staff_count': 26, 'effective_capacity': 1250, 'current_occupancy': 1250, 'bottleneck_resource': 'Beds' }
]

DISTRICT_RESETTLEMENT['kerala'] = [
  {
    'id': 'RS1',
    'name': 'Kaniyambetta Safe Plateau Township',
    'lat': 11.6850,
    'lng': 76.1240,
    'available_land_sqm': 350000,
    'slope_degrees': 5.2,
    'carrying_capacity_population': 4500,
    'suitability_score': 94.5,
    'survey_nos': 'Sy. Nos. 214/1, 214/2, 215/A',
    'taluk': 'Vythiri (Kaniyambetta Village)',
    'water_table_depth_m': 18.2,
    'planned_houses': 900,
    'civic_amenities': ['Primary Health Centre (30-Bed)', 'Govt LP School & Anganwadi', 'Protected Water Grid (RO)', 'All-Weather Arterial Road', 'Community Disaster Hall'],
    'target_population': 'Chooralmala & Mundakkai Chronic Hazard Evacuees',
    'status': 'Cadastral Survey Approved & Environmental Clearance Granted'
  },
  {
    'id': 'RS2',
    'name': 'Kenichira High-Tableland Resettlement Park',
    'lat': 11.7120,
    'lng': 76.2050,
    'available_land_sqm': 280000,
    'slope_degrees': 6.8,
    'carrying_capacity_population': 3600,
    'suitability_score': 91.0,
    'survey_nos': 'Sy. Nos. 108/3, 109, 112/1',
    'taluk': 'Sulthan Bathery (Kenichira Village)',
    'water_table_depth_m': 22.5,
    'planned_houses': 720,
    'civic_amenities': ['24x7 Emergency Clinic', 'Govt High School', 'Piped Water Grid', 'Solar Microgrid 500kW', 'Concrete Approach Arterial Road'],
    'target_population': 'Vellarmala & Meppadi Hill Displaced Communities',
    'status': 'Master Plan Prepared (Town & Country Planning Dept)'
  }
]


# --- Curated High-Accuracy Benchmark Data for DELHI (Yamuna Floodplain Corridor) ---
DISTRICT_HABITATIONS['delhi'] = [
  {
    'id': 'DEL-H1',
    'name': 'Kashmere Gate Monastery & Yamuna Basti',
    'taluk': 'Civil Lines Sub-Division',
    'district': 'North Delhi District',
    'state': 'Delhi (NCT)',
    'lat': 28.6690,
    'lng': 77.2340,
    'population': 2850,
    'elderly_count': 380,
    'infant_count': 310,
    'pwd_count': 95,
    'kutcha_houses': 1120,
    'slope_degrees': 1.8,
    'elevation_m': 204.0,
    'river_distance_m': 45.0,
    'coastal_distance_m': 1200000.0,
    'terrain_description': 'Low-Lying Active Floodplain (45m from Riverbank / Ring Road Bund)',
    'historical_disaster_count': 5,
    'zone': 'RED',
    'hazard_score': 0.88,
    'factor_of_safety': 0.82,
    'sovi_score': 0.65,
    'priority_score': 1.22
  },
  {
    'id': 'DEL-H2',
    'name': 'Yamuna Bazar & Nigambodh Lowland Settlement',
    'taluk': 'Kotwali Sub-Division',
    'district': 'Central Delhi District',
    'state': 'Delhi (NCT)',
    'lat': 28.6580,
    'lng': 77.2410,
    'population': 2400,
    'elderly_count': 320,
    'infant_count': 260,
    'pwd_count': 78,
    'kutcha_houses': 940,
    'slope_degrees': 2.0,
    'elevation_m': 205.0,
    'river_distance_m': 80.0,
    'coastal_distance_m': 1200000.0,
    'terrain_description': 'Inundation Ingress Basin (80m from Nigambodh Drain Sluice Gate)',
    'historical_disaster_count': 4,
    'zone': 'RED',
    'hazard_score': 0.84,
    'factor_of_safety': 0.89,
    'sovi_score': 0.62,
    'priority_score': 1.15
  },
  {
    'id': 'DEL-H3',
    'name': 'Geeta Colony Khadar & Old Iron Bridge Enclave',
    'taluk': 'Preet Vihar Sub-Division',
    'district': 'East Delhi District',
    'state': 'Delhi (NCT)',
    'lat': 28.6470,
    'lng': 77.2580,
    'population': 2150,
    'elderly_count': 280,
    'infant_count': 230,
    'pwd_count': 65,
    'kutcha_houses': 820,
    'slope_degrees': 1.5,
    'elevation_m': 203.0,
    'river_distance_m': 60.0,
    'coastal_distance_m': 1200000.0,
    'terrain_description': 'Riparian Khadar Silt Flats (60m from Old Iron Bridge Pillar)',
    'historical_disaster_count': 4,
    'zone': 'RED',
    'hazard_score': 0.82,
    'factor_of_safety': 0.91,
    'sovi_score': 0.60,
    'priority_score': 1.11
  },
  {
    'id': 'DEL-H4',
    'name': 'Mayur Vihar Phase-1 Yamuna Bank Basti',
    'taluk': 'Mayur Vihar Sub-Division',
    'district': 'East Delhi District',
    'state': 'Delhi (NCT)',
    'lat': 28.6080,
    'lng': 77.2920,
    'population': 1900,
    'elderly_count': 240,
    'infant_count': 200,
    'pwd_count': 55,
    'kutcha_houses': 750,
    'slope_degrees': 1.9,
    'elevation_m': 206.0,
    'river_distance_m': 110.0,
    'coastal_distance_m': 1200000.0,
    'terrain_description': 'Backwater Swamp Zone (110m from Noida Link Embankment)',
    'historical_disaster_count': 3,
    'zone': 'ORANGE',
    'hazard_score': 0.68,
    'factor_of_safety': 1.05,
    'sovi_score': 0.58,
    'priority_score': 0.92
  }
]

DISTRICT_SHELTERS['delhi'] = [
  {
    'id': 'S-DEL-1',
    'name': 'Indira Gandhi Indoor Stadium Disaster Relief Complex',
    'taluk': 'Kotwali Sub-Division',
    'district': 'Central Delhi District',
    'state': 'Delhi (NCT)',
    'lat': 28.6290,
    'lng': 77.2480,
    'usable_area_sqm': 9500,
    'beds': 4200,
    'water_liters': 220000,
    'ration_packets': 15000,
    'toilets_count': 140,
    'medical_staff_count': 55,
    'effective_capacity': 4200,
    'current_occupancy': 0,
    'bottleneck_resource': 'Beds'
  },
  {
    'id': 'S-DEL-2',
    'name': 'Thyagaraj Indoor Sports Disaster Relief Hub',
    'taluk': 'Chanakyapuri Sub-Division',
    'district': 'South Delhi District',
    'state': 'Delhi (NCT)',
    'lat': 28.5770,
    'lng': 77.2150,
    'usable_area_sqm': 8000,
    'beds': 3500,
    'water_liters': 180000,
    'ration_packets': 12000,
    'toilets_count': 120,
    'medical_staff_count': 45,
    'effective_capacity': 3500,
    'current_occupancy': 0,
    'bottleneck_resource': 'Sanitation'
  },
  {
    'id': 'S-DEL-3',
    'name': 'Chhatrasal Stadium Disaster Transit Center',
    'taluk': 'Model Town Sub-Division',
    'district': 'North Delhi District',
    'state': 'Delhi (NCT)',
    'lat': 28.7080,
    'lng': 77.1890,
    'usable_area_sqm': 7500,
    'beds': 3200,
    'water_liters': 160000,
    'ration_packets': 11000,
    'toilets_count': 100,
    'medical_staff_count': 40,
    'effective_capacity': 3200,
    'current_occupancy': 0,
    'bottleneck_resource': 'Water Supply'
  }
]

DISTRICT_RESETTLEMENT['delhi'] = [
  {
    'id': 'RS-DEL-1',
    'name': 'Narela-Alipur Safe Tableland Township (Sector G-2)',
    'lat': 28.8450,
    'lng': 77.1020,
    'available_land_sqm': 480000,
    'slope_degrees': 1.2,
    'carrying_capacity_population': 7500,
    'suitability_score': 96.5,
    'survey_nos': 'DDA Urban Land Sy. Nos. 112/4, 114/2, 116/A',
    'taluk': 'Alipur Sub-Division',
    'water_table_depth_m': 18.5,
    'planned_houses': 2000,
    'civic_amenities': [
      'Emergency Trauma Hospital (100-Bed)',
      'Safe Elevated Piped Water Supply (DJB RO Network)',
      'Govt Sarvodaya Model Vidyalaya & Anganwadi',
      'Paved Arterial Highway Bypass Link to NH-44',
      'Dedicated 33kV Substation & Solar Microgrid'
    ],
    'target_population': 'Yamuna Khadar High-Velocity Floodplain Relocated Families',
    'status': 'DDA Land Bank Approved & Master Plan 2041 Tableland Resettlement Sanctioned'
  }
]

# --- Curated High-Accuracy Benchmark Data for JAMMU & KASHMIR (Ramban / NH-44) ---
DISTRICT_HABITATIONS['jammu_kashmir'] = [
  {
    'id': 'JAM-H1',
    'name': 'Seri & Cafeteria Morh Landslide Ward',
    'taluk': 'Ramban Sub-Division',
    'district': 'Ramban District',
    'state': 'Jammu & Kashmir',
    'lat': 33.2620,
    'lng': 75.2720,
    'population': 1155,
    'elderly_count': 168,
    'infant_count': 126,
    'pwd_count': 42,
    'kutcha_houses': 462,
    'slope_degrees': 36.5,
    'elevation_m': 950.0,
    'river_distance_m': 180.0,
    'coastal_distance_m': 1400000.0,
    'terrain_description': 'Active Colluvial Slide Slope (NH-44 km 148 Shear Zone)',
    'historical_disaster_count': 5,
    'zone': 'RED',
    'hazard_score': 0.86,
    'factor_of_safety': 0.98,
    'sovi_score': 0.64,
    'priority_score': 1.18
  },
  {
    'id': 'JAM-H2',
    'name': 'Digdol-Khooni Nallah Highway Settlement',
    'taluk': 'Ramsu Tehsil',
    'district': 'Ramban District',
    'state': 'Jammu & Kashmir',
    'lat': 33.2950,
    'lng': 75.2350,
    'population': 945,
    'elderly_count': 126,
    'infant_count': 105,
    'pwd_count': 31,
    'kutcha_houses': 378,
    'slope_degrees': 38.0,
    'elevation_m': 1040.0,
    'river_distance_m': 120.0,
    'coastal_distance_m': 1400000.0,
    'terrain_description': 'High-Angle Rockfall & Rolling Boulder Hazard Chute',
    'historical_disaster_count': 4,
    'zone': 'RED',
    'hazard_score': 0.81,
    'factor_of_safety': 1.02,
    'sovi_score': 0.58,
    'priority_score': 1.05
  },
  {
    'id': 'JAM-H3',
    'name': 'Maitra Chenab Riverbank Lowland Ward',
    'taluk': 'Ramban Sub-Division',
    'district': 'Ramban District',
    'state': 'Jammu & Kashmir',
    'lat': 33.2380,
    'lng': 75.2500,
    'population': 820,
    'elderly_count': 110,
    'infant_count': 92,
    'pwd_count': 28,
    'kutcha_houses': 310,
    'slope_degrees': 18.5,
    'elevation_m': 720.0,
    'river_distance_m': 50.0,
    'coastal_distance_m': 1400000.0,
    'terrain_description': 'Chenab River Fluvial Terraces (Active Toe Erosion)',
    'historical_disaster_count': 3,
    'zone': 'ORANGE',
    'hazard_score': 0.65,
    'factor_of_safety': 1.28,
    'sovi_score': 0.54,
    'priority_score': 0.86
  }
]

DISTRICT_SHELTERS['jammu_kashmir'] = [
  {
    'id': 'S-JAM-1',
    'name': 'Ramban Government Degree College Disaster Shelter',
    'taluk': 'Ramban Sub-Division',
    'district': 'Ramban District',
    'state': 'Jammu & Kashmir',
    'lat': 33.2450,
    'lng': 75.2450,
    'usable_area_sqm': 4800,
    'beds': 1800,
    'water_liters': 85000,
    'ration_packets': 6500,
    'toilets_count': 65,
    'medical_staff_count': 28,
    'effective_capacity': 1800,
    'current_occupancy': 0,
    'bottleneck_resource': 'Beds'
  },
  {
    'id': 'S-JAM-2',
    'name': 'Banihal Community Infrastructure Relief Centre',
    'taluk': 'Banihal Sub-Division',
    'district': 'Ramban District',
    'state': 'Jammu & Kashmir',
    'lat': 33.4250,
    'lng': 75.1950,
    'usable_area_sqm': 5200,
    'beds': 2100,
    'water_liters': 95000,
    'ration_packets': 7200,
    'toilets_count': 75,
    'medical_staff_count': 32,
    'effective_capacity': 2100,
    'current_occupancy': 0,
    'bottleneck_resource': 'Medical Staff'
  }
]

DISTRICT_RESETTLEMENT['jammu_kashmir'] = [
  {
    'id': 'RS-JAM-1',
    'name': 'Chanderkote Stable Tableland Township (Chenab Valley Safe Terrace)',
    'lat': 33.2080,
    'lng': 75.3120,
    'available_land_sqm': 260000,
    'slope_degrees': 4.2,
    'carrying_capacity_population': 4200,
    'suitability_score': 93.8,
    'survey_nos': 'Sy. Nos. CHK-REV-42/1, 45/B',
    'taluk': 'Chanderkote Sub-Division',
    'water_table_depth_m': 22.0,
    'planned_houses': 950,
    'civic_amenities': [
      'Sub-District Hospital (30-Bed)',
      'Piped Spring Water Filtration Plant',
      'Govt Higher Secondary School',
      'All-Weather Metalled Link Road to NH-44',
      'Dedicated 11kV Feeder & Disaster Telemetry Tower'
    ],
    'target_population': 'NH-44 Active Landslide & Debris Flow Evacuated Families',
    'status': 'Cadastral Survey Approved & J&K Revenue Dept Tableland Notified'
  }
]

# --- Curated High-Accuracy Benchmark Data for ANDAMAN & NICOBAR (Port Blair Coastal Zone) ---
DISTRICT_HABITATIONS['andaman_nicobar'] = [
  {
    'id': 'AND-H1',
    'name': 'Haddo Lowland Coastal Ward',
    'taluk': 'Port Blair Tehsil',
    'district': 'South Andaman District',
    'state': 'Andaman & Nicobar (UT)',
    'lat': 11.6750,
    'lng': 92.7310,
    'population': 1870,
    'elderly_count': 272,
    'infant_count': 204,
    'pwd_count': 68,
    'kutcha_houses': 748,
    'slope_degrees': 2.5,
    'elevation_m': 4.5,
    'river_distance_m': 40.0,
    'coastal_distance_m': 120.0,
    'terrain_description': 'Low-Lying Tidal Creek Embankment (Direct Cyclone Ingress)',
    'historical_disaster_count': 5,
    'zone': 'RED',
    'hazard_score': 0.85,
    'factor_of_safety': 0.88,
    'sovi_score': 0.64,
    'priority_score': 1.18
  },
  {
    'id': 'AND-H2',
    'name': 'Junglighat Inundation Corridor',
    'taluk': 'Port Blair Tehsil',
    'district': 'South Andaman District',
    'state': 'Andaman & Nicobar (UT)',
    'lat': 11.6490,
    'lng': 92.7240,
    'population': 1530,
    'elderly_count': 204,
    'infant_count': 170,
    'pwd_count': 51,
    'kutcha_houses': 612,
    'slope_degrees': 3.0,
    'elevation_m': 6.0,
    'river_distance_m': 75.0,
    'coastal_distance_m': 250.0,
    'terrain_description': 'Inter-Tidal Estuarine Settlement (Subject to 2.5m Storm Surge)',
    'historical_disaster_count': 4,
    'zone': 'RED',
    'hazard_score': 0.79,
    'factor_of_safety': 0.94,
    'sovi_score': 0.58,
    'priority_score': 1.06
  }
]

DISTRICT_SHELTERS['andaman_nicobar'] = [
  {
    'id': 'S-AND-1',
    'name': 'Netaji Stadium Disaster Shelter Complex',
    'taluk': 'Port Blair Tehsil',
    'district': 'South Andaman District',
    'state': 'Andaman & Nicobar (UT)',
    'lat': 11.6660,
    'lng': 92.7440,
    'usable_area_sqm': 5800,
    'beds': 2400,
    'water_liters': 120000,
    'ration_packets': 8500,
    'toilets_count': 80,
    'medical_staff_count': 30,
    'effective_capacity': 2400,
    'current_occupancy': 0,
    'bottleneck_resource': 'Beds'
  },
  {
    'id': 'S-AND-2',
    'name': 'JNRM College Multipurpose Cyclone Shelter',
    'taluk': 'Port Blair Tehsil',
    'district': 'South Andaman District',
    'state': 'Andaman & Nicobar (UT)',
    'lat': 11.6520,
    'lng': 92.7380,
    'usable_area_sqm': 4500,
    'beds': 1900,
    'water_liters': 95000,
    'ration_packets': 7000,
    'toilets_count': 65,
    'medical_staff_count': 25,
    'effective_capacity': 1900,
    'current_occupancy': 0,
    'bottleneck_resource': 'Water Supply'
  }
]

DISTRICT_RESETTLEMENT['andaman_nicobar'] = [
  {
    'id': 'RS-AND-1',
    'name': 'Prothrapur-Garacharma Elevated Tableland Township',
    'lat': 11.6180,
    'lng': 92.7150,
    'available_land_sqm': 320000,
    'slope_degrees': 3.8,
    'carrying_capacity_population': 4800,
    'suitability_score': 95.2,
    'survey_nos': 'Sy. Nos. GAR-108/2, 110/A',
    'taluk': 'Port Blair Revenue Division',
    'water_table_depth_m': 12.0,
    'planned_houses': 1100,
    'civic_amenities': [
      'Community Health Centre (24x7)',
      'Rainwater Harvesting Reservoir & RO Plant',
      'Model Island Secondary School',
      'Reinforced Coastal Access Highway Link',
      'Solar Microgrid with Battery Storage'
    ],
    'target_population': 'Coastal Surge & Tidal Breach Vulnerable Families',
    'status': 'UT Administration Approved Tableland Land Bank'
  }
]

# --- Curated High-Accuracy Benchmark Data for CHANDIGARH (Sukhna Catchment) ---
DISTRICT_HABITATIONS['chandigarh'] = [
  {
    'id': 'CHA-H1',
    'name': 'Kaimbwala Sukhna Choe Lowland Settlement',
    'taluk': 'Chandigarh Urban Sub-Division',
    'district': 'Chandigarh UT',
    'state': 'Chandigarh (UT)',
    'lat': 30.7650,
    'lng': 76.8180,
    'population': 850,
    'elderly_count': 110,
    'infant_count': 95,
    'pwd_count': 28,
    'kutcha_houses': 320,
    'slope_degrees': 2.2,
    'elevation_m': 320.0,
    'river_distance_m': 45.0,
    'coastal_distance_m': 1100000.0,
    'terrain_description': 'Catchment Ingress Basin (45m from Sukhna Choe Inflow)',
    'historical_disaster_count': 4,
    'zone': 'ORANGE',
    'hazard_score': 0.62,
    'factor_of_safety': 1.18,
    'sovi_score': 0.58,
    'priority_score': 0.82
  },
  {
    'id': 'CHA-H2',
    'name': 'Bapu Dham Catchment Basin Settlement',
    'taluk': 'Chandigarh East Circle',
    'district': 'Chandigarh UT',
    'state': 'Chandigarh (UT)',
    'lat': 30.7250,
    'lng': 76.7980,
    'population': 720,
    'elderly_count': 92,
    'infant_count': 78,
    'pwd_count': 22,
    'kutcha_houses': 280,
    'slope_degrees': 1.6,
    'elevation_m': 315.0,
    'river_distance_m': 85.0,
    'coastal_distance_m': 1100000.0,
    'terrain_description': 'Depression Drainage Node (Subject to Silt Accumulation)',
    'historical_disaster_count': 3,
    'zone': 'ORANGE',
    'hazard_score': 0.55,
    'factor_of_safety': 1.25,
    'sovi_score': 0.54,
    'priority_score': 0.72
  }
]

DISTRICT_SHELTERS['chandigarh'] = [
  {
    'id': 'S-CHA-1',
    'name': 'Sector 42 Sports Complex Relief Center',
    'taluk': 'Chandigarh Urban Sub-Division',
    'district': 'Chandigarh UT',
    'state': 'Chandigarh (UT)',
    'lat': 30.7310,
    'lng': 76.7450,
    'usable_area_sqm': 5000,
    'beds': 2000,
    'water_liters': 100000,
    'ration_packets': 7500,
    'toilets_count': 70,
    'medical_staff_count': 26,
    'effective_capacity': 2000,
    'current_occupancy': 0,
    'bottleneck_resource': 'Beds'
  },
  {
    'id': 'S-CHA-2',
    'name': 'Sector 10 Multipurpose Disaster Hall',
    'taluk': 'Chandigarh East Circle',
    'district': 'Chandigarh UT',
    'state': 'Chandigarh (UT)',
    'lat': 30.7550,
    'lng': 76.7820,
    'usable_area_sqm': 4200,
    'beds': 1600,
    'water_liters': 80000,
    'ration_packets': 6000,
    'toilets_count': 55,
    'medical_staff_count': 22,
    'effective_capacity': 1600,
    'current_occupancy': 0,
    'bottleneck_resource': 'Sanitation'
  }
]

DISTRICT_RESETTLEMENT['chandigarh'] = [
  {
    'id': 'RS-CHA-1',
    'name': 'Maloya Elevated Planned Township (Sector 38 West Extension)',
    'lat': 30.7180,
    'lng': 76.7210,
    'available_land_sqm': 220000,
    'slope_degrees': 1.1,
    'carrying_capacity_population': 3500,
    'suitability_score': 96.0,
    'survey_nos': 'Sy. Nos. CHD-MAL-82/1, 84/C',
    'taluk': 'Chandigarh West Division',
    'water_table_depth_m': 15.0,
    'planned_houses': 800,
    'civic_amenities': [
      'Civil Dispensary & Emergency Clinic',
      'Municipal Elevated Piped Water Supply',
      'Government Model High School',
      'All-Weather Dual-Carriageway Link',
      'Underground Drainage & Grid Power'
    ],
    'target_population': 'Sukhna Catchment Lowland Flood Prone Habitations',
    'status': 'Chandigarh Master Plan 2031 Notified Land Parcel'
  }
]

# --- Curated High-Accuracy Benchmark Data for DAMAN & DIU (Daman Ganga Estuary) ---
DISTRICT_HABITATIONS['daman_diu'] = [
  {
    'id': 'DAM-H1',
    'name': 'Moti Daman Coastal Fishing Ward',
    'taluk': 'Daman Sub-Division',
    'district': 'Daman District',
    'state': 'D&NH and D&D (UT)',
    'lat': 20.4080,
    'lng': 72.8350,
    'population': 1150,
    'elderly_count': 160,
    'infant_count': 125,
    'pwd_count': 38,
    'kutcha_houses': 480,
    'slope_degrees': 1.5,
    'elevation_m': 3.8,
    'river_distance_m': 50.0,
    'coastal_distance_m': 180.0,
    'terrain_description': 'Estuarine Lowland Strip (Subject to High Tide Overwash)',
    'historical_disaster_count': 5,
    'zone': 'RED',
    'hazard_score': 0.83,
    'factor_of_safety': 0.90,
    'sovi_score': 0.63,
    'priority_score': 1.14
  },
  {
    'id': 'DAM-H2',
    'name': 'Nani Daman Daman Ganga Riverfront Basti',
    'taluk': 'Daman Sub-Division',
    'district': 'Daman District',
    'state': 'D&NH and D&D (UT)',
    'lat': 20.4220,
    'lng': 72.8420,
    'population': 980,
    'elderly_count': 130,
    'infant_count': 105,
    'pwd_count': 32,
    'kutcha_houses': 410,
    'slope_degrees': 1.8,
    'elevation_m': 4.5,
    'river_distance_m': 60.0,
    'coastal_distance_m': 450.0,
    'terrain_description': 'Tidal Riverbank (Downstream Madhuban Dam Release Impact)',
    'historical_disaster_count': 4,
    'zone': 'RED',
    'hazard_score': 0.78,
    'factor_of_safety': 0.96,
    'sovi_score': 0.59,
    'priority_score': 1.05
  }
]

DISTRICT_SHELTERS['daman_diu'] = [
  {
    'id': 'S-DAM-1',
    'name': 'Daman Government Polytechnic Relief Center',
    'taluk': 'Daman Sub-Division',
    'district': 'Daman District',
    'state': 'D&NH and D&D (UT)',
    'lat': 20.4150,
    'lng': 72.8550,
    'usable_area_sqm': 4500,
    'beds': 1800,
    'water_liters': 90000,
    'ration_packets': 6500,
    'toilets_count': 60,
    'medical_staff_count': 24,
    'effective_capacity': 1800,
    'current_occupancy': 0,
    'bottleneck_resource': 'Beds'
  },
  {
    'id': 'S-DAM-2',
    'name': 'Diu Multipurpose Cyclone Shelter',
    'taluk': 'Diu Collectorate Circle',
    'district': 'Diu District',
    'state': 'D&NH and D&D (UT)',
    'lat': 20.7180,
    'lng': 70.9850,
    'usable_area_sqm': 3800,
    'beds': 1500,
    'water_liters': 75000,
    'ration_packets': 5500,
    'toilets_count': 50,
    'medical_staff_count': 20,
    'effective_capacity': 1500,
    'current_occupancy': 0,
    'bottleneck_resource': 'Medical Staff'
  }
]

DISTRICT_RESETTLEMENT['daman_diu'] = [
  {
    'id': 'RS-DAM-1',
    'name': 'Kachigam High-Elevation Township',
    'lat': 20.3950,
    'lng': 72.8850,
    'available_land_sqm': 250000,
    'slope_degrees': 2.2,
    'carrying_capacity_population': 3800,
    'suitability_score': 94.5,
    'survey_nos': 'Sy. Nos. KAC-REV-52/1, 55/A',
    'taluk': 'Daman Revenue Division',
    'water_table_depth_m': 16.0,
    'planned_houses': 900,
    'civic_amenities': [
      'Sub-District Health Centre',
      'Elevated Desalination & Piped Drinking Water Network',
      'Government Secondary School',
      'Paved Arterial Highway Connect to NH-848B',
      'Dedicated Power Substation'
    ],
    'target_population': 'Coastal Inundation & High Tide Impacted Families',
    'status': 'Collector Sanctioned Land Bank for Climate Resettlement'
  }
]

# Backward compatibility alias keys
aliases = {
  'wayanad': 'kerala', 'chamoli': 'uttarakhand', 'puri': 'odisha', 'kullu': 'himachal',
  'majuli': 'assam', 'bihar_kosi': 'bihar', 'maharashtra_raigad': 'maharashtra',
  'tamilnadu_nilgiris': 'tamil_nadu', 'bengal_sundarbans': 'west_bengal',
  'andhra_vizag': 'andhra_pradesh', 'gujarat_kutch': 'gujarat', 'jk_ramban': 'jammu_kashmir'
}
for alias, real_key in aliases.items():
  DISTRICT_HABITATIONS[alias] = DISTRICT_HABITATIONS[real_key]
  DISTRICT_SHELTERS[alias] = DISTRICT_SHELTERS[real_key]
  DISTRICT_RESETTLEMENT[alias] = DISTRICT_RESETTLEMENT[real_key]

# Pan-India Aggregated Overview Set
DISTRICT_HABITATIONS['all_india'] = [
  { 'id': 'NAT-01', 'name': 'Chooralmala Valley Colony (Kerala)', 'taluk': 'Vythiri, Wayanad (Kerala)', 'district': 'Wayanad, Kerala', 'state': 'Kerala', 'lat': 11.5410, 'lng': 76.1550, 'population': 1850, 'elderly_count': 320, 'infant_count': 210, 'pwd_count': 65, 'kutcha_houses': 410, 'slope_degrees': 34.0, 'elevation_m': 840.0, 'river_distance_m': 60.0, 'terrain_description': 'Valley Floor Settlement (60m from river)', 'historical_disaster_count': 5, 'zone': 'RED', 'hazard_score': 0.78, 'factor_of_safety': 1.05, 'sovi_score': 0.62, 'priority_score': 1.04 },
  { 'id': 'NAT-02', 'name': 'Joshimath Sunil Ward (Uttarakhand)', 'taluk': 'Joshimath, Chamoli (Uttarakhand)', 'district': 'Chamoli, Uttarakhand', 'state': 'Uttarakhand', 'lat': 30.5620, 'lng': 79.5680, 'population': 1450, 'elderly_count': 230, 'infant_count': 150, 'pwd_count': 42, 'kutcha_houses': 280, 'slope_degrees': 37.0, 'elevation_m': 2150.0, 'river_distance_m': 240.0, 'terrain_description': 'Himalayan Ridge Slopes (240m above valley)', 'historical_disaster_count': 4, 'zone': 'RED', 'hazard_score': 0.81, 'factor_of_safety': 1.04, 'sovi_score': 0.64, 'priority_score': 1.05 },
  { 'id': 'NAT-03', 'name': 'Bhadrachalam Ghat Ward (Telangana)', 'taluk': 'Bhadrachalam, Bhadradri (Telangana)', 'district': 'Bhadrachalam, Telangana', 'state': 'Telangana', 'lat': 17.6710, 'lng': 80.8940, 'population': 2530, 'elderly_count': 320, 'infant_count': 210, 'pwd_count': 64, 'kutcha_houses': 540, 'slope_degrees': 2.0, 'elevation_m': 48.0, 'river_distance_m': 65.0, 'terrain_description': 'North Bank Floodplain Levee (65m from Godavari bund)', 'historical_disaster_count': 6, 'zone': 'RED', 'hazard_score': 0.82, 'factor_of_safety': 1.04, 'sovi_score': 0.64, 'priority_score': 1.08 },
  { 'id': 'NAT-04', 'name': 'Salmora Riverbank Ward (Assam)', 'taluk': 'Majuli Sub-Division (Assam)', 'district': 'Majuli, Assam', 'state': 'Assam', 'lat': 26.9150, 'lng': 94.3120, 'population': 2100, 'elderly_count': 290, 'infant_count': 220, 'pwd_count': 55, 'kutcha_houses': 480, 'slope_degrees': 1.0, 'elevation_m': 84.0, 'river_distance_m': 75.0, 'terrain_description': 'Brahmaputra Bank Hamlet (75m from bund)', 'historical_disaster_count': 7, 'zone': 'RED', 'hazard_score': 0.86, 'factor_of_safety': 0.92, 'sovi_score': 0.69, 'priority_score': 1.12 },
  { 'id': 'NAT-05', 'name': 'Supaul East Embankment (Bihar)', 'taluk': 'Supaul Sadar (Bihar)', 'district': 'Supaul, Bihar', 'state': 'Bihar', 'lat': 26.1280, 'lng': 86.6080, 'population': 2800, 'elderly_count': 350, 'infant_count': 290, 'pwd_count': 72, 'kutcha_houses': 590, 'slope_degrees': 0.8, 'elevation_m': 48.0, 'river_distance_m': 80.0, 'terrain_description': 'Kosi East Floodplain Ward (80m from levee)', 'historical_disaster_count': 8, 'zone': 'RED', 'hazard_score': 0.88, 'factor_of_safety': 0.88, 'sovi_score': 0.72, 'priority_score': 1.15 },
  { 'id': 'NAT-06', 'name': 'Astaranga Fisher Colony (Odisha)', 'taluk': 'Kakatpur / Astaranga (Odisha)', 'district': 'Puri, Odisha', 'state': 'Odisha', 'lat': 19.9820, 'lng': 86.2750, 'population': 2400, 'elderly_count': 340, 'infant_count': 260, 'pwd_count': 68, 'kutcha_houses': 520, 'slope_degrees': 2.0, 'elevation_m': 3.5, 'river_distance_m': 110.0, 'terrain_description': 'Coastal Dune Hamlet (110m from high tide mark)', 'historical_disaster_count': 6, 'zone': 'RED', 'hazard_score': 0.82, 'factor_of_safety': 1.15, 'sovi_score': 0.68, 'priority_score': 1.08 },
  { 'id': 'NAT-07', 'name': 'Taliye Hillside Village (Maharashtra)', 'taluk': 'Mahad, Raigad (Maharashtra)', 'district': 'Raigad, Maharashtra', 'state': 'Maharashtra', 'lat': 18.2150, 'lng': 73.4850, 'population': 1950, 'elderly_count': 260, 'infant_count': 180, 'pwd_count': 48, 'kutcha_houses': 340, 'slope_degrees': 36.5, 'elevation_m': 420.0, 'river_distance_m': 150.0, 'terrain_description': 'Konkan Ghat Foothill Hamlet (150m from stream)', 'historical_disaster_count': 5, 'zone': 'RED', 'hazard_score': 0.83, 'factor_of_safety': 1.01, 'sovi_score': 0.62, 'priority_score': 1.07 },
  { 'id': 'NAT-08', 'name': 'Coonoor Tea Slopes (Tamil Nadu)', 'taluk': 'Coonoor, Nilgiris (Tamil Nadu)', 'district': 'Nilgiris, Tamil Nadu', 'state': 'Tamil Nadu', 'lat': 11.3550, 'lng': 76.7950, 'population': 1500, 'elderly_count': 200, 'infant_count': 140, 'pwd_count': 35, 'kutcha_houses': 240, 'slope_degrees': 35.0, 'elevation_m': 1850.0, 'river_distance_m': 190.0, 'terrain_description': 'Nilgiri Mountain Slope Ward (190m above drainage)', 'historical_disaster_count': 4, 'zone': 'RED', 'hazard_score': 0.77, 'factor_of_safety': 1.08, 'sovi_score': 0.55, 'priority_score': 0.99 },
  { 'id': 'NAT-09', 'name': 'Yamuna Floodplain Ward (Delhi)', 'taluk': 'Civil Lines / Kashmere Gate (Delhi)', 'district': 'Central Delhi, Delhi', 'state': 'Delhi', 'lat': 28.6720, 'lng': 77.2380, 'population': 2200, 'elderly_count': 270, 'infant_count': 210, 'pwd_count': 45, 'kutcha_houses': 460, 'slope_degrees': 0.5, 'elevation_m': 205.0, 'river_distance_m': 90.0, 'terrain_description': 'West Ring Road Floodplain Ward (90m from embankment)', 'historical_disaster_count': 5, 'zone': 'RED', 'hazard_score': 0.81, 'factor_of_safety': 1.02, 'sovi_score': 0.65, 'priority_score': 1.06 },
  { 'id': 'NAT-10', 'name': 'Panthyal Rockfall Basti (J&K)', 'taluk': 'Ramban Sub-Division (J&K)', 'district': 'Ramban, Jammu & Kashmir', 'state': 'Jammu & Kashmir', 'lat': 33.2850, 'lng': 75.1850, 'population': 1400, 'elderly_count': 180, 'infant_count': 130, 'pwd_count': 32, 'kutcha_houses': 250, 'slope_degrees': 42.0, 'elevation_m': 1250.0, 'river_distance_m': 120.0, 'terrain_description': 'NH-44 Mountain Slope Basti (120m from highway)', 'historical_disaster_count': 6, 'zone': 'RED', 'hazard_score': 0.85, 'factor_of_safety': 0.94, 'sovi_score': 0.58, 'priority_score': 1.08 }
]

DISTRICT_SHELTERS['all_india'] = [
  { 'id': 'NAT-S1', 'name': 'National Western Relief Hub (Kalpetta, Kerala)', 'taluk': 'Kalpetta Municipality (Kerala)', 'district': 'Wayanad, Kerala', 'state': 'Kerala', 'lat': 11.6140, 'lng': 76.0890, 'usable_area_sqm': 9500, 'beds': 2800, 'water_liters': 220000, 'ration_packets': 16000, 'toilets_count': 140, 'medical_staff_count': 55, 'effective_capacity': 2800, 'current_occupancy': 1850, 'bottleneck_resource': 'Beds' },
  { 'id': 'NAT-S2', 'name': 'National Northern Relief Hub (Joshimath, Uttarakhand)', 'taluk': 'Joshimath Municipality (Uttarakhand)', 'district': 'Chamoli, Uttarakhand', 'state': 'Uttarakhand', 'lat': 30.5590, 'lng': 79.5750, 'usable_area_sqm': 8500, 'beds': 2400, 'water_liters': 190000, 'ration_packets': 14000, 'toilets_count': 120, 'medical_staff_count': 48, 'effective_capacity': 2400, 'current_occupancy': 1450, 'bottleneck_resource': 'Water' },
  { 'id': 'NAT-S3', 'name': 'National Eastern Relief Hub (Puri, Odisha)', 'taluk': 'Puri Municipality (Odisha)', 'district': 'Puri, Odisha', 'state': 'Odisha', 'lat': 19.8250, 'lng': 85.8450, 'usable_area_sqm': 11000, 'beds': 3200, 'water_liters': 250000, 'ration_packets': 18000, 'toilets_count': 160, 'medical_staff_count': 60, 'effective_capacity': 3200, 'current_occupancy': 2400, 'bottleneck_resource': 'Sanitation' },
  { 'id': 'NAT-S4', 'name': 'National Godavari Delta Hub (Bhadrachalam, Telangana)', 'taluk': 'Bhadrachalam Urban (Telangana)', 'district': 'Bhadrachalam, Telangana', 'state': 'Telangana', 'lat': 17.6760, 'lng': 80.8990, 'usable_area_sqm': 10500, 'beds': 3000, 'water_liters': 240000, 'ration_packets': 17500, 'toilets_count': 150, 'medical_staff_count': 58, 'effective_capacity': 3000, 'current_occupancy': 2530, 'bottleneck_resource': 'Beds' }
]

DISTRICT_RESETTLEMENT['all_india'] = [
  {
    'id': 'NAT-RS1',
    'name': 'Deccan Plateau Permanent Resettlement Park (Telangana)',
    'lat': 17.5950,
    'lng': 80.7100,
    'available_land_sqm': 850000,
    'slope_degrees': 3.2,
    'carrying_capacity_population': 12000,
    'suitability_score': 96.5,
    'survey_nos': 'Sy. Nos. 88/2, 91/1, 94/A (Palwancha Circle)',
    'taluk': 'Palwancha Division, Telangana',
    'water_table_depth_m': 17.8,
    'planned_houses': 2850,
    'civic_amenities': ['50-Bed Sub-Divisional Hospital', 'Mission Bhagiratha Protected Piped Water', 'Multi-Tier School Complex', 'Paved 4-Lane Arterial Connectivity', 'Dedicated 33kV Substation'],
    'target_population': 'Interstate Godavari Basin High-Risk Communities',
    'status': 'National Disaster Mitigation Fund (NDMF) Sanctioned Project'
  },
  {
    'id': 'NAT-RS2',
    'name': 'Western Ghats Tableland Township (Kaniyambetta, Kerala)',
    'lat': 11.6850,
    'lng': 76.1240,
    'available_land_sqm': 450000,
    'slope_degrees': 5.2,
    'carrying_capacity_population': 6500,
    'suitability_score': 94.0,
    'survey_nos': 'Sy. Nos. 214/1, 214/2, 215/A',
    'taluk': 'Vythiri Division, Wayanad, Kerala',
    'water_table_depth_m': 18.2,
    'planned_houses': 1550,
    'civic_amenities': ['Primary Health Centre (30-Bed)', 'Govt LP School & Anganwadi', 'Protected Water Grid (RO)', 'All-Weather Arterial Road', 'Community Disaster Hall'],
    'target_population': 'Western Ghats Debris Flow Affected Families',
    'status': 'State Executive Committee (SEC) Approved & Survey Finalized'
  },
  {
    'id': 'NAT-RS3',
    'name': 'Central Safe Tableland Corridor (Madhya Pradesh)',
    'lat': 22.8000,
    'lng': 77.8500,
    'available_land_sqm': 600000,
    'slope_degrees': 2.8,
    'carrying_capacity_population': 8500,
    'suitability_score': 95.0,
    'survey_nos': 'Sy. Nos. 412/1, 415/3, 418/A',
    'taluk': 'Hoshangabad Division, Madhya Pradesh',
    'water_table_depth_m': 19.5,
    'planned_houses': 2000,
    'civic_amenities': ['Community Health Centre (CHC)', 'Narmada Valley Filtered Water Scheme', 'Senior Secondary Model School', 'Paved Arterial Highway Bypass Link', 'Grid-Connected Solar Plant 1MW'],
    'target_population': 'Central Riverine Floodplain Evacuated Hamlets',
    'status': 'Statutory Land Bank Notified under SDRF/NDRF Guidelines'
  }
]

output = f"""// High-Fidelity Client-Side Fallback Engine
// Multi-Hazard National Decision Support Engine for ResQGrid
// Covers All 28 States and 8 Union Territories of India (36 Entities Total)

export const NATIONAL_HOTSPOTS = {json.dumps(HOTSPOTS, indent=2)};

export const OPERATIONAL_SECTORS = {json.dumps(OPERATIONAL_SECTORS, indent=2)};

export const DISTRICT_HABITATIONS = {json.dumps(DISTRICT_HABITATIONS, indent=2)};

export const DISTRICT_SHELTERS = {json.dumps(DISTRICT_SHELTERS, indent=2)};

export const DISTRICT_RESETTLEMENT = {json.dumps(DISTRICT_RESETTLEMENT, indent=2)};

export const INITIAL_HABITATIONS = DISTRICT_HABITATIONS.all_india;
export const INITIAL_SHELTERS = DISTRICT_SHELTERS.all_india;
export const INITIAL_RESETTLEMENT = DISTRICT_RESETTLEMENT.all_india;

export function getSectorData(sectorKey) {{
  const key = DISTRICT_HABITATIONS[sectorKey] ? sectorKey : 'all_india';
  return {{
    habitations: DISTRICT_HABITATIONS[key] || DISTRICT_HABITATIONS.all_india,
    shelters: DISTRICT_SHELTERS[key] || DISTRICT_SHELTERS.all_india,
    resettlement: DISTRICT_RESETTLEMENT[key] || DISTRICT_RESETTLEMENT.all_india
  }};
}}

export function computeLocalSimulation(rainfall, damDischarge = 12000, soilSaturation = 0.55, baseHabs = INITIAL_HABITATIONS) {{
  const rain = Math.max(0, Number(rainfall) || 0);
  const discharge = Math.max(0, Number(damDischarge) || 0);
  const soilSat = Math.min(1.0, Math.max(0.0, Number(soilSaturation) || 0.5));

  const rainFactor = rain / 120.0;
  const dischargeFactor = Math.min(2.0, discharge / 25000.0);

  return baseHabs.map(h => {{
    const slope = h.slope_degrees || 5.0;
    const slopeFactor = slope / 45.0;
    const historyFactor = Math.min(1.0, (h.historical_disaster_count || 3) / 5.0);
    const riverDist = h.river_distance_m !== undefined ? h.river_distance_m : 500.0;
    const coastalDist = h.coastal_distance_m !== undefined ? h.coastal_distance_m : 50000.0;
    const elevation = h.elevation_m !== undefined ? h.elevation_m : 100.0;

    // 1. Slope Geotechnical Shear Failure Hazard (Steep Hill / Ghat Sectors)
    const slopeHazard = 0.38 * slopeFactor + 0.34 * rainFactor + 0.18 * soilSat + 0.10 * historyFactor;
    const slopeFS = Number(Math.max(0.65, (2.3 - slopeFactor * 1.5 - rainFactor * 0.9 - soilSat * 0.4)).toFixed(2));

    // 2. Riverine / Floodplain Inundation Hazard (Plains, Khadar, Low-elevation river valleys)
    let riverInundationHazard = 0.0;
    if (riverDist < 400.0) {{
      const proxFactor = Math.max(0.1, 1.0 - (riverDist / 400.0));
      riverInundationHazard = (0.35 * proxFactor) + (0.35 * rainFactor) + (0.20 * (dischargeFactor * 0.6)) + (0.10 * historyFactor);
    }}

    // 3. Coastal Storm Surge Hazard (Coastal Corridors)
    let coastalSurgeHazard = 0.0;
    if (coastalDist < 5000.0 && elevation < 25.0) {{
      const coastProx = Math.max(0.1, 1.0 - (coastalDist / 5000.0));
      coastalSurgeHazard = (0.35 * coastProx) + (0.35 * rainFactor) + (0.20 * soilSat) + (0.10 * historyFactor);
    }}

    // 4. Urban Drainage Collapse / Cloudburst Flash Flood
    let flashFloodHazard = 0.0;
    if (rain > 70.0) {{
      flashFloodHazard = (rain / 140.0) * 0.75 + (soilSat * 0.25);
    }}

    // Composite Hazard: maximum governing physical hazard mode
    let compositeHazard = Math.max(slopeHazard, riverInundationHazard, coastalSurgeHazard, flashFloodHazard);
    compositeHazard = Math.min(0.99, Math.max(0.12, Number(compositeHazard.toFixed(3))));

    // Determine Hazard Zone (Compliant with NDMA / GSI / Central Water Commission standards)
    let zone = 'GREEN';
    const isRiverineBreach = (riverDist <= 300.0 && (rain >= 65.0 || discharge >= 25000));
    const isGeotechnicalFailure = (slope >= 20.0 && (slopeFS < 1.25 || rain >= 65.0));
    const isCoastalSurge = (coastalDist <= 3500.0 && elevation <= 15.0 && rain >= 70.0);
    const isExtremeCloudburst = rain >= 85.0;

    if (compositeHazard >= 0.58 || isRiverineBreach || isGeotechnicalFailure || isCoastalSurge || isExtremeCloudburst) {{
      zone = 'RED';
    }} else if (compositeHazard >= 0.35 || rain >= 40.0 || riverDist < 250.0 || slope >= 15.0) {{
      zone = 'ORANGE';
    }}

    // Factor of Safety: for slopes use slopeFS; for floodplains, water-level safety margin (1.0 = bund overtop)
    let effectiveFS = slopeFS;
    if (slope < 12.0) {{
      const inundationSafety = Math.max(0.65, 2.0 - (riverInundationHazard * 1.5) - (rainFactor * 0.5));
      effectiveFS = Number(inundationSafety.toFixed(2));
    }}

    const sovi = h.sovi_score || 0.5;
    const priority = Number((compositeHazard * (1.0 + 0.6 * sovi)).toFixed(3));

    return {{
      ...h,
      hazard_score: compositeHazard,
      zone,
      factor_of_safety: effectiveFS,
      priority_score: priority
    }};
  }});
}}
"""


with open('frontend/src/services/localEngine.js', 'w', encoding='utf-8') as f:
  f.write(output)

print('Generated frontend/src/services/localEngine.js with 36 States & UTs successfully!')
