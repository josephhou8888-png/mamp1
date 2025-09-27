import { AppUser } from '../types/firestore';

export const DEMO_PASS = '123456';

export const mockUser: AppUser = {
  uid: 'demo-user-uid',
  email: 'user@mampani.com',
  name: 'Jane Doe',
  role: 'user',
  impact: { co2Offset: 5, treesPlanted: 50 },
  goals: { co2Offset: 10, treesPlanted: 100 },
  impactHistory: [
      { month: 'Jan', co2Offset: 0.5, treesPlanted: 5 },
      { month: 'Feb', co2Offset: 1.2, treesPlanted: 10 },
      { month: 'Mar', co2Offset: 2.0, treesPlanted: 15 },
      { month: 'Apr', co2Offset: 2.8, treesPlanted: 20 },
      { month: 'May', co2Offset: 3.5, treesPlanted: 30 },
      { month: 'Jun', co2Offset: 5.0, treesPlanted: 50 }
  ],
  supportedProjects: ["Solar Power in Rural India"],
  cart: [],
  points: 150,
  winnings: [
    { prizeId: 'prize_001', timestamp: Date.now() - (2 * 60 * 60 * 1000) },
  ]
};

export const mockSponsor: AppUser = {
  uid: 'demo-sponsor-uid',
  email: 'sponsor@mampani.com',
  name: 'Eco Corp',
  role: 'sponsor',
  companyName: 'Eco Corp',
  companyWebsite: 'https://www.ecocorp.com',
  contactPerson: 'Jane Smith',
  contactRole: 'Partnerships Manager',
  phone: '555-0101',
  companyDescription: 'Leading the charge in innovative green technology and sustainable business practices.'
};

export const mockAdmin: AppUser = {
  uid: 'demo-admin-uid',
  email: 'admin@mampani.com',
  name: 'Admin User',
  role: 'admin',
};
