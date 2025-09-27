import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useToast } from './ToastContext';
import { AllContent, SponsorApplication, Content } from '../types/data';
import { supabase } from '../services/supabaseClient';

interface ContentContextType {
    allContent: AllContent | null;
    setAllContent: React.Dispatch<React.SetStateAction<AllContent | null>>;
    content: Content | null;
    isLoadingContent: boolean;
    applications: SponsorApplication[];
    language: string;
    setLanguage: (lang: string) => void;
    handleFullContentUpdate: (newContent: AllContent) => Promise<void>;
    handleSponsorApplicationSubmit: (application: Omit<SponsorApplication, 'id' | 'sponsorCompany'>) => Promise<void>;
    handleApplicationUpdate: (appId: string, updates: any) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};

/**
 * A robust error formatting utility to avoid "[object Object]".
 * It intelligently inspects the error structure to provide a clear, readable message.
 * @param error The error object caught in a catch block.
 * @returns A formatted string representation of the error.
 */
const formatSupabaseError = (error: any): string => {
    if (!error) return 'An unknown error occurred.';
    // Handles Supabase's PostgrestError objects, which are rich with details.
    if (typeof error.message === 'string') {
        let message = error.message;
        if (error.details) message += ` | Details: ${error.details}`;
        if (error.hint) message += ` | Hint: ${error.hint}`;
        return message;
    }
    // Handles generic JavaScript Error objects.
    if (error instanceof Error && typeof error.message === 'string') {
        return error.message;
    }
    // Fallback for other types of errors (e.g., network errors).
    try {
        const stringified = JSON.stringify(error);
        return stringified === '{}' ? 'Received an empty error object.' : stringified;
    } catch {
        return 'An un-serializable error object was thrown.';
    }
};


export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allContent, setAllContent] = useState<AllContent | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [applications, setApplications] = useState<SponsorApplication[]>([]);
    const [language, setLanguage] = useState('en');
    const { showToast } = useToast();

    const fetchAllData = useCallback(async () => {
        setIsLoadingContent(true);

        // FIX: Define a minimal, valid default content structure to use as a fallback.
        // This prevents type errors and ensures the app can render without crashing if content fetching fails.
        const defaultContent: Content = {
            websiteSettings: {
                title: 'Mampani',
                metaDescription: 'An error occurred while loading content.',
                logoUrl: '',
                primaryColor: '#059669',
                features: { splashEnabled: 'false', aiChatEnabled: 'false' },
                socialLinks: { twitter: '', facebook: '', instagram: '', linkedin: '' },
                tngApiKey: '',
            },
            products: [],
            gamePrizes: [],
            rewards: [],
        };
        const defaultAllContent: AllContent = {
            en: defaultContent,
            ms: defaultContent,
        };

        // --- Fetch Website Content ---
        try {
            const { data: contentRows, error: contentError } = await supabase
                .from('website_content')
                .select('lang, data');
            if (contentError) throw contentError;

            if (contentRows && contentRows.length > 0) {
                const contentObj = contentRows.reduce((acc, row) => {
                    acc[row.lang] = row.data;
                    return acc;
                }, {} as AllContent);
                setAllContent(contentObj);
            } else {
                console.warn("No website content found in the database. Using empty defaults.");
                // FIX: Use a valid default object instead of an empty one to satisfy TypeScript and avoid runtime errors.
                setAllContent(defaultAllContent);
            }
        } catch (error: any) {
            console.error("Error fetching website_content:", error);
            showToast(`Failed to load main content: ${formatSupabaseError(error)}`, 'error');
            // FIX: Use a valid default object instead of an empty one to satisfy TypeScript and avoid runtime errors.
            setAllContent(defaultAllContent);
        }

        // --- Fetch Applications & Profiles ---
        try {
            const { data: applicationsData, error: applicationsError } = await supabase
                .from('sponsor_applications')
                .select('*');
            if (applicationsError) throw applicationsError;

            if (!applicationsData || applicationsData.length === 0) {
                setApplications([]);
            } else {
                const sponsorIds = [...new Set(applicationsData.map(app => app.sponsorId).filter(Boolean))];
                if (sponsorIds.length === 0) {
                    setApplications(applicationsData.map(app => ({ ...app, sponsorCompany: 'Unknown Company' })));
                } else {
                    const { data: profilesData, error: profilesError } = await supabase
                        .from('profiles')
                        .select('id, companyName')
                        .in('id', sponsorIds);
                    if (profilesError) throw profilesError;

                    const companyNameMap = new Map((profilesData || []).map(p => [p.id, p.companyName]));
                    const combinedData = applicationsData.map(app => ({
                        ...app,
                        sponsorCompany: companyNameMap.get(app.sponsorId) || 'Unknown Company',
                    }));
                    setApplications(combinedData);
                }
            }
        } catch (error: any) {
            console.error("Error fetching applications/profiles:", error);
            setApplications([]); // Set to empty array on failure to prevent stale data issues
            showToast(`Failed to load sponsor applications: ${formatSupabaseError(error)}`, 'error');
        } finally {
            setIsLoadingContent(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleFullContentUpdate = useCallback(async (newFullContent: AllContent) => {
        const contentToSave = newFullContent[language];
        const { error } = await supabase
            .from('website_content')
            .update({ data: contentToSave })
            .eq('lang', language);

        if (error) {
            console.error("Error saving content:", error);
            showToast(`Failed to save content: ${formatSupabaseError(error)}`, "error");
        } else {
            setAllContent(newFullContent);
            showToast('Content updated successfully!', 'success');
        }
    }, [language, showToast]);

    const handleSponsorApplicationSubmit = useCallback(async (application: Omit<SponsorApplication, 'id' | 'sponsorCompany'>) => {
        const { data, error } = await supabase
            .from('sponsor_applications')
            .insert([application])
            .select();
        
        if (error || !data) {
            console.error("Error submitting application:", error);
            showToast(`Application submission failed: ${formatSupabaseError(error)}`, "error");
        } else {
            await fetchAllData();
            showToast('Application submitted successfully!', 'success');
        }
    }, [showToast, fetchAllData]);

    const handleApplicationUpdate = useCallback(async (appId: string, updates: any) => {
        try {
            const { data: updatedAppData, error: updateError } = await supabase
                .from('sponsor_applications')
                .update(updates)
                .eq('id', appId)
                .select()
                .single();

            if (updateError) throw updateError;
            if (!updatedAppData) throw new Error("Application not found after update.");

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('companyName')
                .eq('id', updatedAppData.sponsorId)
                .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
                console.warn("Non-critical error fetching profile for updated app:", profileError);
            }
            
            const sponsorCompany = profileData?.companyName || 'Unknown Company';
            const finalUpdatedApp = { ...updatedAppData, sponsorCompany };

            setApplications(prev => prev.map(app => app.id === appId ? finalUpdatedApp as SponsorApplication : app));
            showToast('Application status updated!', 'info');

        } catch (error: any) {
            console.error("Error updating application:", error);
            showToast(`Failed to update application: ${formatSupabaseError(error)}`, "error");
        }
    }, [showToast]);

    const content = allContent ? (allContent[language] || allContent.en) : null;

    const value: ContentContextType = {
        allContent,
        setAllContent,
        content,
        isLoadingContent,
        applications,
        language,
        setLanguage,
        handleFullContentUpdate,
        handleSponsorApplicationSubmit,
        handleApplicationUpdate,
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};
