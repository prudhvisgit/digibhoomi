import { Router, Request, Response } from 'express';
import { generateSeedData } from '../db/seed';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/audit';
import { ServiceRequest } from '../types';

const router = Router();
const { serviceRequests } = generateSeedData(500);

// In-memory store for active service requests
const requestsStore: ServiceRequest[] = [...serviceRequests];

// Get all service requests
router.get('/', (req: Request, res: Response) => {
  const { status, ulpin, reqId } = req.query;
  let results = [...requestsStore];

  if (status) {
    results = results.filter(r => r.status.toLowerCase() === (status as string).toLowerCase());
  }
  if (ulpin) {
    results = results.filter(r => r.ulpin.toLowerCase().includes((ulpin as string).toLowerCase()));
  }
  if (reqId) {
    results = results.filter(r => r.id.toLowerCase().includes((reqId as string).toLowerCase()));
  }

  return res.json({
    success: true,
    count: results.length,
    requests: results
  });
});

// Submit new Citizen Service Request
router.post('/requests', (req: Request, res: Response) => {
  const { ulpin, serviceType, applicantName, applicantRole } = req.body;

  if (!ulpin || !serviceType || !applicantName) {
    return res.status(400).json({ success: false, message: 'Missing required parameters: ulpin, serviceType, applicantName' });
  }

  const newRequest: ServiceRequest = {
    id: `REQ-2026-${String(requestsStore.length + 101).padStart(4, '0')}`,
    ulpin: ulpin.toUpperCase(),
    applicantPersonId: req.body.applicantPersonId || 'PER-001',
    serviceType,
    applicantName,
    applicantRole: applicantRole || 'CITIZEN',
    submittedDate: new Date().toISOString().split('T')[0],
    assignedDepartment: serviceType.includes('Building') ? 'Municipal Corporation' : 'Revenue Department',
    status: 'SUBMITTED',
    expectedResolutionDays: 14
  };

  requestsStore.unshift(newRequest);

  logAuditEvent(
    'CITIZEN-GUEST',
    'CITIZEN',
    'SERVICE_REQUEST_SUBMITTED',
    'service_request',
    newRequest.id,
    req.ip || '127.0.0.1',
    null,
    newRequest
  );

  return res.status(201).json({
    success: true,
    message: 'Service request submitted successfully',
    request: newRequest
  });
});

// Government Officer Workflow Status Transition
router.post(
  '/:id/transition',
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { nextStatus } = req.body;

    const request = requestsStore.find(r => r.id.toUpperCase() === id.toUpperCase());
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    const oldStatus = request.status;
    request.status = nextStatus;

    logAuditEvent(
      req.user!.id,
      req.user!.role,
      'WORKFLOW_STATUS_TRANSITION',
      'service_request',
      request.id,
      req.ip || '127.0.0.1',
      { status: oldStatus },
      { status: nextStatus }
    );

    return res.json({
      success: true,
      message: `Request ${id} status updated to ${nextStatus}`,
      request
    });
  }
);

export default router;
