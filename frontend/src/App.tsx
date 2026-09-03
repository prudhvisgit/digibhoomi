import React, { useEffect, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { LoginModal, DEMO_ACCOUNTS } from './components/auth/LoginModal';
import { GisExplorer } from './components/gis/GisExplorer';
import { LayerControl, LayerState } from './components/gis/LayerControl';
import { MapLegend } from './components/gis/MapLegend';
import { ParcelProfileDrawer } from './components/parcel/ParcelProfileDrawer';
import { GovernmentDashboard } from './pages/GovernmentDashboard';
import { CitizenPortal } from './pages/CitizenPortal';
import { MyDigiBhoomi } from './pages/MyDigiBhoomi';
import { AndhraPradeshStateDashboard } from './pages/AndhraPradeshStateDashboard';
import { IntegrationMonitor } from './pages/IntegrationMonitor';
import { DataQualityDashboard } from './pages/DataQualityDashboard';
import { LandRecordsPage } from './pages/LandRecordsPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { EncumbrancePage } from './pages/EncumbrancePage';
import { PlanningPage } from './pages/PlanningPage';
import { BuildingPermissionPage } from './pages/BuildingPermissionPage';
import { PropertyTaxPage } from './pages/PropertyTaxPage';
import { DisputesPage } from './pages/DisputesPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { DemoScenarioBar } from './components/demo/DemoScenarioBar';
import { FullParcelDataset, ParcelFeature, UserRole, ServiceRequest, MySummary } from './types';
import { fetchGeoJSON, fetchParcelByUlpin, fetchServiceRequests, submitServiceRequest, verifyOwnership, fetchMySummary } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('my-digibhoomi');
  const [currentState, setCurrentState] = useState<string>('AP');
  
  // Current User Session (Default: Citizen 1 - Arjun Rao)
  const [userSession, setUserSession] = useState({
    name: DEMO_ACCOUNTS[5].name, // Citizen 1: Arjun Rao
    email: DEMO_ACCOUNTS[5].email,
    role: DEMO_ACCOUNTS[5].role as UserRole,
    personId: DEMO_ACCOUNTS[5].personId || 'PER-001',
    department: DEMO_ACCOUNTS[5].department
  });
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [geoJsonData, setGeoJsonData] = useState<{ type: string; features: ParcelFeature[] } | null>(null);
  const [selectedUlpin, setSelectedUlpin] = useState<string | null>('AP-VSKP-000123');
  const [selectedDataset, setSelectedDataset] = useState<FullParcelDataset | null>(null);
  const [parcelsList, setParcelsList] = useState<FullParcelDataset[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  // My Summary Personal Data Isolation
  const [mySummary, setMySummary] = useState<MySummary>({
    person: { id: userSession.personId || 'PER-001', name: 'Arjun Rao', personType: 'Individual', contact: '+91 98480 11001', address: 'MVP Colony, Visakhapatnam', verificationStatus: 'VERIFIED' },
    myProperties: [],
    myRequests: [],
    myDocuments: [],
    myNotifications: [],
    totalTaxDueINR: 0
  });

  const [baseMap, setBaseMap] = useState<'street' | 'satellite' | 'dark'>('street');
  const [layers, setLayers] = useState<LayerState>({
    parcelBoundaries: true,
    ulpinLabels: true,
    ownershipStatus: false,
    landUseZoning: false,
    masterPlanRoads: false,
    buildingPermits: false,
    propertyTax: false,
    utilities: false,
    environmentalZones: false,
    floodZones: false,
    courtDisputes: false
  });

  // Fetch GeoJSON and Service Requests on mount
  useEffect(() => {
    fetchGeoJSON().then((res) => {
      setGeoJsonData(res);
      // Pre-populate full datasets for list pages
      const list: FullParcelDataset[] = res.features.map(f => {
        const ulpin = f.properties.ulpin;
        return {
          parcel: f,
          owners: [{ id: '1', parcelId: ulpin, ulpin, personId: 'PER-001', personName: 'Pattadar Owner', ownershipShare: 100, ownershipType: 'Individual', startDate: '2018-04-12', verificationStatus: f.properties.ownershipVerified ? 'VERIFIED' : 'PENDING', sourceDocument: 'Sale Deed #1024/2018' }],
          ror: { khataNumber: `KHT-${ulpin.split('-')[2]}`, surveyNumber: f.properties.surveyNumber, pattadarName: 'Pattadar Owner', landType: f.properties.landUse === 'Agricultural' ? 'Dry Land (Jirayati)' : 'Converted Non-Agricultural', extentAcres: f.properties.areaAcres, mutationStatus: 'COMPLETED', lastUpdated: new Date().toISOString(), verified: f.properties.ownershipVerified },
          registration: [{ registrationNumber: `REG-AP-VSKP-2018${ulpin.split('-')[2]}`, transactionType: 'Sale Deed', registrationDate: '2018-04-12', sellerPersonId: 'PER-OLD', sellerName: 'Former Owner', buyerPersonId: 'PER-001', buyerName: 'Pattadar Owner', considerationValueINR: Math.round(f.properties.areaAcres * 4500000), status: 'COMPLETED', subRegistrarOffice: 'Visakhapatnam SRO-1' }],
          encumbrance: f.properties.mortgageStatus === 'ACTIVE_MORTGAGE' ? [{ id: 'ENC-1', ulpin, type: 'Mortgage', institution: 'State Bank of India', amountINR: 2500000, startDate: '2022-08-20', status: 'ACTIVE' }] : [],
          zoning: { currentZoning: 'Residential R1', permittedLandUse: 'Residential, Mixed Utility', farLimit: 2.5, maxBuildingHeightMeters: 15, setbackRequirements: { frontMeters: 3, rearMeters: 2, sideMeters: 1.5 }, futureRoadExpansion: ulpin.endsWith('0'), expansionDistanceMeters: ulpin.endsWith('0') ? 12.5 : 0 },
          buildingPermission: { applicationId: `BLD-2025-${ulpin.split('-')[2]}`, ulpin, applicantPersonId: 'PER-001', applicantName: 'Pattadar Owner', buildingType: 'Residential G+2', appliedFloors: 3, approvedAreaSqft: 2400, applicationDate: '2025-01-10', approvalDate: '2025-02-14', status: 'APPROVED', permitNumber: 'PERMIT-VSKP-2025' },
          propertyTax: { propertyId: `PTAX-VSKP-${ulpin.split('-')[2]}`, ulpin, taxpayerPersonId: 'PER-001', annualTaxINR: Math.round(f.properties.areaSqMeters * 45), outstandingINR: f.properties.taxStatus === 'PENDING' ? Math.round(f.properties.areaSqMeters * 45) : 0, lastPaymentDate: '2025-03-28', taxStatus: f.properties.taxStatus, paymentHistory: [{ year: 2025, amountINR: 12500, status: 'PAID' }] },
          utilities: { electricity: 'CONNECTED', water: 'CONNECTED', sewerage: 'AVAILABLE', gasPipeline: 'AVAILABLE', telecomFiber: 'AVAILABLE' },
          environment: { floodZone: false, coastalRegulationZone: false, waterBodyBufferZone: false, forestZoneDistanceKm: 4.2 },
          disputes: f.properties.disputeStatus === 'ACTIVE_DISPUTE' ? [{ caseId: `OS-102/2024`, ulpin, courtName: 'Junior Civil Judge Court', caseType: 'Title Dispute', filedDate: '2024-06-14', parties: 'Pattadar vs K. Appala Naidu', status: 'IN_HEARING', riskLevel: 'HIGH' }] : [],
          documents: [{ id: 'DOC-001', ulpin, personId: 'PER-001', documentType: 'Sale Deed', documentNumber: 'REG-AP-VSKP-2018', documentDate: '2018-04-12', verificationStatus: 'VERIFIED', uploadedBy: 'Sub-Registrar Office' }],
          timeline: [{ year: 2018, date: '2018-04-12', title: 'Parcel Registered', category: 'REGISTRATION', description: 'Deed registered at Visakhapatnam SRO-1.' }]
        };
      });
      setParcelsList(list);
    });
    fetchServiceRequests().then(setServiceRequests);
    handleSelectParcel('AP-VSKP-000123');
  }, []);

  // Refresh My Summary whenever user session changes
  useEffect(() => {
    if (userSession.role === 'CITIZEN') {
      fetchMySummary('demo-token').then(res => {
        if (res) setMySummary(res);
      });
    }
  }, [userSession]);

  // Fetch full parcel detail dataset when a parcel is clicked
  const handleSelectParcel = async (ulpin: string) => {
    setSelectedUlpin(ulpin);
    const data = await fetchParcelByUlpin(ulpin);
    if (data) {
      setSelectedDataset(data);
    } else {
      if (geoJsonData) {
        const feature = geoJsonData.features.find(f => f.properties.ulpin === ulpin);
        if (feature) {
          const fallbackData: FullParcelDataset = {
            parcel: feature,
            owners: [{ id: '1', parcelId: ulpin, ulpin, personId: userSession.personId || 'PER-001', personName: userSession.name, ownershipShare: 100, ownershipType: 'Individual', startDate: '2018-04-12', verificationStatus: 'VERIFIED', sourceDocument: 'Sale Deed #1024/2018' }],
            ror: { khataNumber: 'KHT-2024', surveyNumber: feature.properties.surveyNumber, pattadarName: userSession.name, landType: 'Dry Land (Jirayati)', extentAcres: feature.properties.areaAcres, mutationStatus: 'COMPLETED', lastUpdated: new Date().toISOString(), verified: true },
            registration: [{ registrationNumber: 'REG-AP-VSKP-201804', transactionType: 'Sale Deed', registrationDate: '2018-04-12', sellerPersonId: 'PER-OLD', sellerName: 'Former Owner', buyerPersonId: userSession.personId || 'PER-001', buyerName: userSession.name, considerationValueINR: 4500000, status: 'COMPLETED', subRegistrarOffice: 'Visakhapatnam SRO-1' }],
            encumbrance: [],
            zoning: { currentZoning: 'Residential R1', permittedLandUse: 'Residential, Mixed Utility', farLimit: 2.5, maxBuildingHeightMeters: 15, setbackRequirements: { frontMeters: 3, rearMeters: 2, sideMeters: 1.5 }, futureRoadExpansion: ulpin.endsWith('0'), expansionDistanceMeters: ulpin.endsWith('0') ? 12.5 : 0 },
            buildingPermission: { applicationId: 'BLD-2025-5012', ulpin, applicantPersonId: userSession.personId || 'PER-001', applicantName: userSession.name, buildingType: 'Residential G+2', appliedFloors: 3, approvedAreaSqft: 2400, applicationDate: '2025-01-10', approvalDate: '2025-02-14', status: 'APPROVED', permitNumber: 'PERMIT-VSKP-2025-12' },
            propertyTax: { propertyId: 'PTAX-VSKP-8012', ulpin, taxpayerPersonId: userSession.personId || 'PER-001', annualTaxINR: 12500, outstandingINR: 0, lastPaymentDate: '2025-03-28', taxStatus: 'PAID', paymentHistory: [{ year: 2025, amountINR: 12500, status: 'PAID' }] },
            utilities: { electricity: 'CONNECTED', water: 'CONNECTED', sewerage: 'AVAILABLE', gasPipeline: 'AVAILABLE', telecomFiber: 'AVAILABLE' },
            environment: { floodZone: false, coastalRegulationZone: false, waterBodyBufferZone: false, forestZoneDistanceKm: 4.2 },
            disputes: [],
            documents: [{ id: 'DOC-001', ulpin, personId: userSession.personId || 'PER-001', documentType: 'Sale Deed', documentNumber: 'REG-AP-VSKP-201804', documentDate: '2018-04-12', verificationStatus: 'VERIFIED', uploadedBy: 'Sub-Registrar Office' }],
            timeline: [{ year: 2018, date: '2018-04-12', title: 'Parcel Registered', category: 'REGISTRATION', description: `Deed registered in favor of ${userSession.name} at Visakhapatnam SRO-1.` }]
          };
          setSelectedDataset(fallbackData);
        }
      }
    }
  };

  const handleLayerToggle = (key: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUniversalSearch = () => {
    if (!searchQuery) return;
    const q = searchQuery.trim().toUpperCase();
    if (q.startsWith('AP-') || q.startsWith('REQ-') || q.length >= 4) {
      const found = geoJsonData?.features.find(f =>
        f.properties.ulpin.includes(q) ||
        f.properties.surveyNumber.includes(q)
      );
      if (found) {
        handleSelectParcel(found.properties.ulpin);
        setActiveTab('gis-map');
      } else {
        handleSelectParcel('AP-VSKP-000123');
        setActiveTab('gis-map');
      }
    }
  };

  const handleVerifyOwnership = async (ulpin: string) => {
    await verifyOwnership(ulpin, 'demo-token');
    if (selectedDataset) {
      setSelectedDataset({
        ...selectedDataset,
        parcel: {
          ...selectedDataset.parcel,
          properties: {
            ...selectedDataset.parcel.properties,
            ownershipVerified: true,
            status: 'VERIFIED'
          }
        }
      });
    }
  };

  const handleSubmitRequest = async (req: { ulpin: string; serviceType: string; applicantName: string }) => {
    await submitServiceRequest({ ...req, applicantPersonId: userSession.personId });
    const newReqList = await fetchServiceRequests();
    setServiceRequests(newReqList);
  };

  // Demo Scenarios Execution for SIH Judges
  const handleRunScenario = (scenario: 1 | 2 | 3) => {
    if (scenario === 1) {
      setUserSession({ name: 'Arjun Rao (Citizen 1 - PER-001)', email: 'citizen1@digibhoomi.gov.in', role: 'CITIZEN', personId: 'PER-001', department: 'Citizen Public Services' });
      setActiveTab('my-digibhoomi');
    } else if (scenario === 2) {
      setActiveTab('gis-map');
      setLayers(prev => ({ ...prev, masterPlanRoads: true, parcelBoundaries: true }));
    } else if (scenario === 3) {
      setActiveTab('ai-analytics');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 font-sans overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        currentState={currentState}
        onStateChange={setCurrentState}
        currentRole={userSession.role}
        userName={userSession.name}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleUniversalSearch}
      />

      {/* SIH Demo Scenario Quick Trigger Bar */}
      <DemoScenarioBar onRunScenario={handleRunScenario} />

      {/* Main App Layout Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar Navigation (Role-Tailored) */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          userRole={userSession.role}
        />

        {/* Main Content Workspace (100% Dedicated Interactive Pages) */}
        <main className="flex-1 relative overflow-hidden bg-slate-950">
          {activeTab === 'my-digibhoomi' && (
            <MyDigiBhoomi
              person={mySummary.person}
              myProperties={mySummary.myProperties}
              myRequests={mySummary.myRequests}
              myDocuments={mySummary.myDocuments}
              myNotifications={mySummary.myNotifications}
              totalTaxDueINR={mySummary.totalTaxDueINR}
              onSelectParcel={(ulpin) => { handleSelectParcel(ulpin); setActiveTab('gis-map'); }}
            />
          )}

          {activeTab === 'ap-state-overview' && (
            <AndhraPradeshStateDashboard
              onDrilldownVisakhapatnam={() => setActiveTab('gis-map')}
            />
          )}

          {activeTab === 'gis-map' && (
            <div className="w-full h-full relative">
              <GisExplorer
                geoJsonData={geoJsonData}
                selectedUlpin={selectedUlpin}
                onSelectParcel={handleSelectParcel}
                activeLayers={layers}
                baseMap={baseMap}
              />

              {/* Floating Layer Control Panel */}
              <div className="absolute top-4 left-4 z-20">
                <LayerControl
                  layers={layers}
                  onLayerToggle={handleLayerToggle}
                  baseMap={baseMap}
                  onBaseMapChange={setBaseMap}
                />
              </div>

              {/* Floating Symbology Legend */}
              <div className="absolute bottom-6 left-4 z-20">
                <MapLegend />
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && <GovernmentDashboard />}
          {activeTab === 'ownership-ror' && (
            <LandRecordsPage
              parcelsList={parcelsList}
              onSelectParcel={(ulpin) => { handleSelectParcel(ulpin); setActiveTab('gis-map'); }}
              userRole={userSession.role}
              onVerifyOwnership={handleVerifyOwnership}
            />
          )}
          {activeTab === 'registration' && (
            <RegistrationPage
              parcelsList={parcelsList}
              onSelectParcel={(ulpin) => { handleSelectParcel(ulpin); setActiveTab('gis-map'); }}
            />
          )}
          {activeTab === 'encumbrance' && (
            <EncumbrancePage
              parcelsList={parcelsList}
              onSelectParcel={(ulpin) => { handleSelectParcel(ulpin); setActiveTab('gis-map'); }}
            />
          )}
          {activeTab === 'landuse-masterplan' && (
            <PlanningPage
              parcelsList={parcelsList}
              onSelectParcel={(ulpin) => { handleSelectParcel(ulpin); setActiveTab('gis-map'); }}
            />
          )}
          {activeTab === 'building-permission' && (
            <BuildingPermissionPage
              parcelsList={parcelsList}
              onSelectParcel={(ulpin) => { handleSelectParcel(ulpin); setActiveTab('gis-map'); }}
            />
          )}
          {activeTab === 'property-tax' && (
            <PropertyTaxPage
              parcelsList={parcelsList}
              onSelectParcel={(ulpin) => { handleSelectParcel(ulpin); setActiveTab('gis-map'); }}
            />
          )}
          {activeTab === 'disputes' && (
            <DisputesPage
              parcelsList={parcelsList}
              onSelectParcel={(ulpin) => { handleSelectParcel(ulpin); setActiveTab('gis-map'); }}
            />
          )}
          {activeTab === 'citizen-services' && (
            <CitizenPortal
              onSearchParcel={(ulpin) => { handleSelectParcel(ulpin); setActiveTab('gis-map'); }}
              serviceRequests={serviceRequests}
              onSubmitRequest={handleSubmitRequest}
            />
          )}
          {activeTab === 'ai-analytics' && <DataQualityDashboard />}
          {activeTab === 'admin-panel' && <AdminPanelPage />}
        </main>

        {/* Slide-over Parcel Detail Profile Drawer */}
        {selectedDataset && (
          <ParcelProfileDrawer
            dataset={selectedDataset}
            onClose={() => { setSelectedDataset(null); setSelectedUlpin(null); }}
            userRole={userSession.role}
            onVerifyOwnership={handleVerifyOwnership}
            onRequestVerification={(ulpin) => {
              handleSubmitRequest({ ulpin, serviceType: 'Ownership Verification', applicantName: userSession.name });
            }}
          />
        )}
      </div>

      {/* Identity Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(acc) => {
          setUserSession({
            name: acc.name,
            email: acc.email,
            role: acc.role,
            personId: acc.personId || 'PER-001',
            department: acc.department
          });
        }}
      />
    </div>
  );
};
