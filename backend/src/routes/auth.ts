import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../middleware/auth';
import { UserRole } from '../types';
import { DEMO_CITIZEN_PERSONS } from '../db/seed';

const router = Router();

// Demo Accounts matching DigiBhoomi Data Isolation requirements
const DEMO_USERS = [
  // Government Officers with Department & Jurisdiction Scope
  {
    id: 'USR-GOV-001',
    name: 'Admin System Manager',
    email: 'admin@digibhoomi.gov.in',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'SUPER_ADMIN' as UserRole,
    personId: undefined,
    department: 'Digital Public Infrastructure Governance',
    district: 'Statewide (Andhra Pradesh)',
    jurisdiction: { stateCode: 'AP' }
  },
  {
    id: 'USR-GOV-002',
    name: 'K. Venkatesh (Tahsildar)',
    email: 'revenue@digibhoomi.gov.in',
    passwordHash: bcrypt.hashSync('revenue123', 10),
    role: 'REVENUE_OFFICER' as UserRole,
    personId: undefined,
    department: 'Revenue & Land Records',
    district: 'Visakhapatnam',
    mandal: 'Demo Mandal',
    jurisdiction: { stateCode: 'AP', districtName: 'Visakhapatnam', mandalName: 'Demo Mandal' }
  },
  {
    id: 'USR-GOV-003',
    name: 'S. Anitha (Sub-Registrar)',
    email: 'registration@digibhoomi.gov.in',
    passwordHash: bcrypt.hashSync('reg123', 10),
    role: 'REGISTRATION_OFFICER' as UserRole,
    personId: undefined,
    department: 'Registration & Stamps Department',
    district: 'Visakhapatnam',
    jurisdiction: { stateCode: 'AP', districtName: 'Visakhapatnam', sroOffice: 'Visakhapatnam SRO-1' }
  },
  {
    id: 'USR-GOV-004',
    name: 'M. Chaitanya (City Planner)',
    email: 'planning@digibhoomi.gov.in',
    passwordHash: bcrypt.hashSync('plan123', 10),
    role: 'PLANNING_OFFICER' as UserRole,
    personId: undefined,
    department: 'VMRDA Urban Planning',
    district: 'Visakhapatnam',
    jurisdiction: { stateCode: 'AP', districtName: 'Visakhapatnam' }
  },
  {
    id: 'USR-GOV-005',
    name: 'P. Suresh (Tax Collector)',
    email: 'municipality@digibhoomi.gov.in',
    passwordHash: bcrypt.hashSync('muni123', 10),
    role: 'MUNICIPAL_OFFICER' as UserRole,
    personId: undefined,
    department: 'Municipal Revenue & Property Tax',
    district: 'Visakhapatnam',
    jurisdiction: { stateCode: 'AP', districtName: 'Visakhapatnam', municipality: 'GVMC' }
  },

  // 10+ Pre-Seeded Citizens mapped to specific Person IDs
  ...DEMO_CITIZEN_PERSONS.map((p, idx) => ({
    id: `USR-CIT-${p.id}`,
    name: `${p.name} (Citizen ${idx + 1})`,
    email: `citizen${idx + 1}@digibhoomi.gov.in`,
    passwordHash: bcrypt.hashSync('citizen123', 10),
    role: 'CITIZEN' as UserRole,
    personId: p.id,
    department: 'Citizen Public Services',
    district: 'Visakhapatnam',
    jurisdiction: { stateCode: 'AP' }
  }))
];

// Login Endpoint
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = DEMO_USERS.find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isPasswordValid = bcrypt.compareSync(password || '', user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      personId: user.personId,
      department: user.department,
      district: user.district,
      jurisdiction: user.jurisdiction
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      personId: user.personId,
      department: user.department,
      district: user.district,
      jurisdiction: user.jurisdiction
    }
  });
});

// Get list of pre-seeded accounts for demo login switcher
router.get('/demo-accounts', (req: Request, res: Response) => {
  return res.json({
    success: true,
    demoAccounts: DEMO_USERS.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      personId: u.personId,
      department: u.department,
      district: u.district
    }))
  });
});

export default router;
