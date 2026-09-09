# 📐 ResQGrid: Complete Technical Compendium of Algorithms & Mathematics
**Team BharatBytes | Smart India Hackathon 2026**  
**Problem Statement ID:** `SIH26191`  
**Theme:** Disaster Management | **Category:** Software  

---

## 📑 Table of Contents
1. [Module 1: GeoAI Multi-Hazard Red-Zoning Engine](#module-1-geoai-multi-hazard-red-zoning-engine)
2. [Module 2: Social Vulnerability Index (SoVI) & Habitation Urgency Engine](#module-2-social-vulnerability-index-sovi--habitation-urgency-engine)
3. [Module 3: Dynamic Multi-Resource Shelter Carrying Capacity Model](#module-3-dynamic-multi-resource-shelter-carrying-capacity-model)
4. [Module 4: Capacity-Constrained Relocation Optimizer (MILP with Google OR-Tools)](#module-4-capacity-constrained-relocation-optimizer-milp-with-google-or-tools)
5. [Module 5: Dynamic Network Routing & Road Severance Algorithm](#module-5-dynamic-network-routing--road-severance-algorithm)
6. [Module 6: Explainable AI (SHAP & Game Theoretic Attributions)](#module-6-explainable-ai-shap--game-theoretic-attributions)
7. [Module 7: "What-If" Cascade Disaster Simulation Engine](#module-7-what-if-cascade-disaster-simulation-engine)

---

## Module 1: GeoAI Multi-Hazard Red-Zoning Engine

### 1. Purpose & Why We Use It
Standard disaster warnings rely on static flood/landslide susceptibility maps. During extreme events (e.g. Wayanad 2024, Himachal 2023), rainfall intensity overwhelms static thresholds. We need a **dynamic, physics-informed GeoAI engine** that calculates real-time hazard probabilities at a 30m grid cell resolution.

### 2. Mathematical Formulations

#### A. Infinite Slope Stability Model (Factor of Safety - $FS$)
For slope-instability and landslide triggers:
$$FS_i = \frac{c' + (\gamma \cdot z - \gamma_w \cdot h_w) \cos^2 \beta \cdot \tan \phi'}{\gamma \cdot z \cdot \sin \beta \cdot \cos \beta}$$
* $c'$: Effective soil cohesion ($kN/m^2$)
* $\gamma$: Moist unit weight of soil ($kN/m^3$)
* $\gamma_w$: Unit weight of water ($9.81 \, kN/m^3$)
* $z$: Soil regolith depth ($m$)
* $h_w$: Height of water table / perched saturation level ($m$)
* $\beta$: Slope angle (derived from ISRO Bhuvan / SRTM DEM in degrees)
* $\phi'$: Effective internal friction angle (degrees)
* **Interpretation:** If $FS_i < 1.0$, the slope is in active failure state. If $1.0 \le FS_i < 1.3$, it is critically unstable.

#### B. Cumulative Antecedent Precipitation Index ($API$) & Rainfall Intensity
$$API_t = \sum_{k=0}^{N} k_{decay}^k \cdot P_{t-k} = P_t + k_{decay} \cdot API_{t-1}$$
* $P_t$: Rainfall on day/hour $t$ (from IMD AWS telemetry).
* $k_{decay}$: Soil moisture decay coefficient ($\approx 0.85 - 0.92$).
* **Caine’s Rainfall Threshold Curve:**
  $$I_{crit} = \alpha \cdot D^{-\beta} \quad (\text{e.g., } I = 14.82 \cdot D^{-0.39})$$
  Where $I$ is rainfall intensity ($mm/hr$) and $D$ is duration ($hours$).

#### C. Composite Hazard Risk Score ($H_i$)
$$H_i(t) = \sigma \left( w_1 \cdot \frac{1}{\max(FS_i, 0.1)} + w_2 \cdot \frac{API_t}{API_{crit}} + w_3 \cdot \frac{I(t)}{I_{crit}} + w_4 \cdot \text{InundationDepth}_i \right)$$
Where $\sigma(z) = \frac{1}{1 + e^{-z}}$ scales the hazard score to $[0, 1]$.
* **Red Zone (Immediate Mandatory Evacuation):** $H_i \ge 0.70$
* **Orange Zone (Pre-evacuation Standby):** $0.40 \le H_i < 0.70$
* **Green Zone (Safe / In-situ):** $H_i < 0.40$

---

## Module 2: Social Vulnerability Index (SoVI) & Habitation Urgency Engine

### 1. Purpose & Why We Use It
A village of 500 young healthy adults has a vastly different evacuation time than a village of 500 people with 120 bedridden elderly, 80 infants, and 60% kutcha (mud/thatch) houses. Evacuation order must be prioritized mathematically by **vulnerability and time-to-impact**.

### 2. Mathematical Formulations

#### A. Demographic Vulnerability Score ($V_i$)
$$V_i = \frac{w_e \cdot E_i + w_u \cdot U_i + w_p \cdot PwD_i + w_k \cdot K_i}{\text{Total Population}_i}$$
* $E_i$: Elderly population ($\ge 65$ years, $w_e = 1.2$)
* $U_i$: Under-5 infants ($w_u = 1.3$)
* $PwD_i$: Persons with disabilities ($w_p = 2.0$)
* $K_i$: Residents in kutcha/non-engineered housing ($w_k = 1.1$)

#### B. Time-to-Impact ($TTI_i$) vs Time-to-Evacuate ($TTE_i$)
* $TTI_i$: Time remaining before flood crest or slope failure reaches habitation $i$ (hours).
* $TTE_i = \frac{\text{Population}_i}{\text{Fleet Throughput Rate}} + \text{Transit Time to Nearest Safe Node}$.
* **Urgency Factor ($U_i$):**
  $$U_i = \max \left( 0, \frac{TTE_i - TTI_i}{TTI_i + \epsilon} \right)$$

#### C. Composite Relocation Priority Score ($P_i$)
$$P_i = H_i \cdot \left[ 1 + \alpha V_i + \beta U_i \right]$$
The optimizer sorts and handles habitations with the highest $P_i$ first.

---

## Module 3: Dynamic Multi-Resource Shelter Carrying Capacity Model

### 1. Purpose & Why We Use It
Disasters cause secondary humanitarian disasters when shelters exceed resource carrying capacity. ResQGrid replaces static bed counts with **Leontief Multi-Resource Minimum Bottleneck Tracking** compliant with SPHERE International Humanitarian Standards.

### 2. Mathematical Formulations

#### A. Individual Resource Carrying Capacities
1. **Physical Usable Floor / Bed Space Capacity:**
   $$C_{bed, j} = \left\lfloor \frac{\text{Usable Area}_j \, (m^2)}{3.5 \, m^2/\text{person}} \right\rfloor$$
2. **Potable Drinking & Domestic Water Endurance Capacity ($T_{target} = 5 \text{ days}$):**
   $$C_{water, j}(t) = \left\lfloor \frac{W_{available, j}(t) \, (\text{Liters})}{15 \, \text{Liters/person/day} \times T_{target}} \right\rfloor$$
3. **Caloric Ration Endurance Capacity:**
   $$C_{ration, j}(t) = \left\lfloor \frac{R_{total, j}(t) \, (\text{kcal})}{2100 \, \text{kcal/person/day} \times T_{target}} \right\rfloor$$
4. **Sanitation & Hygiene Threshold:**
   $$C_{san, j} = N_{\text{toilets}, j} \times 20 \, \text{persons/toilet}$$
5. **Medical Staff & Triage Ratio:**
   $$C_{med, j} = N_{\text{medical\_staff}, j} \times 50 \, \text{patients}$$

#### B. Dynamic Effective Carrying Capacity ($C_j(t)$)
$$C_j(t) = \min \Big( C_{bed, j}, \; C_{water, j}(t), \; C_{ration, j}(t), \; C_{san, j}, \; C_{med, j} \Big)$$
If the water supply gets contaminated or delayed, $C_j(t)$ automatically drops, alerting DM to redirect convoys to neighboring hubs.

---

## Module 4: Capacity-Constrained Relocation Optimizer (MILP with Google OR-Tools)

### 1. Purpose & Why We Use It
Heuristic evacuation produces traffic bottlenecks and overwhelmed shelters. We formulate evacuation as a **Mixed-Integer Linear Program (MILP)** solved via Google OR-Tools / CBC / SCIP to achieve a provably optimal, zero-overflow evacuation schedule in $<2$ seconds.

### 2. Mathematical Formulations

#### Sets & Indices
* $I = \{1, 2, \dots, N\}$: Set of vulnerable habitations in Red/Orange zones.
* $J = \{1, 2, \dots, M\}$: Set of safe shelters with non-zero carrying capacity.
* $K = \{1, 2, \dots, K\}$: Set of transport vehicle categories (buses, trucks, ambulances).

#### Decision Variables
* $x_{ij} \ge 0 \in \mathbb{Z}^+$: Number of evacuees moved from habitation $i$ to shelter $j$.
* $y_{ij} \in \{0, 1\}$: Binary variable indicating if evacuation corridor $(i, j)$ is activated.
* $v_{kij} \in \mathbb{Z}^+$: Number of vehicle trips of type $k$ dispatched between $(i, j)$.

#### Objective Function
$$\min Z = \sum_{i \in I} \sum_{j \in J} \left[ x_{ij} \cdot \left( d_{ij} \cdot (1 + \rho \cdot \text{RiskArc}_{ij}) - \lambda \cdot P_i \right) \right] + \sum_{i \in I} \sum_{j \in J} \sum_{k \in K} \text{Cost}_k \cdot v_{kij}$$
* $d_{ij}$: Shortest road distance from $i$ to $j$ ($km$).
* $\text{RiskArc}_{ij}$: Hazard exposure along the corridor.
* $P_i$: Priority score of habitation $i$ (higher priority gets cleared first).
* $\text{Cost}_k$: Fixed fuel/operation cost per vehicle trip.

#### Mathematical Constraints
1. **Total Population Demand Satisfaction (Zero Evacuee Left Behind):**
   $$\sum_{j \in J} x_{ij} = \text{Demand}_i \quad \forall i \in I$$
2. **Strict Multi-Resource Capacity Bound (Zero Shelter Overflow):**
   $$\sum_{i \in I} x_{ij} \le C_j(t) \quad \forall j \in J$$
3. **Severed / Inundated Road Invariance:**
   $$x_{ij} \le M_{\text{big}} \cdot (1 - S_{ij}) \quad \forall i \in I, j \in J$$
   Where $S_{ij} = 1$ if road arc is severed/flooded, forcing $x_{ij} = 0$.
4. **Fleet Capacity Transport Bounds:**
   $$\sum_{k \in K} \text{Cap}_k \cdot v_{kij} \ge x_{ij} \quad \forall i \in I, j \in J$$
5. **Corridor Activation Linking:**
   $$x_{ij} \le M_{\text{big}} \cdot y_{ij} \quad \forall i \in I, j \in J$$

---

## Module 5: Dynamic Network Routing & Road Severance Algorithm

### 1. Purpose & Why We Use It
Google Maps / standard GPS routes assume all roads are open. During cloudbursts, roads submerge or collapse. We use **Dynamic Time-Dependent $A^*$ with Inundation Penalty Graphs** via OpenStreetMap (OSMNx) & NetworkX.

### 2. Mathematical Formulations

#### Dynamic Edge Cost Function:
$$w_e(t) = \begin{cases} 
\infty & \text{if } \text{DebrisDepth}_e(t) > 0.3 \, m \text{ or } \text{BridgeStatus}_e = \text{Collapsed} \\
\frac{L_e}{v_e \cdot (1 - \text{WaterDepth}_e(t) / 0.3)} \cdot \left[ 1 + \left( \frac{Q_e(t)}{\text{RoadCap}_e} \right)^4 \right] & \text{otherwise}
\end{cases}$$
* $L_e$: Road segment length ($km$).
* $v_e$: Free-flow vehicle speed ($km/h$).
* $Q_e(t)$: Current vehicle flow rate (Bureau of Public Roads congestion formula).

---

## Module 6: Explainable AI (SHAP & Game Theoretic Attributions)

### 1. Purpose & Why We Use It
District Magistrates and NDRF Commanders cannot legally order mass evacuations based on an opaque "black-box" model. **SHAP (SHapley Additive exPlanations)** calculates exact game-theoretic marginal feature contributions for every red-zone determination.

### 2. Mathematical Formulation
$$\phi_m(x) = \sum_{S \subseteq F \setminus \{m\}} \frac{|S|! \, (|F| - |S| - 1)!}{|F|!} \Big[ f_x(S \cup \{m\}) - f_x(S) \Big]$$
* $F$: Set of all environmental features (Slope, Rain Intensity, Soil Saturation, River Proximity).
* $\phi_m(x)$: Exact percentage contribution of feature $m$ to the red-zone classification.
* **Output to DM Console:** *"Village A flagged RED: 48% Slope Gradient (>35°), 34% 3-hr Cumulative Rain (160mm), 18% Soil Saturation."*

---

## Module 7: "What-If" Cascade Disaster Simulation Engine

### 1. Purpose & Why We Use It
Provides a live interactive sandbox during the hackathon demo. When the jury challenges the team with unexpected scenarios (e.g. *"What if the dam releases 50,000 cusecs?"*), the system runs a fast **Kinematic Wave & Cellular Inundation Automata**.

### 2. Mathematical Formulations

#### Manning’s Open Channel Equation:
$$Q = \frac{1}{n} \cdot A \cdot R_h^{2/3} \cdot S^{1/2}$$
* $Q$: Water discharge ($m^3/s$).
* $n$: Manning's roughness coefficient ($\approx 0.035 - 0.05$ for mountain streams).
* $A$: Cross-sectional area of flow ($m^2$).
* $R_h$: Hydraulic radius ($m$).
* $S$: Energy slope gradient ($m/m$).

#### Cellular Automata Water Spreading:
$$\Delta W_{c \to n} = \min \left( W_c, \; \max \left( 0, \, \frac{(Z_c + W_c) - (Z_n + W_n)}{2} \right) \right)$$
Where $Z$ is terrain ground elevation and $W$ is water surface depth.
