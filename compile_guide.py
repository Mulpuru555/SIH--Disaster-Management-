# -*- coding: utf-8 -*-
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.pdfgen import canvas

# 1. BUILD PDF
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont('Helvetica-Bold', 8)
        self.setFillColor(colors.HexColor('#102C57'))
        self.drawString(54, 750, 'ResQGrid - Slide-by-Slide Pitch & Defense Guide | Team BharatBytes (Team 16)')
        self.setFont('Helvetica', 8)
        self.setFillColor(colors.HexColor('#666666'))
        self.drawRightString(558, 750, 'SIH 2026 - Problem Statement: SIH26191')
        self.setStrokeColor(colors.HexColor('#CCCCCC'))
        self.setLineWidth(0.5)
        self.line(54, 744, 558, 744)
        self.line(54, 45, 558, 45)
        self.setFont('Helvetica', 8)
        self.drawString(54, 32, 'CONFIDENTIAL - Team BharatBytes Presentation Guide')
        self.drawRightString(558, 32, f'Page {self._pageNumber} of {page_count}')
        self.restoreState()

pdf_path = r'c:\Users\LENOVO\OneDrive\Desktop\SIH 2026 - BHARATH BHYTES\ResQGrid_Presentation_Pitch_Deck_Guide.pdf'
doc_pdf = SimpleDocTemplate(pdf_path, pagesize=letter, leftMargin=54, rightMargin=54, topMargin=60, bottomMargin=55)

styles = getSampleStyleSheet()
title_style = ParagraphStyle('DocTitle', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=18, leading=22, textColor=colors.HexColor('#102C57'), spaceAfter=4)
subtitle_style = ParagraphStyle('DocSubtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, leading=13.5, textColor=colors.HexColor('#355F8E'), spaceAfter=12)
slide_header_style = ParagraphStyle('SlideHeader', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=colors.HexColor('#102C57'), spaceBefore=8, spaceAfter=4)
sub_heading = ParagraphStyle('SubHeading', parent=styles['Heading3'], fontName='Helvetica-Bold', fontSize=9.5, leading=12.5, textColor=colors.HexColor('#2E5B88'), spaceBefore=5, spaceAfter=2)
body_style = ParagraphStyle('BodyTextCustom', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11.5, textColor=colors.HexColor('#222222'), spaceAfter=4)
bullet_style = ParagraphStyle('BulletCustom', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11.5, textColor=colors.HexColor('#222222'), leftIndent=12, firstLineIndent=-8, spaceAfter=3)

def make_callout(title, text, bg='#F0F4F8', border='#355F8E'):
    p_title = Paragraph(f'<b>{title}</b>', ParagraphStyle('CallTitle', fontName='Helvetica-Bold', fontSize=9, leading=11.5, textColor=colors.HexColor(border)))
    p_text = Paragraph(text, ParagraphStyle('CallText', fontName='Helvetica', fontSize=8.5, leading=11.5, textColor=colors.HexColor('#222222')))
    t = Table([[p_title], [p_text]], colWidths=[504])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(bg)),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor(border)),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    return t

elements = []
elements.append(Paragraph('ResQGrid: Master Presentation & Defense Guide', title_style))
elements.append(Paragraph('<b>Smart India Hackathon 2026 | Team BharatBytes (Team 16) | PS ID: SIH26191</b><br/>Theme: Disaster Management | Category: Software | Complete Slide-by-Slide Script, Tech Explanation & Jury Defense', subtitle_style))
elements.append(HRFlowable(width='100%', thickness=1.5, color=colors.HexColor('#102C57'), spaceAfter=8))

# Slide 1
elements.append(Paragraph('SLIDE 1: Title & Team Introduction', slide_header_style))
elements.append(Paragraph('<b>Slide Contents:</b> Smart India Hackathon 2026 | Problem Statement ID: SIH26191 | Title: Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment, and Immediate Relocation Needs for Vulnerable Habitations | Team ID: Team 16 | Team Name: BharatBytes', body_style))
elements.append(Paragraph('• <b>Why we use it:</b> Establishes domain authority, team identity, and problem statement focus right at the start of the pitch.', bullet_style))
elements.append(Paragraph('• <b>Software & Tools:</b> Official SIH Title Page Template with Team 16 credentials.', bullet_style))
elements.append(Paragraph('• <b>How it works:</b> The team leader opens the pitch clearly stating team name and core mission to save lives through proactive disaster intelligence.', bullet_style))
script_1 = '\"Respected Jury and evaluators, a very good day to you. We are Team BharatBytes (Team ID 16). Today, we present <b>ResQGrid</b>, our AI-powered proactive relocation intelligence system designed for Problem Statement SIH26191: Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment, and Immediate Relocation Needs for Vulnerable Habitations.\"'
elements.append(make_callout('Speaker Script (30 Seconds):', script_1, '#EBF3FA', '#102C57'))
elements.append(Spacer(1, 6))

# Slide 2
elements.append(Paragraph('SLIDE 2: Solution Overview & Core Innovation (ResQGrid)', slide_header_style))
elements.append(Paragraph('<b>Slide Contents:</b> Real-world Issue (Wayanad/Himachal landslides, unplanned evacuations), Rs 80k+ Cr annual loss, 30M+ displaced, 85% evacuation failures due to blind shelter allocation & road cutoffs. Solution: GeoAI Red-Zones + Multi-Resource Carrying Capacity + Capacity-Constrained Relocation + XAI (SHAP).', body_style))
elements.append(Paragraph('• <b>Why we use it:</b> Explains the urgent national disaster problem and clearly presents our three-pillar solution.', bullet_style))
elements.append(Paragraph('• <b>Software & Tools:</b> GeoAI raster fusion, SoVI demographic prioritization, Multi-Resource Capacity tracker, and Google OR-Tools optimization engine.', bullet_style))
elements.append(Paragraph('• <b>How it works:</b> 85% of evacuation failures occur due to blind shelter allocation and road cutoffs. ResQGrid predicts red zones before disaster strikes, monitors camp water/food/beds, and guarantees zero shelter overflow with safe routes.', bullet_style))
script_2 = '\"In recent disasters like Wayanad and Himachal, 85% of evacuation failures occurred because authorities allocated people blindly to overcrowded shelters while convoys got trapped on severed roads. ResQGrid replaces chaotic evacuation with intelligence: it identifies dynamic red zones, tracks multi-resource shelter capacity (beds, water, food, sanitation), and uses mathematical optimization to safely evacuate every citizen with zero shelter overflow.\"'
elements.append(make_callout('Speaker Script (60 Seconds):', script_2, '#EBF3FA', '#102C57'))
elements.append(Spacer(1, 6))

# Slide 3
elements.append(Paragraph('SLIDE 3: Technical Approach, Architecture & Implementation', slide_header_style))
elements.append(Paragraph('<b>Slide Contents:</b> 5-Step Methodology (Data Ingestion, Dynamic GeoAI Red-Zone, SoVI Vulnerability, Carrying Capacity Modeling, OR-Tools Optimization), System Architecture Diagram, Linear Formulation, Technologies Used (FastAPI, React, PostGIS, OR-Tools, OSMNx).', body_style))
elements.append(Paragraph('• <b>Why we use it:</b> Proves technical feasibility and demonstrates that our team has built a working software system.', bullet_style))
elements.append(Paragraph('• <b>Software Stack:</b> FastAPI (Backend API), Google OR-Tools (MILP optimization), GeoPandas/Shapely (Geospatial engine), NetworkX/OSMNx (Dynamic road routing), React + Leaflet (Command Dashboard).', bullet_style))
elements.append(Paragraph('• <b>How it works:</b> Ingests DEM elevation and IMD rainfall -> flags dynamic Red Zones -> prioritizes vulnerable habitations (SoVI) -> calculates true multi-resource camp capacity -> dispatches rescue convoys with zero overflow in under 200ms.', bullet_style))
script_3 = '\"Technically, our pipeline has 5 structured stages: GeoPandas ingests DEM terrain and IMD rainfall; our GeoAI engine calculates slope stability and rainfall thresholds to identify dynamic Red Zones; our SoVI module prioritizes vulnerable citizens; our Shelter Engine models capacity based on water, food, and beds; and Google OR-Tools executes a Mixed-Integer Linear Program to compute mathematically optimal, zero-overflow evacuation manifests in under 200 milliseconds.\"'
elements.append(make_callout('Speaker Script (75 Seconds):', script_3, '#EBF3FA', '#102C57'))
elements.append(Spacer(1, 6))

# Slide 4
elements.append(Paragraph('SLIDE 4: Feasibility, Viability & Government Adoption', slide_header_style))
elements.append(Paragraph('<b>Slide Contents:</b> Feasibility Rating (4.5/5), Infrastructure Reusability (ISRO open satellite feeds, state GIS), Scalable Pilot Deployment (Wayanad/Mandi), Explainable AI (SHAP for DM confidence), Government Savings & Zero Relief Wastage.', body_style))
elements.append(Paragraph('• <b>Why we use it:</b> Proves to judges that the system can be deployed immediately by State Disaster Management Authorities with near-zero extra infrastructure cost.', bullet_style))
elements.append(Paragraph('• <b>Software & Tools:</b> SHAP Explainability library, Open-source GIS connectors, Cloud PostgreSQL, and REST APIs.', bullet_style))
elements.append(Paragraph('• <b>How it works:</b> Reuses open government satellite and rainfall telemetry. Provides Explainable AI (SHAP) feature breakdowns so District Magistrates know exactly why an evacuation was ordered, ensuring legal compliance and public trust.', bullet_style))
script_4 = '\"ResQGrid is 100% feasible and viable. It reuses existing government data feeds—ISRO Bhuvan, IMD weather feeds, and OpenStreetMap—requiring zero heavy hardware expenditure. Furthermore, we provide Explainable AI (SHAP): District Magistrates are not given a black box; they see exact percentage weights (e.g. 48% slope, 34% rainfall) behind every red zone, ensuring transparency, accountability, and zero relief wastage.\"'
elements.append(make_callout('Speaker Script (45 Seconds):', script_4, '#EBF3FA', '#102C57'))
elements.append(Spacer(1, 6))

# Slide 5
elements.append(Paragraph('SLIDE 5: Impacts and Benefits', slide_header_style))
elements.append(Paragraph('<b>Slide Contents:</b> 95% Reduced Evacuation Planning Latency (72 hrs to under 2 mins), Faster Targeted Response for vulnerable habitations, Zero Relief Material Stockouts, Real-Time Emergency Alerts. Pillars: Safety, Economic, Environmental, Technological.', body_style))
elements.append(Paragraph('• <b>Why we use it:</b> Quantifies the life-saving and financial benefits for disaster response agencies.', bullet_style))
elements.append(Paragraph('• <b>Software & Tools:</b> Benchmark analytics, automated convoy manifest generator, and real-time alert dispatch pipeline.', bullet_style))
elements.append(Paragraph('• <b>How it works:</b> Replaces slow manual spreadsheets with instant AI calculation, preventing camp resource exhaustion and saving lives during critical golden hours.', bullet_style))
script_5 = '\"The impact of ResQGrid is transformative: It reduces evacuation decision time by 95%—from 72 hours of chaotic manual coordination down to under 2 minutes. It protects vulnerable citizens first, eliminates secondary humanitarian crises by preventing shelter stockouts, and saves district administrations crores in duplicate relief logistics.\"'
elements.append(make_callout('Speaker Script (40 Seconds):', script_5, '#EBF3FA', '#102C57'))
elements.append(Spacer(1, 6))

# Slide 6
elements.append(Paragraph('SLIDE 6: Research, References & UI/UX Feature Preview', slide_header_style))
elements.append(Paragraph('<b>Slide Contents:</b> References NDMA SOPs, ISRO NDEM, Cutter SoVI, Google OR-Tools, and Lundberg SHAP; previews core UI features: Dynamic Red-Zone Portal, Live Shelter Capacity Matrix, and Emergency Dispatch Console.', body_style))
elements.append(Paragraph('• <b>Why we use it:</b> Anchors the solution in verified scientific disaster management literature and proves operational software readiness.', bullet_style))
elements.append(Paragraph('• <b>Software & Tools:</b> NDMA Disaster SOPs, Sphere Humanitarian Standards, Google OR-Tools solver, and React/Leaflet UI.', bullet_style))
elements.append(Paragraph('• <b>How it works:</b> Combines established scientific research with a modern command center interface built for District Disaster Control Rooms.', bullet_style))
script_6 = '\"Our solution is built on verified scientific standards—NDMA SOPs, Cutter\'s Social Vulnerability Index, and Sphere Humanitarian standards. As shown in our interface preview, ResQGrid delivers three core capabilities: Dynamic Hazard Red-Zoning, Live Multi-Resource Capacity Gauges, and 1-Click NDRF Convoy Dispatch Manifests. Thank you, and we are now open for questions!\"'
elements.append(make_callout('Speaker Script (30 Seconds):', script_6, '#EBF3FA', '#102C57'))
elements.append(Spacer(1, 8))

# Q&A
elements.append(Paragraph('Top 5 Jury Questions & Winning Answers', slide_header_style))
qa_list = [
    ('Q1: How do you guarantee shelters will not get overcrowded during mass evacuations?',
     '<b>Answer:</b> We enforce strict capacity constraints using Google OR-Tools Mixed Integer Linear Programming (MILP). The solver bounds total assigned evacuees to never exceed each shelter\'s effective capacity (minimum of beds, water, food, and sanitation). If a shelter reaches 100%, the solver automatically reroutes evacuees to the nearest safe secondary shelter.'),
    ('Q2: What happens if a road or bridge gets washed away during an ongoing evacuation?',
     '<b>Answer:</b> ResQGrid maintains a live OpenStreetMap road network via NetworkX. When a road is reported blocked or flooded, the software cuts that edge from the graph and OR-Tools instantly recalculates safe alternate detour routes in under 200ms.'),
    ('Q3: Why shouldn\'t the District Magistrate just use Google Maps?',
     '<b>Answer:</b> Google Maps only finds the shortest route for individual vehicles—it has zero knowledge of relief camp capacities, flood water levels, demographic vulnerability (elderly/disabled), or fleet coordination. ResQGrid is an end-to-end disaster logistics decision engine.'),
    ('Q4: How do rescue teams receive orders if there is no internet in disaster zones?',
     '<b>Answer:</b> ResQGrid generates 1-click printable PDF manifests at the District Command Center before dispatch, and supports compressed SMS alerts (160 characters) directly to Aapda Mitra and NDRF commanders over basic 2G cellular networks.'),
    ('Q5: What makes your carrying capacity model different from existing systems?',
     '<b>Answer:</b> Existing systems only count physical beds. ResQGrid uses a multi-resource degradation model compliant with Sphere Humanitarian Standards—tracking drinking water (15L/day), food calories (2100 kcal/day), sanitation ratios, and medical staff. If clean water drops, effective capacity drops dynamically to prevent secondary disease outbreaks.')
]

for q, a in qa_list:
    elements.append(Paragraph(f'<b>{q}</b>', sub_heading))
    elements.append(Paragraph(a, body_style))
    elements.append(Spacer(1, 2))

doc_pdf.build(elements, canvasmaker=NumberedCanvas)
print('PDF generated successfully at:', pdf_path)

# 2. BUILD DOCX
doc_word = Document()
for s in doc_word.sections:
    s.top_margin = Inches(0.8)
    s.bottom_margin = Inches(0.8)
    s.left_margin = Inches(0.8)
    s.right_margin = Inches(0.8)

p = doc_word.add_paragraph()
r = p.add_run('🎤 ResQGrid: Master Presentation & Defense Guide')
r.font.size = Pt(20)
r.font.bold = True
r.font.color.rgb = RGBColor(16, 44, 87)

p2 = doc_word.add_paragraph()
p2.add_run('Smart India Hackathon 2026 | Team BharatBytes (Team 16) | PS ID: SIH26191\nSlide-by-Slide Speaking Script, Tech Implementation & Jury Defense Guide').italic = True

def add_w_h1(txt):
    h = doc_word.add_paragraph()
    r = h.add_run(txt)
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(16, 44, 87)

def add_w_script(txt):
    t = doc_word.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = t.rows[0].cells[0]
    tcPr = c._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), 'F0F4F8')
    tcPr.append(shd)
    p = c.paragraphs[0]
    p.add_run('🗣️ Speaker Pitch Script:\n').bold = True
    p.add_run(txt).italic = True
    doc_word.add_paragraph()

slides_data = [
    ('SLIDE 1: Title & Team Introduction',
     'Smart India Hackathon 2026 | Problem Statement: SIH26191 | Team 16: BharatBytes',
     'Establishes identity and problem statement alignment.',
     'Official SIH Title Template with Team 16 credentials.',
     'Introduces the team and core mission to save lives through proactive disaster intelligence.',
     script_1),
    ('SLIDE 2: Solution Overview & Core Innovation (ResQGrid)',
     'Real-world disaster issues, Rs 80k+ Cr losses, 85% evacuation failures due to blind shelter allocation and road cutoffs.',
     'Clearly presents our three-pillar solution to the national disaster bottleneck.',
     'GeoAI raster fusion, SoVI demographic prioritization, Multi-Resource Capacity tracker, and Google OR-Tools optimization.',
     'Predicts red zones before disaster strikes, monitors camp water/food/beds, and guarantees zero shelter overflow with safe routes.',
     script_2),
    ('SLIDE 3: Technical Approach, Architecture & Implementation',
     '5-Step Methodology, System Architecture Pipeline, Linear Formulation, Full Tech Stack.',
     'Proves technical feasibility and engineering readiness.',
     'FastAPI, Google OR-Tools MILP, GeoPandas/Shapely, NetworkX/OSMNx, React + Leaflet.',
     'Ingests DEM elevation and IMD rainfall -> flags dynamic Red Zones -> prioritizes vulnerable habitations (SoVI) -> calculates true multi-resource camp capacity -> dispatches rescue convoys with zero overflow in under 200ms.',
     script_3),
    ('SLIDE 4: Feasibility, Viability & Government Adoption',
     '4.5/5 Feasibility rating, open satellite data reusability, Explainable AI (SHAP), government cost savings.',
     'Proves that authorities can adopt ResQGrid with near-zero extra infrastructure cost.',
     'SHAP Explainability library, Open-source GIS connectors, Cloud PostgreSQL, and REST APIs.',
     'Reuses open government satellite and rainfall telemetry. Provides Explainable AI (SHAP) feature breakdowns so District Magistrates know exactly why an evacuation was ordered, ensuring legal compliance and public trust.',
     script_4),
    ('SLIDE 5: Impacts and Benefits',
     '95% reduced evacuation planning latency (72h to <2m), zero camp stockouts, targeted response.',
     'Quantifies life-saving and financial benefits.',
     'Benchmark analytics, automated convoy manifest generator, and real-time alert dispatch pipeline.',
     'Replaces slow manual spreadsheets with instant AI calculation, preventing camp resource exhaustion and saving lives during critical golden hours.',
     script_5),
    ('SLIDE 6: Research, References & UI/UX Preview',
     'References NDMA SOPs, ISRO NDEM, Cutter SoVI, Google OR-Tools, Lundberg SHAP; previews core UI features.',
     'Anchors the solution in verified scientific disaster literature.',
     'NDMA Disaster SOPs, Sphere Humanitarian Standards, Google OR-Tools solver, and React/Leaflet UI.',
     'Combines established scientific research with a modern command center interface built for District Disaster Control Rooms.',
     script_6)
]

for title, cont, why, sw, how, sc in slides_data:
    add_w_h1(title)
    doc_word.add_paragraph(f'• Slide Contents: {cont}')
    doc_word.add_paragraph(f'• Why We Use It: {why}')
    doc_word.add_paragraph(f'• Software & Tools Used: {sw}')
    doc_word.add_paragraph(f'• How It Works A to Z: {how}')
    add_w_script(sc)

add_w_h1('Top 5 Jury Questions & Winning Answers')
for q, a in qa_list:
    p_q = doc_word.add_paragraph()
    p_q.add_run(q).bold = True
    p_a = doc_word.add_paragraph()
    p_a.add_run(a.replace('<b>Answer:</b> ', 'Answer: '))

docx_path = r'c:\Users\LENOVO\OneDrive\Desktop\SIH 2026 - BHARATH BHYTES\ResQGrid_Presentation_Pitch_Deck_Guide.docx'
doc_word.save(docx_path)
print('DOCX generated successfully at:', docx_path)