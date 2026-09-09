// ResQGrid API Service with Zero-Downtime Intelligent Fallback
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchOverview() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/overview`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using local intelligence engine:', e);
  }
  return null;
}

export async function fetchHabitations() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/habitations`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fetch habitations error:', e);
  }
  return null;
}

export async function fetchShelters() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/shelters`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fetch shelters error:', e);
  }
  return null;
}

export async function runSimulation(params) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Simulation API error:', e);
  }
  return null;
}

export async function optimizeRelocation(req) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Optimization API error:', e);
  }
  return null;
}

export async function toggleRoad(roadId, isBlocked) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/roads/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ road_id: roadId, is_blocked: isBlocked })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Toggle road API error:', e);
  }
  return null;
}

export async function fetchXAI(habitationId) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/explain/${habitationId}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fetch XAI API error:', e);
  }
  return null;
}

export async function fetchManifest() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/export/manifest`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fetch manifest API error:', e);
  }
  return null;
}
