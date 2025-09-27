import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useToast } from './ToastContext';
import { useContent } from './ContentContext';
import { AppUser, Product, Reward, GamePrize, AllContent } from '../types/data';
import { supabase } from '../services/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
    currentUser: AppUser | null;
    loadingAuth: boolean;
    handleLogout: () => void;
    handleLogin: (email: string, pass: string) => Promise<'user' | 'sponsor' | 'admin' | 'error'>;
    handleSignUp: (name: string, email: string, pass: string) => Promise<'user' | 'error'>;
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

const initialUserData = {
    impact: { co2Offset: 0, treesPlanted: 0 },
    goals: { co2Offset: 10, treesPlanted: 100 },
    supportedProjects: [],
    cart: [],
    points: 0,
    winnings: [],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const { showToast } = useToast();
    const { allContent, setAllContent, language } = useContent();

    useEffect(() => {
        setLoadingAuth(true);
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
                    console.error('Error fetching profile:', error);
                }
                
                if (profile) {
                    setCurrentUser({ ...session.user, ...profile });
                } else {
                    // This can happen if profile creation fails after signup.
                    // We set a minimal user object.
                    setCurrentUser({
                        id: session.user.id,
                        email: session.user.email || null,
                        role: 'user'
                    });
                }
            } else {
                setCurrentUser(null);
            }
            setLoadingAuth(false);
        });

        return () => subscription.unsubscribe();
    }, []);
    
    const handleLogin = useCallback(async (email: string, pass: string): Promise<'user' | 'sponsor' | 'admin' | 'error'> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error || !data.user) {
            console.error('Login error:', error);
            return 'error';
        }
        // onAuthStateChange will handle setting the user, but we can return role for immediate UI logic
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        return profile?.role || 'user';
    }, []);

    const handleSignUp = useCallback(async (name: string, email: string, pass: string): Promise<'user' | 'error'> => {
        const { data, error } = await supabase.auth.signUp({ email, password: pass });
        if (error || !data.user) {
             console.error('Signup error:', error);
             return 'error';
        }
        const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email,
            name,
            role: 'user',
            ...initialUserData
        });
        if (profileError) {
            console.error('Profile creation error:', profileError);
            return 'error';
        }
        return 'user';
    }, []);
    
    const handleSponsorSignUp = useCallback(async (sponsorData: Partial<AppUser>, pass: string): Promise<'sponsor' | 'error'> => {
        const email = sponsorData.email!;
        const { data, error } = await supabase.auth.signUp({ email, password: pass });
        if (error || !data.user) {
             console.error('Sponsor signup error:', error);
             return 'error';
        }
        const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            role: 'sponsor',
            ...sponsorData
        });
        if (profileError) {
            console.error('Sponsor profile creation error:', profileError);
            return 'error';
        }
        return 'sponsor';
    }, []);

    const handleLogout = useCallback(async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
    }, []);

    const updateUserProfile = async (updates: Partial<AppUser>) => {
        if (!currentUser) return;
        const { error } = await supabase.from('profiles').update(updates).eq('id', currentUser.id);
        if (error) {
            console.error("Error updating profile:", error);
            showToast('Failed to save changes.', 'error');
        } else {
            setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const handleAddToCart = useCallback((product: Product) => {
        if (!currentUser) return;
        const newCart = [...(currentUser.cart || []), product];
        updateUserProfile({ cart: newCart });
        showToast(`${product.name} added to cart!`, 'success');
    }, [currentUser, showToast]);

    const handleRemoveFromCart = useCallback((indexToRemove: number) => {
        if (!currentUser || !currentUser.cart) return;
        const newCart = currentUser.cart.filter((_, index) => index !== indexToRemove);
        updateUserProfile({ cart: newCart });
    }, [currentUser]);

    const handleTngPaymentSuccess = useCallback(async () => {
        if (!currentUser || !currentUser.cart || currentUser.cart.length === 0) return;

        const pointsEarned = currentUser.cart.reduce((sum, item) => sum + (item.points || 0), 0);
        const newSupportedProjects = [...new Set([...(currentUser.supportedProjects || []), ...currentUser.cart.map(item => item.name)])];
        
        const updatedUserData = {
            points: (currentUser.points || 0) + pointsEarned,
            supportedProjects: newSupportedProjects,
            cart: []
        };
        await updateUserProfile(updatedUserData);
        showToast('Thank you for your purchase!', 'success');
    }, [currentUser, showToast]);
    
    const handleRedeemReward = useCallback(async (reward: Reward) => {
        if (!currentUser || (currentUser.points || 0) < reward.cost) return;
        const newPoints = (currentUser.points || 0) - reward.cost;
        await updateUserProfile({ points: newPoints });
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
            updateUserProfile({ points: (currentUser.points || 0) - 1 });
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
        
        updateUserProfile({
            points: (currentUser.points || 0) - 1,
            winnings: [...(currentUser.winnings || []), { prizeId: prizeWon.id, timestamp: Date.now() }],
        });

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