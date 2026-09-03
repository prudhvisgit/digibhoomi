import fs from 'fs';
import path from 'path';
import {
  ParcelFeature, Person, ParcelOwnership, RoRRecord, RegistrationRecord, Encumbrance,
  ZoningMasterPlan, BuildingPermission, PropertyTax, UtilitiesInfo, EnvironmentalRestrictions,
  LegalDispute, DocumentRecord, TimelineEvent, ServiceRequest, UserNotification, FullParcelDataset
} from '../types';

const BASE_LAT = 17.6868;
const BASE_LON = 83.2185;

export const DEMO_CITIZEN_PERSONS: Person[] = [
  { id: 'PER-001', name: 'Arjun Rao', personType: 'Individual', contact: '+91 98480 11001', address: 'Plot 12, Sector 4, MVP Colony, Visakhapatnam', verificationStatus: 'VERIFIED' },
  { id: 'PER-002', name: 'Sravani Devi', personType: 'Individual', contact: '+91 98480 22002', address: 'D.No 48-14-2, Resapuvanipalem, Visakhapatnam', verificationStatus: 'VERIFIED' },
  { id: 'PER-003', name: 'Kiran Kumar', personType: 'Individual', contact: '+91 98480 33003', address: 'Flat 301, Sun City, Rushikonda, Visakhapatnam', verificationStatus: 'VERIFIED' },
  { id: 'PER-004', name: 'Vijay Sharma', personType: 'Individual', contact: '+91 98480 44004', address: 'Door 10-2-15, Siripuram, Visakhapatnam', verificationStatus: 'VERIFIED' },
  { id: 'PER-005', name: 'Anitha Reddy', personType: 'Individual', contact: '+91 98480 55005', address: 'H.No 2-40, Madhurawada, Visakhapatnam', verificationStatus: 'VERIFIED' },
  { id: 'PER-006', name: 'Satyanarayana Raju', personType: 'Individual', contact: '+91 98480 66006', address: 'D.No 50-2-11, Seethammadhara, Visakhapatnam', verificationStatus: 'VERIFIED' },
  { id: 'PER-007', name: 'Lakshmi Prasanna', personType: 'Individual', contact: '+91 98480 77007', address: 'Plot 45, Gajuwaka Main Road, Visakhapatnam', verificationStatus: 'VERIFIED' },
  { id: 'PER-008', name: 'Venkateswara Rao', personType: 'Individual', contact: '+91 98480 88008', address: 'D.No 12-1-4, Pendurthi, Visakhapatnam', verificationStatus: 'VERIFIED' },
  { id: 'PER-009', name: 'Chaitanya Varma', personType: 'Individual', contact: '+91 98480 99009', address: 'Villa 18, Beach Road, Lawson\'s Bay, Visakhapatnam', verificationStatus: 'VERIFIED' },
  { id: 'PER-010', name: 'Durga Patnaik', personType: 'Individual', contact: '+91 98480 10010', address: 'Door 5-8-19, Akkayyapalem, Visakhapatnam', verificationStatus: 'VERIFIED' }
];

export function generateSeedData(totalParcels: number = 500): {
  geojson: { type: string; features: ParcelFeature[] };
  parcelMap: Record<string, FullParcelDataset>;
  personMap: Record<string, Person>;
  personParcelsMap: Record<string, string[]>;
  serviceRequests: ServiceRequest[];
  notifications: UserNotification[];
  documents: DocumentRecord[];
} {
  const features: ParcelFeature[] = [];
  const parcelMap: Record<string, FullParcelDataset> = {};
  const personMap: Record<string, Person> = {};
  const personParcelsMap: Record<string, string[]> = {};
  const serviceRequests: ServiceRequest[] = [];
  const notifications: UserNotification[] = [];
  const documents: DocumentRecord[] = [];

  DEMO_CITIZEN_PERSONS.forEach(p => {
    personMap[p.id] = p;
    personParcelsMap[p.id] = [];
  });

  const villages = ['Bhoomi Village', 'Rushikonda', 'Madhurawada', 'Pendurthi', 'Gajuwaka'];
  const landUses: ('Residential' | 'Commercial' | 'Agricultural' | 'Industrial' | 'Special Zone')[] = [
    'Residential', 'Residential', 'Residential', 'Commercial', 'Agricultural', 'Industrial', 'Special Zone'
  ];

  for (let i = 1; i <= totalParcels; i++) {
    const ulpin = `AP-VSKP-${String(i).padStart(6, '0')}`;
    const surveyNumber = `${100 + (i % 80)}/${(i % 5) + 1}${['A', 'B', 'C', ''][i % 4]}`;
    const village = villages[i % villages.length];
    const landUse = landUses[i % landUses.length];

    // Assign owner person deterministically from DEMO_CITIZEN_PERSONS
    const ownerPerson = DEMO_CITIZEN_PERSONS[(i - 1) % DEMO_CITIZEN_PERSONS.length];
    personParcelsMap[ownerPerson.id].push(ulpin);

    // Spatial grid
    const gridX = (i % 25);
    const gridY = Math.floor(i / 25);
    const lon = BASE_LON + (gridX * 0.002);
    const lat = BASE_LAT + (gridY * 0.0018);
    const width = 0.0015;
    const height = 0.0013;

    const polygonCoordinates = [[
      [lon, lat],
      [lon + width, lat],
      [lon + width, lat + height],
      [lon, lat + height],
      [lon, lat]
    ]];

    const areaAcres = Number((1.5 + (i % 7) * 0.45).toFixed(2));
    const areaSqMeters = Number((areaAcres * 4046.86).toFixed(2));

    const isRoadAffected = i % 18 === 0;
    const hasDispute = i % 23 === 0;
    const hasActiveMortgage = i % 7 === 0;
    const taxPending = i % 5 === 0;
    const ownershipVerified = i % 9 !== 0;

    const parcelFeature: ParcelFeature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: polygonCoordinates
      },
      properties: {
        ulpin,
        surveyNumber,
        stateCode: 'AP',
        district: 'Visakhapatnam',
        mandal: 'Demo Mandal',
        village,
        areaAcres,
        areaSqMeters,
        landUse,
        status: hasDispute ? 'DISPUTED' : (ownershipVerified ? 'VERIFIED' : 'PENDING_VERIFICATION'),
        ownershipVerified,
        registrationStatus: 'ACTIVE',
        mortgageStatus: hasActiveMortgage ? 'ACTIVE_MORTGAGE' : 'NONE',
        taxStatus: taxPending ? 'PENDING' : 'PAID',
        buildingPermitStatus: landUse === 'Residential' ? (i % 2 === 0 ? 'APPROVED' : 'SUBMITTED') : 'NONE',
        disputeStatus: hasDispute ? 'ACTIVE_DISPUTE' : 'NONE'
      }
    };

    features.push(parcelFeature);

    const docRecord: DocumentRecord = {
      id: `DOC-${String(i).padStart(4, '0')}`,
      ulpin,
      personId: ownerPerson.id,
      documentType: 'Sale Deed',
      documentNumber: `REG-AP-VSKP-${2018000 + i}`,
      documentDate: '2018-04-12',
      verificationStatus: 'VERIFIED',
      uploadedBy: 'Sub-Registrar Office Visakhapatnam-1'
    };
    documents.push(docRecord);

    const dataset: FullParcelDataset = {
      parcel: parcelFeature,
      owners: [
        {
          id: `OWN-${i}-1`,
          parcelId: ulpin,
          ulpin,
          personId: ownerPerson.id,
          personName: ownerPerson.name,
          ownershipShare: 100,
          ownershipType: ownerPerson.personType,
          startDate: '2018-04-12',
          verificationStatus: ownershipVerified ? 'VERIFIED' : 'PENDING',
          sourceDocument: `Registered Sale Deed #${1000 + i}/2018`
        }
      ],
      ror: {
        khataNumber: `KHT-${2000 + i}`,
        surveyNumber,
        pattadarName: ownerPerson.name,
        landType: landUse === 'Agricultural' ? 'Dry Land (Jirayati)' : 'Converted Non-Agricultural',
        extentAcres: areaAcres,
        mutationStatus: 'COMPLETED',
        lastUpdated: '2024-01-15T10:30:00Z',
        verified: ownershipVerified
      },
      registration: [
        {
          registrationNumber: `REG-AP-VSKP-${2018000 + i}`,
          transactionType: 'Sale Deed',
          registrationDate: '2018-04-12',
          sellerPersonId: 'PER-OLD-SELLER',
          sellerName: 'Former Landholder',
          buyerPersonId: ownerPerson.id,
          buyerName: ownerPerson.name,
          considerationValueINR: Math.round(areaAcres * 4500000),
          status: 'COMPLETED',
          subRegistrarOffice: 'Visakhapatnam SRO-1'
        }
      ],
      encumbrance: hasActiveMortgage ? [{
        id: `ENC-${i}`,
        ulpin,
        type: 'Mortgage',
        institution: 'State Bank of India - Visakhapatnam Main Branch',
        amountINR: 2500000,
        startDate: '2022-08-20',
        status: 'ACTIVE'
      }] : [],
      zoning: {
        currentZoning: landUse === 'Residential' ? 'R1 - Primary Residential Zone' : `${landUse} Zone`,
        permittedLandUse: `${landUse}, Mixed Utility`,
        farLimit: landUse === 'Commercial' ? 3.5 : 2.5,
        maxBuildingHeightMeters: landUse === 'Commercial' ? 24 : 15,
        setbackRequirements: { frontMeters: 3.0, rearMeters: 2.0, sideMeters: 1.5 },
        futureRoadExpansion: isRoadAffected,
        expansionDistanceMeters: isRoadAffected ? 12.5 : 0
      },
      buildingPermission: {
        applicationId: `BLD-2025-${5000 + i}`,
        ulpin,
        applicantPersonId: ownerPerson.id,
        applicantName: ownerPerson.name,
        buildingType: landUse === 'Commercial' ? 'Commercial Complex' : 'Residential G+2 House',
        appliedFloors: landUse === 'Commercial' ? 4 : 3,
        approvedAreaSqft: Math.round(areaSqMeters * 0.6 * 10.764),
        applicationDate: '2025-01-10',
        approvalDate: '2025-02-14',
        status: landUse === 'Residential' ? (i % 2 === 0 ? 'APPROVED' : 'SUBMITTED') : 'REJECTED',
        permitNumber: i % 2 === 0 ? `PERMIT-VSKP-2025-${i}` : undefined
      },
      propertyTax: {
        propertyId: `PTAX-VSKP-${8000 + i}`,
        ulpin,
        taxpayerPersonId: ownerPerson.id,
        annualTaxINR: Math.round(areaSqMeters * 45),
        outstandingINR: taxPending ? Math.round(areaSqMeters * 45) : 0,
        lastPaymentDate: taxPending ? '2024-03-31' : '2025-03-28',
        taxStatus: taxPending ? 'PENDING' : 'PAID',
        paymentHistory: [
          { year: 2024, amountINR: Math.round(areaSqMeters * 42), status: 'PAID' },
          { year: 2025, amountINR: Math.round(areaSqMeters * 45), status: taxPending ? 'PENDING' : 'PAID' }
        ]
      },
      utilities: {
        electricity: 'CONNECTED',
        water: 'CONNECTED',
        sewerage: 'AVAILABLE',
        gasPipeline: i % 3 === 0 ? 'AVAILABLE' : 'NOT_AVAILABLE',
        telecomFiber: 'AVAILABLE'
      },
      environment: {
        floodZone: i % 30 === 0,
        coastalRegulationZone: i % 40 === 0,
        waterBodyBufferZone: i % 25 === 0,
        forestZoneDistanceKm: Number((2.5 + (i % 10) * 0.8).toFixed(1)),
        restrictionNotes: i % 30 === 0 ? 'Located within 100-year flood inundation buffer zone' : undefined
      },
      disputes: hasDispute ? [{
        caseId: `OS-${100 + i}/2024`,
        ulpin,
        courtName: 'Junior Civil Judge Court, Visakhapatnam',
        caseType: 'Title Declaration & Injunction Suit',
        filedDate: '2024-06-14',
        parties: `${ownerPerson.name} vs K. Appala Naidu`,
        status: 'IN_HEARING',
        nextHearingDate: '2026-10-15',
        riskLevel: 'HIGH'
      }] : [],
      documents: [docRecord],
      timeline: [
        { year: 2018, date: '2018-04-12', title: 'Parcel Registered', category: 'REGISTRATION', description: `Sale deed registered in favor of ${ownerPerson.name} at Visakhapatnam SRO-1.` },
        { year: 2018, date: '2018-05-01', title: 'RoR Mutation Completed', category: 'OWNERSHIP', description: `Pattadar name updated in Adangal 1B record (Khata KHT-${2000 + i}).` }
      ]
    };

    parcelMap[ulpin] = dataset;
  }

  // Create isolated Service Requests & Notifications per Person
  DEMO_CITIZEN_PERSONS.forEach((p, idx) => {
    const ownedUlpin = personParcelsMap[p.id][0] || `AP-VSKP-000001`;
    const req: ServiceRequest = {
      id: `REQ-2026-${String(idx + 100).padStart(4, '0')}`,
      ulpin: ownedUlpin,
      applicantPersonId: p.id,
      serviceType: idx % 2 === 0 ? 'Ownership Verification' : 'Mutation Request',
      applicantName: p.name,
      applicantRole: 'CITIZEN',
      submittedDate: '2026-08-15',
      assignedDepartment: 'Revenue Department',
      status: 'DOCUMENT_VERIFICATION',
      expectedResolutionDays: 14
    };
    serviceRequests.push(req);

    const notif: UserNotification = {
      id: `NOTIF-${idx + 1}`,
      userId: `USR-${p.id}`,
      personId: p.id,
      title: 'Service Request Update',
      message: `Your request ${req.id} for parcel ${ownedUlpin} is currently under DOCUMENT VERIFICATION by Tahsildar.`,
      timestamp: '2026-08-20T11:00:00Z',
      read: false
    };
    notifications.push(notif);
  });

  return {
    geojson: { type: 'FeatureCollection', features },
    parcelMap,
    personMap,
    personParcelsMap,
    serviceRequests,
    notifications,
    documents
  };
}

if (require.main === module) {
  const data = generateSeedData(500);
  const dataDir = path.join(__dirname, '../../../data/gis');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'parcels.geojson'), JSON.stringify(data.geojson, null, 2));
  console.log(`Generated 500 DigiBhoomi parcels with Person & Data Isolation in ${path.join(dataDir, 'parcels.geojson')}`);
}
