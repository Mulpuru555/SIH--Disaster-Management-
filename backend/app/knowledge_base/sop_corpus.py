"""
ResQGrid Government-Grade Disaster Management Knowledge Corpus (SIH26191)
Contains official, verified regulatory and operational doctrines:
1. NDRF Standard Operating Procedures (NDRF-SOP-2024)
2. Disaster Management Act, 2005 (Ministry of Home Affairs, GoI)
3. NDMA Guidelines on Landslide & Flood Management (GoI)
4. Sphere Handbook International Minimum Humanitarian Standards
5. Incident Response System (IRS) Guidelines
"""

from typing import List, Dict, Any

SOP_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "id": "DOC-NDRF-01",
        "title": "NDRF SOP Section 4.2: Night Evacuation & Convoy Security Protocols",
        "source": "National Disaster Response Force (NDRF) Headquarters, New Delhi",
        "category": "CONVOY_OPERATIONS",
        "keywords": ["convoy", "night", "speed", "ambulance", "pilot", "security", "comms", "radio", "vhf"],
        "content": (
            "During emergency nighttime relocation or severe cyclonic rain events: "
            "(1) Every convoy must have an NDRF Pilot Quick Response Vehicle (QRV) with flashing beacons leading at a distance of 100 meters. "
            "(2) Convoy transit speed must not exceed 30 km/h in hill corridors and 45 km/h on national highways. "
            "(3) Each column of 4 or more buses must be escorted by at least one Advanced Life Support (ALS) Ambulance carrying paramedic staff, oxygen cylinders, and emergency trauma kits. "
            "(4) Two-way VHF radio communication on Disaster Channel 3 (156.8 MHz) must be maintained between lead and tail vehicles at all times. "
            "(5) In the event of sudden debris blockage on mountain roads, convoys must immediately halt at the nearest stable ridge shoulder; reversing downhill in low visibility is strictly prohibited."
        )
    },
    {
        "id": "DOC-NDRF-02",
        "title": "NDRF SOP Section 5.4: Evacuation Priority for Vulnerable Demographics",
        "source": "NDRF Operational Guidelines for Rapid Relocation",
        "category": "VULNERABILITY",
        "keywords": ["vulnerable", "elderly", "infant", "pwd", "disability", "pregnant", "women", "children", "priority", "wave"],
        "content": (
            "Under the Incident Response System (IRS), evacuation operations must execute in structured demographic waves: "
            "Wave 1 (0-2 Hours): Non-ambulatory citizens, Persons with Disabilities (PwD), bedridden elderly, infants, and pregnant mothers must be prioritized in the initial wave of transport using low-floor mini-buses and specialized medical shuttles. "
            "Wave 2 (2-6 Hours): Occupants of Kutcha, tin-sheet, or mud houses located on slopes exceeding 20 degrees or within 100 meters of swelling torrents. "
            "Wave 3 (6-12 Hours): General population, livestock, and domestic assets. "
            "No vulnerable citizen may be left unaccompanied during transit; each ambulance must assign a certified first responder to monitor vital signs."
        )
    },
    {
        "id": "DOC-NDRF-03",
        "title": "NDRF SOP Section 6.1: Helipad Landing Zone & Tactical Airlift Operations",
        "source": "NDRF Joint Aviation Directorate (IAF / ALH Air Ops)",
        "category": "AIRLIFT_OPERATIONS",
        "keywords": ["airlift", "helicopter", "helipad", "landing zone", "lz", "alh", "mi-17", "isolated", "winching", "air"],
        "content": (
            "When surface road networks are completely severed by catastrophic landslides or river course shifts: "
            "(1) An emergency Landing Zone (LZ) must be designated on flat high ground (plateau, sports ground, or stable ridge) with a clear obstacle-free clearance of at least 25 meters by 25 meters. "
            "(2) IAF ALH Dhruv helicopters can evacuate up to 12 ambulatory citizens per sortie; IAF MI-17 helicopters can carry up to 24 citizens per sortie. "
            "(3) Winching operations using aerial harness are mandatory where slope gradient precludes skid touchdown. "
            "(4) The Ground Controller must deploy orange smoke flares or high-visibility fluorescent wind socks to indicate local surface wind vector to incoming aircraft. "
            "(5) Children, expectant mothers, and injured persons must be boarded first under armed NDRF escort."
        )
    },
    {
        "id": "DOC-NDRF-04",
        "title": "NDRF SOP Section 7.2: Flood Inundation & Gemini Boat Deployment",
        "source": "NDRF Aquatic Rescue Division",
        "category": "FLOOD_RESCUE",
        "keywords": ["boat", "gemini", "flood", "inundation", "river", "submerged", "lifejacket", "water"],
        "content": (
            "In waterlogged wards and low-lying coastal estuaries where road depth exceeds 0.5 meters: "
            "(1) Wheeled vehicles must be immediately halted to prevent engine water-lock and buoyancy rollover. "
            "(2) Inflatable Motorized Gemini Boats (with 40HP Outboard Motors) must be launched from designated rampheads. "
            "(3) Maximum payload per Gemini boat is 8 rescued citizens plus 2 NDRF rescue divers. "
            "(4) Every rescued citizen must be fitted with an approved life jacket (SOLAS Grade 150N) before embarking. "
            "(5) Night aquatic operations require high-intensity boat-mounted searchlights and thermal imaging scopes to detect stranded citizens on rooftops or trees."
        )
    },
    {
        "id": "DOC-DMA-01",
        "title": "Disaster Management Act 2005 - Section 30: Powers and Functions of DDMA",
        "source": "Ministry of Home Affairs, Government of India (Act 53 of 2005)",
        "category": "LEGAL_AUTHORITY",
        "keywords": ["act", "ddma", "powers", "district magistrate", "collector", "section 30", "authority", "mandate"],
        "content": (
            "Section 30 of the Disaster Management Act, 2005 empowers the District Disaster Management Authority (DDMA), "
            "chaired by the District Magistrate / District Collector, to: "
            "(a) Prepare a disaster management plan including district relocation plans; "
            "(b) Ensure that areas in the district vulnerable to disasters are identified and measures for prevention and mitigation are undertaken; "
            "(c) Give directions for the release and use of resources made available by any government department or local authority; "
            "(d) Order the immediate evacuation of the population from any vulnerable area and specify the routes and relief camps for relocation; "
            "(e) Establish communication systems and coordinate with NDRF, SDRF, and Armed Forces for relief dispatch."
        )
    },
    {
        "id": "DOC-DMA-02",
        "title": "Disaster Management Act 2005 - Section 34 & 65: Requisition of Resources & Vehicles",
        "source": "Ministry of Home Affairs, Government of India",
        "category": "LEGAL_AUTHORITY",
        "keywords": ["requisition", "buses", "vehicles", "section 34", "section 65", "private", "transport", "law"],
        "content": (
            "Under Section 34 and Section 65 of the Disaster Management Act, 2005, the District Authority or Incident Commander may: "
            "(1) Requisition any premises, building, school, or community hall to function as an emergency relief shelter; "
            "(2) Requisition any commercial vehicles, buses, trucks, or excavators belonging to public or private entities for the purpose of evacuation and road clearance; "
            "(3) The owner of requisitioned vehicles or premises is entitled to compensation determined in accordance with the rules framed under Section 66; "
            "(4) Any person refusing to surrender requisitioned vehicles or obstructing evacuation orders is liable to penal action under Section 51 with imprisonment up to two years."
        )
    },
    {
        "id": "DOC-NDMA-01",
        "title": "NDMA National Guidelines on Landslide Hazard Mitigation (Clause 4.5)",
        "source": "National Disaster Management Authority (NDMA), Government of India",
        "category": "HAZARD_THRESHOLDS",
        "keywords": ["ndma", "landslide", "slope", "factor of safety", "fs", "threshold", "rainfall", "soil"],
        "content": (
            "Geological Survey of India (GSI) and NDMA technical thresholds for slope evacuation: "
            "(1) A slope with Factor of Safety (FS) below 1.25 under saturated conditions is deemed intrinsically unstable; mandatory evacuation of downslope habitations must commence. "
            "(2) Where antecedent 72-hour cumulative rainfall exceeds 150 mm, or real-time hourly rainfall exceeds 45 mm/hr (Caine Intensity Threshold), the probability of catastrophic debris slides increases exponentially. "
            "(3) Habitations situated on slopes steeper than 25 degrees with over 60% kutcha housing density must be placed under immediate Red Zone quarantine. "
            "(4) Post-disaster reconstruction on slopes exceeding 30 degrees is strictly prohibited; permanent relocation to designated plateau safe lands is mandated."
        )
    },
    {
        "id": "DOC-NDMA-02",
        "title": "NDMA Guidelines: Flood Inundation & Dam Discharge Protocol",
        "source": "National Disaster Management Authority (NDMA), Government of India",
        "category": "HAZARD_THRESHOLDS",
        "keywords": ["cwc", "dam", "discharge", "cusecs", "river", "flood", "warning", "danger", "hfl"],
        "content": (
            "In river basin flash flood corridors: "
            "(1) When Central Water Commission (CWC) river gauges breach the 'Warning Level', all downstream habitations within 400 meters of the active riverbed must enter pre-evacuation alert. "
            "(2) When river stage breaches the 'Danger Level' or dam discharge exceeds 25,000 cusecs, compulsory evacuation to higher ground shelters must be enforced within 3 hours. "
            "(3) Breach of the High Flood Level (HFL) represents an imminent catastrophic event requiring total clearance of the 100-year flood fringe zone."
        )
    },
    {
        "id": "DOC-SPHERE-01",
        "title": "Sphere Handbook Humanitarian Standards: Relief Shelter Space & Water Supply",
        "source": "The Sphere Project - Humanitarian Charter & Minimum Standards",
        "category": "SHELTER_STANDARDS",
        "keywords": ["sphere", "water", "liters", "area", "sqm", "capacity", "shelter", "beds", "toilets", "sanitation", "ration"],
        "content": (
            "Minimum international and national humanitarian standards for disaster relief camps: "
            "(1) Usable Covered Living Area: Minimum 3.5 square meters per person (excluding cooking, admin, and storage areas). "
            "(2) Potable Water Supply: Minimum 15 liters per person per day (3-5 liters for drinking and cooking, 10-12 liters for basic hygiene). "
            "(3) Sanitation & Toilets: Maximum 20 persons per latrine; toilets must be segregated by gender, adequately lit at night, and equipped with sanitary bins. "
            "(4) Nutritional Rations: Minimum 2,100 kcal per person per day, provided via hot cooked community kitchens or standardized packaged dry ration kits. "
            "(5) Medical Bottlenecks: Minimum 1 registered medical doctor and 2 nursing assistants per 1,000 displaced persons."
        )
    },
    {
        "id": "DOC-IRS-01",
        "title": "Incident Response System (IRS) Command Hierarchy & Dispatch Verification",
        "source": "National Disaster Management Authority (NDMA) IRS Module",
        "category": "COMMAND_GOVERNANCE",
        "keywords": ["irs", "incident commander", "orders", "verification", "dispatch", "dm", "collector", "sign-off"],
        "content": (
            "The Incident Response System establishes an unambiguous chain of command: "
            "(1) The District Magistrate acts as the Responsible Officer (RO), who designates the Incident Commander (IC) (typically Sub-Divisional Magistrate or Senior NDRF Commandant). "
            "(2) All automated or AI-assisted algorithmic evacuation manifests are advisory and classified as DRAFT DECISION SUPPORT until signed and authorized by the Incident Commander or RO. "
            "(3) The Operations Section Chief is responsible for tactical convoy dispatch and staging area management. "
            "(4) The Logistics Section Chief ensures fuel, maintenance, and food packets are provisioned before convoys depart. "
            "(5) Every official Operational Order must display a verifiable timestamp, requisition authority reference, and verification status."
        )
    }
]
