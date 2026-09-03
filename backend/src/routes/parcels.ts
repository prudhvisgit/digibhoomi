import { Router, Request, Response } from 'express';
import { generateSeedData } from '../db/seed';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
import { logAuditEvent } from '../middleware/audit';

const router = Router();

// Generate seeded dataset (500 parcels)
const { geojson, parcelMap } = generateSeedData(500);

// Get full GeoJSON for GIS map
router.get('/geojson', (req: Request, res: Response) => {
  const { village, landUse } = req.query;
  let features = geojson.features;

  if (village) {
    features = features.filter(f => f.properties.village.toLowerCase() === (village as string).toLowerCase());
  }
  if (landUse) {
    features = features.filter(f => f.properties.landUse.toLowerCase() === (landUse as string).toLowerCase());
  }

  return res.json({
    type: 'FeatureCollection',
    features
  });
});

// Search & list parcels with query parameters
router.get('/', (req: Request, res: Response) => {
  const { search, ulpin, surveyNumber, owner, district, mandal, village, landUse } = req.query;
  let results = Object.values(parcelMap);

  if (ulpin) {
    results = results.filter(p => p.parcel.properties.ulpin.toLowerCase().includes((ulpin as string).toLowerCase()));
  }
  if (surveyNumber) {
    results = results.filter(p => p.parcel.properties.surveyNumber.toLowerCase().includes((surveyNumber as string).toLowerCase()));
  }
  if (village) {
    results = results.filter(p => p.parcel.properties.village.toLowerCase() === (village as string).toLowerCase());
  }
  if (landUse) {
    results = results.filter(p => p.parcel.properties.landUse.toLowerCase() === (landUse as string).toLowerCase());
  }
  if (owner) {
    results = results.filter(p => p.owners.some(o => o.personName.toLowerCase().includes((owner as string).toLowerCase())));
  }
  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(p =>
      p.parcel.properties.ulpin.toLowerCase().includes(q) ||
      p.parcel.properties.surveyNumber.toLowerCase().includes(q) ||
      p.parcel.properties.village.toLowerCase().includes(q) ||
      p.owners.some(o => o.personName.toLowerCase().includes(q))
    );
  }

  return res.json({
    success: true,
    total: results.length,
    parcels: results.map(r => r.parcel.properties)
  });
});

// Get detailed multi-tab parcel record by ULPIN
router.get('/:ulpin', (req: Request, res: Response) => {
  const ulpin = req.params.ulpin.toUpperCase();
  const dataset = parcelMap[ulpin];

  if (!dataset) {
    return res.status(404).json({
      success: false,
      message: `Parcel with ULPIN '${ulpin}' not found`
    });
  }

  return res.json({
    success: true,
    data: dataset
  });
});

// Specific Tab Endpoints
router.get('/:ulpin/ownership', (req: Request, res: Response) => {
  const dataset = parcelMap[req.params.ulpin.toUpperCase()];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });
  return res.json({ success: true, data: dataset.owners });
});

router.get('/:ulpin/ror', (req: Request, res: Response) => {
  const dataset = parcelMap[req.params.ulpin.toUpperCase()];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });
  return res.json({ success: true, data: dataset.ror });
});

router.get('/:ulpin/registration', (req: Request, res: Response) => {
  const dataset = parcelMap[req.params.ulpin.toUpperCase()];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });
  return res.json({ success: true, data: dataset.registration });
});

router.get('/:ulpin/encumbrance', (req: Request, res: Response) => {
  const dataset = parcelMap[req.params.ulpin.toUpperCase()];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });
  return res.json({ success: true, data: dataset.encumbrance });
});

router.get('/:ulpin/zoning', (req: Request, res: Response) => {
  const dataset = parcelMap[req.params.ulpin.toUpperCase()];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });
  return res.json({ success: true, data: dataset.zoning });
});

router.get('/:ulpin/building-permissions', (req: Request, res: Response) => {
  const dataset = parcelMap[req.params.ulpin.toUpperCase()];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });
  return res.json({ success: true, data: dataset.buildingPermission });
});

router.get('/:ulpin/tax', (req: Request, res: Response) => {
  const dataset = parcelMap[req.params.ulpin.toUpperCase()];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });
  return res.json({ success: true, data: dataset.propertyTax });
});

router.get('/:ulpin/utilities', (req: Request, res: Response) => {
  const dataset = parcelMap[req.params.ulpin.toUpperCase()];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });
  return res.json({ success: true, data: dataset.utilities });
});

router.get('/:ulpin/environment', (req: Request, res: Response) => {
  const dataset = parcelMap[req.params.ulpin.toUpperCase()];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });
  return res.json({ success: true, data: dataset.environment });
});

router.get('/:ulpin/disputes', (req: Request, res: Response) => {
  const dataset = parcelMap[req.params.ulpin.toUpperCase()];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });
  return res.json({ success: true, data: dataset.disputes });
});

router.get('/:ulpin/timeline', (req: Request, res: Response) => {
  const dataset = parcelMap[req.params.ulpin.toUpperCase()];
  if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });
  return res.json({ success: true, data: dataset.timeline });
});

// Government Officer Action: Verify Ownership Record
router.post(
  '/:ulpin/ownership/verify',
  authenticateToken,
  authorizeRoles('REVENUE_OFFICER', 'SUPER_ADMIN'),
  (req: AuthenticatedRequest, res: Response) => {
    const ulpin = req.params.ulpin.toUpperCase();
    const dataset = parcelMap[ulpin];
    if (!dataset) return res.status(404).json({ success: false, message: 'Parcel not found' });

    dataset.parcel.properties.ownershipVerified = true;
    dataset.parcel.properties.status = 'VERIFIED';
    dataset.owners.forEach(o => o.verificationStatus = 'VERIFIED');
    dataset.ror.verified = true;

    // Log in Immutable Audit Trail
    logAuditEvent(
      req.user!.id,
      req.user!.role,
      'OWNERSHIP_VERIFIED',
      'parcel',
      ulpin,
      req.ip || '127.0.0.1',
      { status: 'PENDING_VERIFICATION' },
      { status: 'VERIFIED' }
    );

    return res.json({
      success: true,
      message: `Ownership records for parcel ${ulpin} verified successfully.`,
      data: dataset.owners
    });
  }
);

export { parcelMap };
export default router;
