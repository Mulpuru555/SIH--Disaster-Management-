import os
import sys
import unittest

# Ensure backend package can be imported
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal, init_db
from app.governance_engine import GovernanceEngine, verify_audit_hash_chain
from app.db_models import AuditLogORM, GENESIS_HASH
from app.security_middleware import SlidingWindowRateLimiter

client = TestClient(app)

class TestPhase7GovernanceSecurity(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        init_db()

    def test_01_cryptographic_hash_chain_integrity(self):
        """Verifies that the audit hash chain is unbroken and valid."""
        with SessionLocal() as session:
            result = verify_audit_hash_chain(session)
            print(f"\n[Test 1] Audit Chain Status: {result['status']}, Total records: {result['total_records']}, Duration: {result['verification_duration_ms']}ms")
            self.assertTrue(result["chain_intact"])
            self.assertEqual(result["status"], "CRYPTOGRAPHICALLY_VERIFIED" if result["total_records"] > 0 else "EMPTY_CHAIN")
            self.assertIsNone(result["tampered_at_id"])

    def test_02_tamper_detection(self):
        """Verifies that unauthorized SQL alteration of an audit record is immediately detected."""
        with SessionLocal() as session:
            # Query last record
            last_record = session.query(AuditLogORM).order_by(AuditLogORM.id.desc()).first()
            self.assertIsNotNone(last_record, "Should have at least one audit record")
            target_id = last_record.id
            orig_role = last_record.actor_role

            # Simulate tampering: alter actor_role directly in SQL
            GovernanceEngine.simulate_tamper_for_testing(session, target_id, "UNAUTHORIZED_HACKER")

            # Verification MUST fail now
            tampered_result = verify_audit_hash_chain(session)
            print(f"[Test 2] Tamper Detection Triggered: status={tampered_result['status']}, tampered_at_id={tampered_result['tampered_at_id']}")
            self.assertFalse(tampered_result["chain_intact"])
            self.assertEqual(tampered_result["status"], "TAMPER_DETECTED")
            self.assertEqual(tampered_result["tampered_at_id"], target_id)

            # Restore original actor role
            last_record.actor_role = orig_role
            session.commit()

            # Verification MUST pass again
            restored_result = verify_audit_hash_chain(session)
            self.assertTrue(restored_result["chain_intact"])
            print(f"[Test 2] Restored and verified intact: {restored_result['status']}")

    def test_03_rbac_unauthorized_rejection(self):
        """Verifies that unprivileged roles are strictly rejected with HTTP 403."""
        from app.data_store import db
        road_id = list(db.roads.keys())[0] if db.roads else "R_H1_S1"

        # 1. PUBLIC_VIEWER trying to toggle a road -> 403 Forbidden
        res = client.post(
            "/api/roads/toggle",
            json={"road_id": road_id, "is_blocked": True, "reason": "Testing RBAC"},
            headers={"X-User-Role": "PUBLIC_VIEWER"}
        )
        self.assertEqual(res.status_code, 403)
        self.assertIn("ACCESS_DENIED_ROLE_UNAUTHORIZED", res.json()["detail"]["error"])
        print("\n[Test 3] PUBLIC_VIEWER toggle road rejected with 403 as expected.")

        # 2. GIS_OPERATOR trying to sign off an operational order -> 403 Forbidden
        res_sign = client.post(
            "/api/genai/op-ord/sign-off",
            json={
                "op_ord_id": "OPORD-TEST",
                "sign_off_officer": "Unauthorized Officer",
                "designation": "GIS Technician",
                "comments": "Testing RBAC"
            },
            headers={"X-User-Role": "GIS_OPERATOR"}
        )
        self.assertEqual(res_sign.status_code, 403)
        print("[Test 3] GIS_OPERATOR sign-off OP-ORD rejected with 403 as expected.")

    def test_04_rbac_authorized_success(self):
        """Verifies that authorized roles execute successfully."""
        from app.data_store import db
        road_id = list(db.roads.keys())[0] if db.roads else "R_H1_S1"

        # NDRF_INCIDENT_COMMANDER toggling road
        res = client.post(
            "/api/roads/toggle",
            json={"road_id": road_id, "is_blocked": False, "reason": "Cleared by NDRF"},
            headers={"X-User-Role": "NDRF_INCIDENT_COMMANDER"}
        )
        self.assertEqual(res.status_code, 200)

        # DISTRICT_MAGISTRATE signing off operational order
        res_sign = client.post(
            "/api/genai/op-ord/sign-off",
            json={
                "op_ord_id": "OPORD-DEMO",
                "sign_off_officer": "Dr. D. Sambasiva Rao, IAS",
                "designation": "District Magistrate & DDMA Chairman",
                "comments": "Immediate execution authorized"
            },
            headers={"X-User-Role": "DISTRICT_MAGISTRATE"}
        )
        self.assertEqual(res_sign.status_code, 200)
        self.assertIn("RATIFIED", res_sign.json()["verification_status"])
        print("[Test 4] DISTRICT_MAGISTRATE ratified OP-ORD successfully.")

    def test_05_rate_limiter_unit(self):
        """Verifies sliding window rate limiter tracking and throttling."""
        limiter = SlidingWindowRateLimiter(default_limit=5, heavy_limit=2, window_seconds=2)
        ip = "192.168.1.100"

        # 2 heavy calls allowed
        ok1, rem1, _ = limiter.check_rate_limit(ip, "/api/optimize")
        ok2, rem2, _ = limiter.check_rate_limit(ip, "/api/optimize")
        self.assertTrue(ok1)
        self.assertTrue(ok2)
        self.assertEqual(rem2, 0)

        # 3rd heavy call should be rejected
        ok3, rem3, retry_after = limiter.check_rate_limit(ip, "/api/optimize")
        self.assertFalse(ok3)
        self.assertGreaterEqual(retry_after, 1)
        print(f"\n[Test 5] Rate limiter throttled heavy path with retry-after: {retry_after}s")

    def test_06_enhanced_xai_attributions(self):
        """Verifies demographic vulnerability attributions and cryptographic audit link in XAI."""
        from app.data_store import db
        hab_id = list(db.habitations.keys())[0] if db.habitations else "H1"
        res = client.get(f"/api/explain/{hab_id}")
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertIn("demographic_vulnerability_score", data)
        self.assertIn("social_vulnerability_breakdown", data)
        self.assertIn("evacuation_wave_recommendation", data)
        self.assertIn("cryptographic_audit_hash", data)
        self.assertIsNotNone(data["cryptographic_audit_hash"])
        self.assertEqual(len(data["cryptographic_audit_hash"]), 64)

        print(f"\n[Test 6] Habitation {data['habitation_name']}:")
        print(f"  - Demographic Vulnerability Score: {data['demographic_vulnerability_score']}")
        print(f"  - Evacuation Wave: {data['evacuation_wave_recommendation']}")
        print(f"  - Cryptographic Audit Hash: {data['cryptographic_audit_hash'][:16]}...")

    def test_07_audit_verify_chain_endpoint(self):
        """Verifies the GET /api/audit/verify-chain endpoint returns valid status and metadata."""
        res = client.get("/api/audit/verify-chain")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["chain_intact"])
        self.assertEqual(data["status"], "CRYPTOGRAPHICALLY_VERIFIED")
        self.assertGreater(data["total_records"], 0)
        print(f"[Test 7] GET /api/audit/verify-chain passed: {data['total_records']} blocks verified in {data['verification_duration_ms']}ms.")

if __name__ == "__main__":
    unittest.main()
