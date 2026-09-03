import { FullParcelDataset, ParcelFeature, ServiceRequest, AIRiskScore, DataAnomaly, MySummary } from '../types';

const API_BASE = '/api';

export async function fetchGeoJSON(filters?: { village?: string; landUse?: string }): Promise<{ type: string; features: ParcelFeature[] }> {
  try {
    const params = new URLSearchParams(filters as any).toString();
    const res = await fetch(`${API_BASE}/parcels/geojson?${params}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unreachable, using fallback seed loader');
  }
  const res = await fetch('/data/gis/parcels.geojson');
  if (res.ok) return await res.json();
  return { type: 'FeatureCollection', features: [] };
}

export async function fetchParcelByUlpin(ulpin: string): Promise<FullParcelDataset | null> {
  try {
    const res = await fetch(`${API_BASE}/parcels/${ulpin}`);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn(`Failed to fetch parcel ${ulpin} from backend`);
  }
  return null;
}

export async function fetchMySummary(token: string): Promise<MySummary | null> {
  try {
    const res = await fetch(`${API_BASE}/me/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Failed to fetch personalized citizen summary');
  }
  return null;
}

export async function fetchStateAnalytics(): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/analytics/state`);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Failed to fetch state analytics');
  }
  return null;
}

export async function fetchAIRiskScore(ulpin: string): Promise<AIRiskScore | null> {
  try {
    const res = await fetch(`${API_BASE}/ai/risk-score/${ulpin}`);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn(`Failed to fetch risk score for ${ulpin}`);
  }
  return null;
}

export async function fetchAnomalies(): Promise<DataAnomaly[]> {
  try {
    const res = await fetch(`${API_BASE}/ai/anomalies`);
    if (res.ok) {
      const data = await res.json();
      return data.anomalies;
    }
  } catch (err) {
    console.warn('Failed to fetch anomalies');
  }
  return [];
}

export async function fetchServiceRequests(): Promise<ServiceRequest[]> {
  try {
    const res = await fetch(`${API_BASE}/services`);
    if (res.ok) {
      const data = await res.json();
      return data.requests;
    }
  } catch (err) {
    console.warn('Failed to fetch service requests');
  }
  return [];
}

export async function submitServiceRequest(req: { ulpin: string; serviceType: string; applicantName: string; applicantPersonId?: string }): Promise<ServiceRequest | null> {
  try {
    const res = await fetch(`${API_BASE}/services/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) {
      const data = await res.json();
      return data.request;
    }
  } catch (err) {
    console.warn('Failed to submit service request');
  }
  return null;
}

export async function verifyOwnership(ulpin: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/parcels/${ulpin}/ownership/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}
