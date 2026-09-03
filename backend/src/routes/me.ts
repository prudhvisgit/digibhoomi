import { Router, Response } from 'express';
import { generateSeedData } from '../db/seed';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { MySummary } from '../types';

const router = Router();
const { parcelMap, personMap, personParcelsMap, serviceRequests, notifications, documents } = generateSeedData(500);

// Get personalized Citizen "MY DIGIBHOOMI" Dashboard Summary
router.get('/summary', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const personId = user.personId || 'PER-001';
  const person = personMap[personId] || { id: personId, name: user.name, personType: 'Individual', contact: '', address: '', verificationStatus: 'VERIFIED' };

  // Filter ONLY properties owned by this specific Person ID
  const ownedUlpins = personParcelsMap[personId] || [];
  const myProperties = Object.values(parcelMap)
    .filter(p => ownedUlpins.includes(p.parcel.properties.ulpin))
    .map(p => p.parcel);

  // Filter ONLY requests submitted by this Person ID
  const myRequests = serviceRequests.filter(r => r.applicantPersonId === personId);

  // Filter ONLY documents belonging to this Person ID
  const myDocuments = documents.filter(d => d.personId === personId);

  // Filter ONLY notifications sent to this Person ID
  const myNotifications = notifications.filter(n => n.personId === personId);

  // Calculate total outstanding tax due for ONLY my properties
  const totalTaxDueINR = Object.values(parcelMap)
    .filter(p => ownedUlpins.includes(p.parcel.properties.ulpin))
    .reduce((sum, p) => sum + p.propertyTax.outstandingINR, 0);

  const summary: MySummary = {
    person,
    myProperties,
    myRequests,
    myDocuments,
    myNotifications,
    totalTaxDueINR
  };

  return res.json({
    success: true,
    data: summary
  });
});

// Explicit Person Property List
router.get('/properties', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const personId = req.user!.personId || 'PER-001';
  const ownedUlpins = personParcelsMap[personId] || [];
  const myProperties = Object.values(parcelMap)
    .filter(p => ownedUlpins.includes(p.parcel.properties.ulpin))
    .map(p => p.parcel.properties);

  return res.json({
    success: true,
    count: myProperties.length,
    properties: myProperties
  });
});

// Explicit Person Service Requests List
router.get('/requests', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const personId = req.user!.personId || 'PER-001';
  const myRequests = serviceRequests.filter(r => r.applicantPersonId === personId);

  return res.json({
    success: true,
    count: myRequests.length,
    requests: myRequests
  });
});

export default router;
