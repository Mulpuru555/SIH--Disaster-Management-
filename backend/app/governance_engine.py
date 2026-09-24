import time
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from .db_models import AuditLogORM, compute_audit_hash, GENESIS_HASH

class GovernanceEngine:
    """
    Cryptographic Governance & Audit Integrity Engine
    Implements SHA-256 tamper-evident hash chaining across all disaster decision logs,
    operational orders, sensor telemetry, and dispatch manifests in compliance with
    Section 51 of the Disaster Management Act 2005.
    """

    @staticmethod
    def verify_audit_hash_chain(session: Session) -> Dict[str, Any]:
        """
        Verifies the complete SHA-256 hash chain from genesis block to current.
        Detects any retroactive modifications, row deletions, or content tampering.
        """
        start_time = time.perf_counter()
        records: List[AuditLogORM] = session.query(AuditLogORM).order_by(AuditLogORM.id.asc()).all()

        if not records:
            return {
                "status": "EMPTY_CHAIN",
                "chain_intact": True,
                "total_records": 0,
                "tampered_at_id": None,
                "tampered_reason": None,
                "genesis_hash": GENESIS_HASH,
                "latest_hash": GENESIS_HASH,
                "algorithm": "SHA-256 (FIPS 180-4)",
                "verification_duration_ms": round((time.perf_counter() - start_time) * 1000, 2),
                "verified_at": datetime.utcnow().isoformat()
            }

        prev_expected_hash = GENESIS_HASH

        for idx, rec in enumerate(records):
            # Check 1: Verify linkage to previous block
            if rec.prev_hash != prev_expected_hash:
                elapsed = round((time.perf_counter() - start_time) * 1000, 2)
                return {
                    "status": "TAMPER_DETECTED",
                    "chain_intact": False,
                    "total_records": len(records),
                    "tampered_at_id": rec.id,
                    "tampered_record": rec.to_dict(),
                    "tampered_reason": f"Block linkage severed at ID #{rec.id}: expected prev_hash '{prev_expected_hash[:16]}...', found '{str(rec.prev_hash)[:16]}...'",
                    "genesis_hash": GENESIS_HASH,
                    "latest_hash": records[-1].record_hash,
                    "algorithm": "SHA-256 (FIPS 180-4)",
                    "verification_duration_ms": elapsed,
                    "verified_at": datetime.utcnow().isoformat()
                }

            # Check 2: Verify cryptographic digest of current record content
            expected_digest = compute_audit_hash(
                id_val=rec.id,
                timestamp_iso=rec.timestamp.isoformat() if rec.timestamp else "",
                event_type=rec.event_type,
                actor_role=rec.actor_role,
                details=rec.details,
                ip_address=rec.ip_address,
                prev_hash=rec.prev_hash or GENESIS_HASH
            )

            if rec.record_hash != expected_digest:
                elapsed = round((time.perf_counter() - start_time) * 1000, 2)
                return {
                    "status": "TAMPER_DETECTED",
                    "chain_intact": False,
                    "total_records": len(records),
                    "tampered_at_id": rec.id,
                    "tampered_record": rec.to_dict(),
                    "tampered_reason": f"Content tampering detected at ID #{rec.id}: recorded hash '{rec.record_hash}' does not match computed SHA-256 '{expected_digest}'. Record payload was modified!",
                    "genesis_hash": GENESIS_HASH,
                    "latest_hash": records[-1].record_hash,
                    "algorithm": "SHA-256 (FIPS 180-4)",
                    "verification_duration_ms": elapsed,
                    "verified_at": datetime.utcnow().isoformat()
                }

            prev_expected_hash = rec.record_hash

        elapsed = round((time.perf_counter() - start_time) * 1000, 2)
        return {
            "status": "CRYPTOGRAPHICALLY_VERIFIED",
            "chain_intact": True,
            "total_records": len(records),
            "tampered_at_id": None,
            "tampered_reason": None,
            "genesis_hash": GENESIS_HASH,
            "latest_hash": records[-1].record_hash if records else GENESIS_HASH,
            "algorithm": "SHA-256 (FIPS 180-4)",
            "verification_duration_ms": elapsed,
            "verified_at": datetime.utcnow().isoformat()
        }

    @staticmethod
    def backfill_hash_chain_if_needed(session: Session) -> int:
        """
        Backfills unhashed or legacy audit log records sequentially to ensure
        an unbroken chain from genesis.
        """
        records: List[AuditLogORM] = session.query(AuditLogORM).order_by(AuditLogORM.id.asc()).all()
        if not records:
            return 0

        prev_hash = GENESIS_HASH
        backfilled_count = 0

        for rec in records:
            needs_update = False
            if rec.prev_hash != prev_hash:
                rec.prev_hash = prev_hash
                needs_update = True

            computed = compute_audit_hash(
                id_val=rec.id,
                timestamp_iso=rec.timestamp.isoformat() if rec.timestamp else "",
                event_type=rec.event_type,
                actor_role=rec.actor_role,
                details=rec.details,
                ip_address=rec.ip_address,
                prev_hash=rec.prev_hash
            )

            if rec.record_hash != computed:
                rec.record_hash = computed
                needs_update = True

            if needs_update:
                backfilled_count += 1

            prev_hash = rec.record_hash

        if backfilled_count > 0:
            session.commit()

        return backfilled_count

    @staticmethod
    def simulate_tamper_for_testing(session: Session, record_id: int, altered_actor: str = "MALICIOUS_IMPOSTOR") -> Dict[str, Any]:
        """
        Directly alters database record without recalculating hash.
        Used strictly to prove cryptographic tamper-detection efficacy in automated tests and audits.
        """
        rec = session.query(AuditLogORM).filter(AuditLogORM.id == record_id).first()
        if not rec:
            return {"error": "Record not found"}

        original_actor = rec.actor_role
        rec.actor_role = altered_actor
        session.commit()

        return {
            "record_id": record_id,
            "original_actor": original_actor,
            "altered_actor": altered_actor,
            "message": "Record was directly tampered with. Run verify_audit_hash_chain to observe detection."
        }

def backfill_hash_chain_if_needed(session: Session) -> int:
    return GovernanceEngine.backfill_hash_chain_if_needed(session)

def verify_audit_hash_chain(session: Session) -> Dict[str, Any]:
    return GovernanceEngine.verify_audit_hash_chain(session)
