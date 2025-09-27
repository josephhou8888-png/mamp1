import { User as FirebaseUser } from '@firebase/auth';

// Base product/prize structure
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    points: number;
    image: string;
}

export interface GamePrize {
    id: string;
    name:string;
    image: string;
    inventory: number;
    weight: number;
    sponsoredBy?: string;
}

export interface Reward {
    id: number | string;
    title: string;
    cost: number;
}

// User Profile stored in Firestore.
// FIX: Changed to a data-only interface for Firestore document compatibility and to resolve typing errors across the app.
// The runtime currentUser object in AuthContext will still have FirebaseUser properties via object spreading.
export interface AppUser {
    // Properties from Firebase auth, required for app logic
    uid: string;
    email: string | null;
    
    // Custom properties
    role?: 'admin' | 'user' | 'sponsor';
    name?: string;
    // User-specific data
    impact?: { co2Offset: number; treesPlanted: number };
    goals?: { co2Offset: number; treesPlanted: number };
    impactHistory?: { month: string; co2Offset: number; treesPlanted: number }[];
    cart?: Product[];
    points?: number;
    winnings?: { prizeId: string; timestamp: number }[];
    supportedProjects?: string[];
    // Sponsor-specific data
    companyName?: string;
    companyWebsite?: string;
    contactPerson?: string;
    contactRole?: string;
    phone?: string;
    companyDescription?: string;
}

// Sponsor Application document in its own collection
export interface SponsorApplication {
    id: string;
    sponsorId: string; // user's email
    sponsorCompany: string;
    productName: string;
    productImage: string;
    quantity: number;
    status: 'pending' | 'approved' | 'rejected';
    winWeight?: number;
}

// Structure for the main content document in Firestore
export interface WebsiteSettings {
    title: string;
    metaDescription: string;
    logoUrl: string;
    primaryColor: string;
    features: {
        splashEnabled: 'true' | 'false';
        aiChatEnabled: 'true' | 'false';
    };
    socialLinks: {
        twitter: string;
        facebook: string;
        instagram: string;
        linkedin: string;
    };
    tngApiKey: string;
}

export interface Content {
    websiteSettings: WebsiteSettings;
    products: Product[];
    gamePrizes: GamePrize[];
    rewards: Reward[];
    [key: string]: any; // for hero, about, etc. to keep it flexible
}

export interface AllContent {
    en: Content;
    ms: Content;
}
