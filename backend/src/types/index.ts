import { Feature, Polygon } from 'geojson';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'STATE_ADMIN'
  | 'DISTRICT_ADMIN'
  | 'REVENUE_OFFICER'
  | 'REGISTRATION_OFFICER'
  | 'MUNICIPAL_OFFICER'
  | 'PLANNING_OFFICER'
  | 'TAX_OFFICER'
  | 'UTILITY_OFFICER'
  | 'ENVIRONMENT_OFFICER'
  | 'CITIZEN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  personId?: string; // Foreign key link to Person entity for Citizens
  department?: string;
  district?: string;
  mandal?: string;
  jurisdiction?: {
    stateCode: string;
    districtName?: string;
    mandalName?: string;
    sroOffice?: string;
    municipality?: string;
  };
  phone?: string;
}

export interface Person {
  id: string;
  name: string;
  personType: 'Individual' | 'Joint' | 'Corporate' | 'Government';
  contact: string;
  address: string;
  verificationStatus: 'VERIFIED' | 'PENDING';
}

export interface ParcelProperties {
  ulpin: string;
  surveyNumber: string;
  stateCode: string;
  district: string;
  mandal: string;
  village: string;
  areaAcres: number;
  areaSqMeters: number;
  landUse: 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial' | 'Special Zone';
  status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'DISPUTED';
  ownershipVerified: boolean;
  registrationStatus: 'ACTIVE' | 'PENDING' | 'FLAGGED';
  mortgageStatus: 'NONE' | 'ACTIVE_MORTGAGE';
  taxStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  buildingPermitStatus: 'NONE' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  disputeStatus: 'NONE' | 'ACTIVE_DISPUTE';
}

export type ParcelFeature = Feature<Polygon, ParcelProperties>;

export interface ParcelOwnership {
  id: string;
  parcelId: string;
  ulpin: string;
  personId: string;
  personName: string;
  ownershipShare: number;
  ownershipType: 'Individual' | 'Joint' | 'Corporate' | 'Government';
  startDate: string;
  verificationStatus: 'VERIFIED' | 'PENDING';
  sourceDocument: string;
}

export interface RoRRecord {
  khataNumber: string;
  surveyNumber: string;
  pattadarName: string;
  landType: string;
  extentAcres: number;
  mutationStatus: 'COMPLETED' | 'IN_PROGRESS' | 'REJECTED';
  lastUpdated: string;
  verified: boolean;
}

export interface RegistrationRecord {
  registrationNumber: string;
  transactionType: 'Sale Deed' | 'Mortgage' | 'Gift Deed' | 'Partition';
  registrationDate: string;
  sellerPersonId: string;
  sellerName: string;
  buyerPersonId: string;
  buyerName: string;
  considerationValueINR: number;
  status: 'COMPLETED' | 'PENDING';
  subRegistrarOffice: string;
}

export interface Encumbrance {
  id: string;
  ulpin: string;
  type: 'Mortgage' | 'Lien' | 'Court Attachment' | 'Government Restriction';
  institution: string;
  amountINR?: number;
  startDate: string;
  expiryDate?: string;
  status: 'ACTIVE' | 'RELEASED';
}

export interface ZoningMasterPlan {
  currentZoning: string;
  permittedLandUse: string;
  farLimit: number;
  maxBuildingHeightMeters: number;
  setbackRequirements: {
    frontMeters: number;
    rearMeters: number;
    sideMeters: number;
  };
  futureRoadExpansion: boolean;
  expansionDistanceMeters: number;
}

export interface BuildingPermission {
  applicationId: string;
  ulpin: string;
  applicantPersonId: string;
  applicantName: string;
  buildingType: string;
  appliedFloors: number;
  approvedAreaSqft: number;
  applicationDate: string;
  approvalDate?: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  permitNumber?: string;
}

export interface PropertyTax {
  propertyId: string;
  ulpin: string;
  taxpayerPersonId: string;
  annualTaxINR: number;
  outstandingINR: number;
  lastPaymentDate?: string;
  taxStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  paymentHistory: {
    year: number;
    amountINR: number;
    status: 'PAID' | 'PENDING';
  }[];
}

export interface UtilitiesInfo {
  electricity: 'CONNECTED' | 'DISCONNECTED' | 'NOT_AVAILABLE';
  water: 'CONNECTED' | 'DISCONNECTED' | 'NOT_AVAILABLE';
  sewerage: 'AVAILABLE' | 'NOT_AVAILABLE';
  gasPipeline: 'AVAILABLE' | 'NOT_AVAILABLE';
  telecomFiber: 'AVAILABLE' | 'NOT_AVAILABLE';
}

export interface EnvironmentalRestrictions {
  floodZone: boolean;
  coastalRegulationZone: boolean;
  waterBodyBufferZone: boolean;
  forestZoneDistanceKm: number;
  restrictionNotes?: string;
}

export interface LegalDispute {
  caseId: string;
  ulpin: string;
  courtName: string;
  caseType: string;
  filedDate: string;
  parties: string;
  status: 'PENDING' | 'IN_HEARING' | 'DISPOSED';
  nextHearingDate?: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface DocumentRecord {
  id: string;
  ulpin: string;
  personId: string;
  documentType: 'Sale Deed' | 'RoR Adangal' | 'Encumbrance Certificate' | 'Tax Receipt' | 'Building Permit' | 'Survey Document';
  documentNumber: string;
  documentDate: string;
  verificationStatus: 'VERIFIED' | 'PENDING';
  uploadedBy: string;
}

export interface TimelineEvent {
  year: number;
  date: string;
  title: string;
  category: 'REGISTRATION' | 'OWNERSHIP' | 'MORTGAGE' | 'PERMIT' | 'TAX' | 'DISPUTE';
  description: string;
}

export interface ServiceRequest {
  id: string;
  ulpin: string;
  applicantPersonId: string;
  serviceType: string;
  applicantName: string;
  applicantRole: string;
  submittedDate: string;
  assignedDepartment: string;
  status: 'SUBMITTED' | 'DOCUMENT_VERIFICATION' | 'TECHNICAL_REVIEW' | 'APPROVED' | 'REJECTED';
  expectedResolutionDays: number;
}

export interface UserNotification {
  id: string;
  userId: string;
  personId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface FullParcelDataset {
  parcel: ParcelFeature;
  owners: ParcelOwnership[];
  ror: RoRRecord;
  registration: RegistrationRecord[];
  encumbrance: Encumbrance[];
  zoning: ZoningMasterPlan;
  buildingPermission: BuildingPermission;
  propertyTax: PropertyTax;
  utilities: UtilitiesInfo;
  environment: EnvironmentalRestrictions;
  disputes: LegalDispute[];
  documents: DocumentRecord[];
  timeline: TimelineEvent[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  ipAddress: string;
  beforeValue?: any;
  afterValue?: any;
}

export interface MySummary {
  person: Person;
  myProperties: ParcelFeature[];
  myRequests: ServiceRequest[];
  myDocuments: DocumentRecord[];
  myNotifications: UserNotification[];
  totalTaxDueINR: number;
}

export interface AIRiskScore {
  ulpin: string;
  score: number;
  category: 'LOW' | 'MEDIUM' | 'HIGH';
  positiveDrivers: string[];
  riskDrivers: string[];
}

export interface DataAnomaly {
  id: string;
  ulpin: string;
  type: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  detectedAt: string;
}
