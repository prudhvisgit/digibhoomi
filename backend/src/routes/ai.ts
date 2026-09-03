import { Router, Request, Response } from 'express';
import { parcelMap } from './parcels';
import { AIRiskScore, DataAnomaly } from '../types';

const router = Router();

// AI Feature 1: Land Risk Score Engine (0-100) with explainable positive/negative drivers
router.get('/risk-score/:ulpin', (req: Request, res: Response) => {
  const ulpin = req.params.ulpin.toUpperCase();
  const dataset = parcelMap[ulpin];

  if (!dataset) {
    return res.status(404).json({ success: false, message: 'Parcel not found' });
  }

  const p = dataset.parcel.properties;
  let score = 15; // Base low risk score
  const positiveDrivers: string[] = [];
  const riskDrivers: string[] = [];

  // Ownership evaluation
  if (p.ownershipVerified) {
    positiveDrivers.push('✓ Ownership record is verified by Tahsildar / Revenue Department');
  } else {
    score += 20;
    riskDrivers.push('⚠ Pending ownership verification record');
  }

  // Encumbrance evaluation
  if (p.mortgageStatus === 'ACTIVE_MORTGAGE') {
    score += 25;
    riskDrivers.push('⚠ Active mortgage lien registered by financial institution');
  } else {
    positiveDrivers.push('✓ No active bank mortgages or encumbrances registered');
  }

  // Legal dispute evaluation
  if (p.disputeStatus === 'ACTIVE_DISPUTE' || dataset.disputes.length > 0) {
    score += 35;
    riskDrivers.push('⚠ Active civil court dispute / title litigation pending');
  } else {
    positiveDrivers.push('✓ Zero pending civil court suits or title disputes');
  }

  // Tax status evaluation
  if (p.taxStatus === 'PENDING') {
    score += 15;
    riskDrivers.push('⚠ Outstanding municipal property tax dues pending payment');
  } else {
    positiveDrivers.push('✓ Municipal property tax up-to-date');
  }

  // Zoning & Road expansion evaluation
  if (dataset.zoning.futureRoadExpansion) {
    score += 15;
    riskDrivers.push(`⚠ Parcel falls inside proposed master plan road expansion zone (${dataset.zoning.expansionDistanceMeters}m impact)`);
  } else {
    positiveDrivers.push('✓ Clear of proposed master plan road expansions');
  }

  // Environmental evaluation
  if (dataset.environment.floodZone) {
    score += 20;
    riskDrivers.push('⚠ Parcel falls inside 100-year flood inundation risk zone');
  }

  score = Math.min(100, Math.max(0, score));
  const category: AIRiskScore['category'] = score > 60 ? 'HIGH' : score > 35 ? 'MEDIUM' : 'LOW';

  const riskResult: AIRiskScore = {
    ulpin,
    score,
    category,
    positiveDrivers,
    riskDrivers
  };

  return res.json({
    success: true,
    data: riskResult
  });
});

// AI Feature 2: Data Anomaly Detection Engine
router.get('/anomalies', (req: Request, res: Response) => {
  const anomalies: DataAnomaly[] = [];

  Object.values(parcelMap).forEach(({ parcel, ror, registration }) => {
    const p = parcel.properties;

    // Check Area Mismatch between RoR extent, Registration deed area, and GIS spatial geometry
    const rorAcres = ror.extentAcres;
    const gisAcres = p.areaAcres;

    if (Math.abs(rorAcres - gisAcres) > 0.3) {
      anomalies.push({
        id: `ANOM-${p.ulpin}-AREA`,
        ulpin: p.ulpin,
        type: 'AREA_MISMATCH',
        severity: 'CRITICAL',
        description: `Spatial polygon area (${gisAcres} acres) differs from RoR Adangal record (${rorAcres} acres) by ${Math.abs(rorAcres - gisAcres).toFixed(2)} acres.`,
        detectedAt: new Date().toISOString()
      });
    }

    // Check duplicate or unverified ownership anomalies
    if (!p.ownershipVerified && p.status === 'PENDING_VERIFICATION') {
      anomalies.push({
        id: `ANOM-${p.ulpin}-VERIF`,
        ulpin: p.ulpin,
        type: 'UNVERIFIED_RECORD',
        severity: 'WARNING',
        description: 'Ownership Pattadar record pending physical field verification.',
        detectedAt: new Date().toISOString()
      });
    }
  });

  return res.json({
    success: true,
    count: anomalies.length,
    anomalies: anomalies.slice(0, 20) // Return top 20 detected anomalies
  });
});

// AI Feature 3: Simulated Satellite Change Detection Engine
router.get('/change-detection/:ulpin', (req: Request, res: Response) => {
  const ulpin = req.params.ulpin.toUpperCase();
  const dataset = parcelMap[ulpin];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });

  return res.json({
    success: true,
    data: {
      ulpin,
      historicalPeriod: '2023 vs 2026',
      detectedChanges: [
        {
          changeType: 'New Structure Detected',
          confidence: 0.94,
          areaSqMeters: 450,
          notes: 'Unsanctioned structural footprint expansion detected on Northern boundary.'
        },
        {
          changeType: 'Vegetation Loss',
          confidence: 0.88,
          areaSqMeters: 1200,
          notes: 'Clearing of agricultural green cover for non-agricultural site preparation.'
        }
      ],
      satelliteImages: {
        before: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
        after: 'https://images.unsplash.com/photo-1590247819200-88001e3b664d?auto=format&fit=crop&w=600&q=80'
      }
    }
  });
});

// AI Feature 4: Application Delay Prediction Engine
router.get('/delay-prediction', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      predictedDelayRisk: 'MEDIUM',
      estimatedDaysToResolve: 18,
      bottleneckDepartment: 'Revenue & Land Records (Sub-Divisional Office)',
      delayFactors: [
        'High backlog of pending mutation requests in Visakhapatnam Mandal',
        'Field physical survey verification step queued'
      ]
    }
  });
});

export default router;
