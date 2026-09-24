import time
from typing import List, Callable, Dict, Tuple
from fastapi import Request, HTTPException, Depends
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

# Supported Government & Operational Roles
ROLE_DISTRICT_MAGISTRATE = "DISTRICT_MAGISTRATE"
ROLE_NDRF_COMMANDER = "NDRF_INCIDENT_COMMANDER"
ROLE_GIS_OPERATOR = "GIS_OPERATOR"
ROLE_PUBLIC_VIEWER = "PUBLIC_VIEWER"

VALID_ROLES = {
    ROLE_DISTRICT_MAGISTRATE,
    ROLE_NDRF_COMMANDER,
    ROLE_GIS_OPERATOR,
    ROLE_PUBLIC_VIEWER,
    "DISTRICT_COLLECTOR", # Synonym
    "NDRF_CONTROLLER"     # Synonym
}

DEFAULT_DEV_ROLE = ROLE_NDRF_COMMANDER

def get_current_role(request: Request) -> str:
    """
    Extracts user role from the 'X-User-Role' HTTP header.
    Defaults to NDRF_INCIDENT_COMMANDER if unspecified for agile command execution.
    """
    header_val = request.headers.get("X-User-Role")
    if not header_val:
        return DEFAULT_DEV_ROLE
    role = header_val.strip().upper()
    return role if role in VALID_ROLES else ROLE_PUBLIC_VIEWER

def require_roles(allowed_roles: List[str]) -> Callable:
    """
    FastAPI dependency to enforce Role-Based Access Control (RBAC).
    District Magistrate / Collector possesses super-administrative emergency powers under Section 34 of DM Act 2005.
    """
    normalized_allowed = {r.upper().strip() for r in allowed_roles}
    # District Magistrate / Collector always carries supreme jurisdiction
    normalized_allowed.add(ROLE_DISTRICT_MAGISTRATE)
    normalized_allowed.add("DISTRICT_COLLECTOR")

    def role_checker(request: Request, current_role: str = Depends(get_current_role)):
        if current_role in normalized_allowed:
            return current_role

        raise HTTPException(
            status_code=403,
            detail={
                "error": "ACCESS_DENIED_ROLE_UNAUTHORIZED",
                "message": f"Role '{current_role}' lacks authority for this operational command.",
                "required_roles": list(normalized_allowed),
                "actor_role": current_role
            }
        )

    return role_checker


class SlidingWindowRateLimiter:
    """
    In-memory Sliding Window Rate Limiter tracking client IP addresses.
    Prevents API denial-of-service and protects optimization solvers / GenAI pipelines.
    """

    def __init__(self, default_limit: int = 120, heavy_limit: int = 30, window_seconds: int = 60):
        self.default_limit = default_limit
        self.heavy_limit = heavy_limit
        self.window_seconds = window_seconds
        # Structure: { ip_address: [(timestamp, is_heavy), ...] }
        self._history: Dict[str, List[Tuple[float, bool]]] = {}

        self.heavy_paths = {
            "/api/optimize",
            "/api/genai/query",
            "/api/genai/op-ord",
            "/api/ingest/geojson"
        }

    def _clean_old_entries(self, ip: str, now: float):
        cutoff = now - self.window_seconds
        if ip in self._history:
            self._history[ip] = [entry for entry in self._history[ip] if entry[0] > cutoff]
            if not self._history[ip]:
                del self._history[ip]

    def check_rate_limit(self, ip: str, path: str) -> Tuple[bool, int, int]:
        """
        Returns (is_allowed, remaining_requests, retry_after_seconds)
        """
        now = time.time()
        self._clean_old_entries(ip, now)

        is_heavy = any(path.startswith(hp) for hp in self.heavy_paths)
        limit = self.heavy_limit if is_heavy else self.default_limit

        ip_entries = self._history.get(ip, [])
        if is_heavy:
            count = sum(1 for ts, heavy in ip_entries if heavy)
        else:
            count = len(ip_entries)

        if count >= limit:
            oldest_relevant_ts = ip_entries[0][0] if ip_entries else now
            retry_after = max(1, int(self.window_seconds - (now - oldest_relevant_ts)))
            return False, 0, retry_after

        # Record request
        if ip not in self._history:
            self._history[ip] = []
        self._history[ip].append((now, is_heavy))

        remaining = max(0, limit - (count + 1))
        return True, remaining, 0


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Starlette / FastAPI Middleware applying sliding-window rate limiting per client IP."""

    def __init__(self, app, limiter: SlidingWindowRateLimiter):
        super().__init__(app)
        self.limiter = limiter

    async def dispatch(self, request: Request, call_next):
        # Extract client IP (handle proxies/load balancers)
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            ip = forwarded.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else "127.0.0.1"

        path = request.url.path

        # Bypass rate limiting for static/docs
        if path in {"/docs", "/openapi.json", "/redoc", "/favicon.ico"}:
            return await call_next(request)

        allowed, remaining, retry_after = self.limiter.check_rate_limit(ip, path)

        if not allowed:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "RATE_LIMIT_EXCEEDED",
                    "message": f"Rate limit exceeded for path {path}. Please throttle request frequency.",
                    "retry_after_seconds": retry_after
                },
                headers={
                    "Retry-After": str(retry_after),
                    "X-RateLimit-Limit": str(self.limiter.heavy_limit if any(path.startswith(hp) for hp in self.limiter.heavy_paths) else self.limiter.default_limit),
                    "X-RateLimit-Remaining": "0"
                }
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        return response
