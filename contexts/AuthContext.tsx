import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useToast } from './ToastContext';
import { useContent } from './ContentContext';
import { AppUser, Product, Reward, GamePrize, AllContent } from '../types/firestore';
import { mockAdmin, mockSponsor, mockUser, DEMO_PASS } from '../services/mockData';

interface AuthContextType {
    currentUser: AppUser | null;
    loadingAuth: boolean;
    handleLogout: () => void;
    handleLogin: (email: string, pass: string) => Promise<'user' | 'sponsor' | 'admin' | 'error'>;
    handleSignUp: (name: string, email: string, pass: string) => Promise<'user' | 'error'>;
    // FIX: Added `pass` parameter to align with component usage and fix typing error, maintaining consistency with handleSignUp.
    handleSponsorSignUp: (sponsorData: Partial<AppUser>, pass: string) => Promise<'sponsor' | 'error'>;
    handleAddToCart: (product: Product) => void;
    handleRemoveFromCart: (index: number) => void;
    handleRedeemReward: (reward: Reward) => void;
    handlePlayCarbonSpin: () => GamePrize | 'cooldown_or_empty' | null;
    handleTngPaymentSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const { showToast } = useToast();
    const { allContent, setAllContent, language } = useContent();

    useEffect(() => {
        // With Firebase removed, authentication state is not persistent.
        // We start with no user logged in and immediately finish loading.
        setLoadingAuth(false);
    }, []);
    
    const handleLogin = useCallback(async (email: string, pass: string): Promise<'user' | 'sponsor' | 'admin' | 'error'> => {
        if (pass !== DEMO_PASS) return 'error';

        if (email.toLowerCase() === mockUser.email) {
            setCurrentUser(mockUser);
            return 'user';
        }
        if (email.toLowerCase() === mockSponsor.email) {
            setCurrentUser(mockSponsor);
            return 'sponsor';
        }
        if (email.toLowerCase() === mockAdmin.email) {
            setCurrentUser(mockAdmin);
            return 'admin';
        }
        return 'error';
    }, []);

    const handleSignUp = useCallback(async (name: string, email: string, pass: string): Promise<'user' | 'error'> => {
        const newUser: AppUser = {
            uid: `user_${Date.now()}`,
            email: email,
            name: name,
            role: 'user',
            impact: { co2Offset: 0, treesPlanted: 0 },
            goals: { co2Offset: 10, treesPlanted: 100 },
            supportedProjects: [],
            cart: [],
            points: 0,
            winnings: [],
        };
        setCurrentUser(newUser);
        return 'user';
    }, []);
    
    const handleSponsorSignUp = useCallback(async (sponsorData: Partial<AppUser>, pass: string): Promise<'sponsor' | 'error'> => {
        const newSponsor: AppUser = {
            uid: `sponsor_${Date.now()}`,
            email: sponsorData.email!,
            role: 'sponsor',
            name: sponsorData.contactPerson,
            ...sponsorData
        };
        setCurrentUser(newSponsor);
        return 'sponsor';
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
    }, []);

    const handleAddToCart = useCallback((product: Product) => {
        if (!currentUser) return;
        const newCart = [...(currentUser.cart || []), product];
        setCurrentUser(prev => prev ? ({ ...prev, cart: newCart }) : null);
        showToast(`${product.name} added to cart!`, 'success');
    }, [currentUser, showToast]);

    const handleRemoveFromCart = useCallback((indexToRemove: number) => {
        if (!currentUser || !currentUser.cart) return;
        const newCart = currentUser.cart.filter((_, index) => index !== indexToRemove);
        setCurrentUser(prev => prev ? ({ ...prev, cart: newCart }) : null);
    }, [currentUser]);

    const handleTngPaymentSuccess = useCallback(() => {
        if (!currentUser || !currentUser.cart || currentUser.cart.length === 0) return;

        const pointsEarned = currentUser.cart.reduce((sum, item) => sum + (item.points || 0), 0);
        const newSupportedProjects = [...new Set([...(currentUser.supportedProjects || []), ...currentUser.cart.map(item => item.name)])];
        
        const updatedUserData = {
            points: (currentUser.points || 0) + pointsEarned,
            supportedProjects: newSupportedProjects,
            cart: []
        };

        setCurrentUser(prevUser => prevUser ? ({ ...prevUser, ...updatedUserData }) : null);
        showToast('Thank you for your purchase!', 'success');
    }, [currentUser, showToast]);
    
    const handleRedeemReward = useCallback((reward: Reward) => {
        if (!currentUser || (currentUser.points || 0) < reward.cost) return;
        const newPoints = (currentUser.points || 0) - reward.cost;
        setCurrentUser(prev => prev ? ({ ...prev, points: newPoints }) : null);
        showToast(`Redeemed: ${reward.title}`, 'success');
    }, [currentUser, showToast]);

    const handlePlayCarbonSpin = useCallback(() => {
        const content = allContent?.[language];
        if (!currentUser || (currentUser.points || 0) < 1 || !content) return null;
    
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        const userWinnings = currentUser.winnings || [];
    
        const recentlyWonPrizeIds = userWinnings.filter(win => now - win.timestamp < oneHour).map(win => win.prizeId);
        const availablePrizes = content.gamePrizes.filter((prize: GamePrize) => prize.inventory > 0 && !recentlyWonPrizeIds.includes(prize.id));
    
        if (availablePrizes.length === 0) {
            setCurrentUser(prev => prev ? { ...prev, points: (prev.points || 0) - 1 } : null);
            return 'cooldown_or_empty';
        }
    
        const totalWeight = availablePrizes.reduce((sum: number, prize: GamePrize) => sum + prize.weight, 0);
        let randomWeight = Math.random() * totalWeight;
        let prizeWon = availablePrizes.find((prize: GamePrize) => {
            randomWeight -= prize.weight;
            return randomWeight <= 0;
        }) || availablePrizes[0];
    
        setAllContent((prev: AllContent | null) => {
            if (!prev) return null;
            const newLangContent = { ...prev[language], gamePrizes: prev[language].gamePrizes.map((p: GamePrize) => p.id === prizeWon.id ? { ...p, inventory: p.inventory - 1 } : p) };
            return { ...prev, [language]: newLangContent };
        });
        
        const updatedUserData = {
            points: (currentUser.points || 0) - 1,
            winnings: [...(currentUser.winnings || []), { prizeId: prizeWon.id, timestamp: Date.now() }],
        };

        setCurrentUser(prev => prev ? ({ ...prev, ...updatedUserData }) : null);
        return prizeWon;
    }, [currentUser, allContent, language, setAllContent]);

    const value: AuthContextType = { 
        currentUser, 
        loadingAuth, 
        handleLogout,
        handleLogin,
        handleSignUp,
        handleSponsorSignUp,
        handleAddToCart,
        handleRemoveFromCart,
        handleRedeemReward,
        handlePlayCarbonSpin,
        handleTngPaymentSuccess
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};