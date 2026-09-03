import { Router, Request, Response } from 'express';

const router = Router();

const DEPARTMENTAL_APIS = [
  {
    name: 'Land Records & RoR Service (Meebhoomi API)',
    department: 'Revenue Department',
    status: 'ONLINE',
    latencyMs: 42,
    recordsSyncedToday: 14250,
    failedRequests: 0
  },
  {
    name: 'Registration & Stamps API (CARD System)',
    department: 'Registration Department',
    status: 'ONLINE',
    latencyMs: 58,
    recordsSyncedToday: 8920,
    failedRequests: 2
  },
  {
    name: 'Municipal & Master Plan Service (VMRDA API)',
    department: 'Municipal Urban Planning',
    status: 'ONLINE',
    latencyMs: 65,
    recordsSyncedToday: 4310,
    failedRequests: 0
  },
  {
    name: 'Property Tax API (CDMA Portal)',
    department: 'Municipal Administration',
    status: 'ONLINE',
    latencyMs: 38,
    recordsSyncedToday: 19800,
    failedRequests: 1
  },
  {
    name: 'Utility Infrastructure API (APEPDCL & Water Board)',
    department: 'Energy & Water Resources',
    status: 'ONLINE',
    latencyMs: 72,
    recordsSyncedToday: 12400,
    failedRequests: 0
  },
  {
    name: 'Judiciary E-Courts Integration API',
    department: 'Law & Justice',
    status: 'DEGRADED',
    latencyMs: 240,
    recordsSyncedToday: 1850,
    failedRequests: 14
  }
];

// Departmental Interoperability Status Endpoint
router.get('/status', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: DEPARTMENTAL_APIS
  });
});

// Integration Sync Logs Endpoint
router.get('/logs', (req: Request, res: Response) => {
  return res.json({
    success: true,
    logs: [
      { id: 'LOG-8801', api: 'Meebhoomi RoR API', status: '200 OK', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), payload: 'Synced 120 parcel Adangal updates' },
      { id: 'LOG-8802', api: 'Registration CARD API', status: '200 OK', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), payload: 'Deed registration sync: REG-AP-VSKP-202604' },
      { id: 'LOG-8803', api: 'CDMA Property Tax', status: '200 OK', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), payload: 'Tax assessment updates processed' },
      { id: 'LOG-8804', api: 'E-Courts Litigation API', status: '408 TIMEOUT', timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), payload: 'Court case sync retry scheduled' }
    ]
  });
});

export default router;
