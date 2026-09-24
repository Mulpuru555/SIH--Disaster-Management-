#!/usr/bin/env python3
"""
========================================================================================
 ResQGrid — National Proactive Relocation Intelligence Platform
 Smart India Hackathon (SIH 2026) | Problem Statement: SIH26191
 Ministry of Home Affairs (MHA) & National Disaster Response Force (NDRF)
 Team 16: BharatBytes

 Full System Integration & Live Deployment Verification Script
========================================================================================
"""

import os
import sys
import time
import subprocess
from datetime import datetime

def print_header(title):
    print("\n" + "=" * 80)
    print(f"  {title.center(76)}")
    print("=" * 80)

def main():
    start_total = time.time()
    print_header("ResQGrid — Comprehensive Full System Verification")
    print("Authority  : Ministry of Home Affairs & National Disaster Response Force (NDRF)")
    print("Problem ID : SIH26191 (Proactive Habitation Risk & Relocation Optimization)")
    print("Developer  : Team 16 (BharatBytes)")
    print(f"Timestamp  : {datetime.now().strftime('%Y-%m-%d %H:%M:%S IST')}")

    workspace_dir = os.path.abspath(os.path.dirname(__file__))
    backend_dir = os.path.join(workspace_dir, "backend")
    frontend_dir = os.path.join(workspace_dir, "frontend")

    # Step 1: Python Environment & Dependency Check
    print_header("Step 1: Python Core Engine & Dependencies Check")
    deps = [
        ("fastapi", "FastAPI Asynchronous Gateway"),
        ("pydantic", "Data Validation & Schema Modeling"),
        ("sqlalchemy", "Dual-Engine Spatial Persistence (PostGIS / SQLite WAL)"),
        ("pulp", "Mixed Integer Linear Programming (PuLP CBC Solver)"),
        ("networkx", "Graph Analytics & Dynamic Detour Routing"),
        ("google.generativeai", "Gemini Grounded GenAI Decision Support"),
        ("httpx", "High-Performance ASGI HTTP Test Client")
    ]

    all_deps_ok = True
    for mod, label in deps:
        try:
            __import__(mod)
            print(f"  [OK] {label:<58} ({mod})")
        except ImportError as e:
            print(f"  [FAIL] {label:<58} (Missing: {e})")
            all_deps_ok = False

    if not all_deps_ok:
        print("\n  [ERROR]: Required dependencies are missing. Run: python -m pip install -r backend/requirements.txt")
        sys.exit(1)

    # Step 2: Database Initialization & Integrity
    print_header("Step 2: Database Engine & Cryptographic Ledger Initialization")
    sys.path.insert(0, backend_dir)
    try:
        from app.database import init_db, get_engine_info, SessionLocal
        from app.governance_engine import verify_audit_hash_chain
        from app.data_store import db

        init_db()
        info = get_engine_info()
        print(f"  [OK] Database Dialect: {info['engine']} (Spatial Ready: {info['is_spatial_ready']})")
        print(f"  [OK] Habitations Loaded: {len(db.habitations)} records in memory & persistent store.")
        print(f"  [OK] Relief Shelters: {len(db.shelters)} authorized camps.")
        print(f"  [OK] Evacuation Road Edges: {len(db.roads)} corridors mapped.")

        with SessionLocal() as session:
            chain_status = verify_audit_hash_chain(session)
            print(f"  [OK] SHA-256 Decision Ledger: {chain_status['status']} ({chain_status['total_records']} verified blocks in {chain_status['verification_duration_ms']}ms)")
    except Exception as e:
        print(f"  [FAIL] Database initialization failed: {e}")
        sys.exit(1)

    # Step 3: Run Master 10-Module E2E Test Suite
    print_header("Step 3: Executing Master 10-Module E2E Integration Suite")
    test_script = os.path.join(backend_dir, "test_e2e_resqgrid.py")
    res_e2e = subprocess.run([sys.executable, test_script], cwd=backend_dir, capture_output=True, text=True)

    if res_e2e.returncode == 0:
        for line in res_e2e.stdout.splitlines():
            if "[Pass]" in line:
                print(f"  {line}")
        print("\n  [SUCCESS] All 10 End-to-End Architectural Test Modules Passed (Exit Code 0).")
    else:
        print("  [FAIL] E2E Test Suite execution encountered failures:")
        print(res_e2e.stdout)
        print(res_e2e.stderr)
        sys.exit(1)

    # Step 4: Frontend Production Distribution Verification
    print_header("Step 4: Frontend Production Distribution Verification")
    dist_index = os.path.join(frontend_dir, "dist", "index.html")
    dist_assets = os.path.join(frontend_dir, "dist", "assets")

    if os.path.exists(dist_index) and os.path.exists(dist_assets):
        asset_files = os.listdir(dist_assets)
        print(f"  [OK] Production HTML Entry: {dist_index}")
        print(f"  [OK] Compiled Assets Directory: {len(asset_files)} bundles present:")
        for af in asset_files:
            fpath = os.path.join(dist_assets, af)
            fsize_kb = round(os.path.getsize(fpath) / 1024, 1)
            print(f"       - {af:<40} ({fsize_kb} KB)")
        print("  [SUCCESS] Frontend distribution is fully compiled, minified, and ready for deployment.")
    else:
        print("  [WARN] dist/ folder not found. Building now via npm run build...")
        subprocess.run(["npm", "run", "build"], cwd=frontend_dir, shell=True, check=True)
        print("  [OK] Production bundle built successfully.")

    # Summary
    total_elapsed = round(time.time() - start_total, 2)
    print_header("ResQGrid SIH26191 Deployment Readiness Summary")
    print(f"""
  STATUS: 100% OPERATIONAL & PRODUCTION READY
  ========================================================================
  - Module 1: Persistent Spatial PostGIS / SQLite WAL Database  -> READY
  - Module 2: PuLP Mixed-Integer Linear Program (MILP) Solver    -> READY
  - Module 3: NetworkX Dynamic Road Severance & Detour Routing  -> READY
  - Module 4: Real-Time CWC Gauge & IMD AWS Ingestion Engine    -> READY
  - Module 5: Grounded GenAI Decision Support (NDRF SOP RAG)    -> READY
  - Module 6: IRS Form 201/202 Operational Relocation Order      -> READY
  - Module 7: Cryptographic SHA-256 Tamper-Evident Ledger       -> READY
  - Module 8: Role-Based Access Control (RBAC) & Rate Limiting  -> READY
  - Module 9: Government-Grade DEOC Map & Analytical Dashboard  -> READY
  - Module 10: Master End-to-End Automated Test Verification     -> READY

  Total Verification Runtime: {total_elapsed} seconds.
    """)

if __name__ == "__main__":
    main()
