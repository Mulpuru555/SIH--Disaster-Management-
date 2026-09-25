"""
ResQGrid Cloud Backend Root Entry Point for Render & Production Cloud Hosting
SIH26191 - Ministry of Home Affairs / NDRF
"""
import os
import sys

# Ensure backend directory is in Python module search path
backend_dir = os.path.join(os.path.dirname(__file__), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
