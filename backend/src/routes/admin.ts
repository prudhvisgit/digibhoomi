import { Router, Request, Response } from 'express';
import { getAuditLogs } from '../middleware/audit';
import { parcelMap } from './parcels';
import stateConfig from '../config/state_config.json';

const router = Router();

// Executive KPIs Analytics Dashboard Endpoint
router.get('/analytics/kpis', (req: Request, res: Response) => {
  const parcelsList = Object.values(parcelMap);
  const totalParcels = parcelsList.length;
  const verifiedParcels = parcelsList.filter(p => p.parcel.properties.status === 'VERIFIED').length;
  const pendingVerifications = parcelsList.filter(p => p.parcel.properties.status === 'PENDING_VERIFICATION').length;
  const activeDisputes = parcelsList.filter(p => p.parcel.properties.disputeStatus === 'ACTIVE_DISPUTE').length;
  const activeMortgages = parcelsList.filter(p => p.parcel.properties.mortgageStatus === 'ACTIVE_MORTGAGE').length;
  const taxPaid = parcelsList.filter(p => p.parcel.properties.taxStatus === 'PAID').length;
  const taxPending = parcelsList.filter(p => p.parcel.properties.taxStatus === 'PENDING').length;

  const landUseCounts: Record<string, number> = {};
  parcelsList.forEach(p => {
    const lu = p.parcel.properties.landUse;
    landUseCounts[lu] = (landUseCounts[lu] || 0) + 1;
  });

  return res.json({
    success: true,
    data: {
      totalParcels,
      verifiedParcels,
      pendingVerifications,
      activeDisputes,
      activeMortgages,
      taxPaid,
      taxPending,
      totalTaxCollectedINR: 42500000,
      totalTransactionsThisMonth: 148,
      landUseDistribution: Object.entries(landUseCounts).map(([name, value]) => ({ name, value }))
    }
  });
});

// State-wide Andhra Pradesh Overview Analytics Endpoint
router.get('/analytics/state', (req: Request, res: Response) => {
  const apDistricts = stateConfig.states.AP.districts;

  return res.json({
    success: true,
    data: {
      stateName: 'Andhra Pradesh',
      stateCode: 'AP',
      totalDistricts: apDistricts.length,
      totalParcelsMapped: 142500,
      totalVerifiedRoRPercentage: 92.4,
      totalTaxRevenueCrINR: 148.5,
      districts: apDistricts.map(d => ({
        code: d.code,
        name: d.name,
        parcelsCount: d.parcelsCount,
        verifiedRoRPercentage: 90 + (d.code === 'VSKP' ? 4 : Math.floor(Math.random() * 5)),
        activeDisputes: d.code === 'VSKP' ? 13 : Math.floor(Math.random() * 15) + 5,
        isDetailedDemo: d.isDetailedDemo
      }))
    }
  });
});

// Audit Trail Logs Endpoint
router.get('/audit/logs', (req: Request, res: Response) => {
  return res.json({
    success: true,
    logs: getAuditLogs()
  });
});

export default router;
