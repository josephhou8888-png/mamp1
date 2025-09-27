import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useToast } from './ToastContext';
import { AllContent, SponsorApplication, Content } from '../types/data';
import { supabase } from '../services/supabaseClient';
import { seedData } from '../services/seedData';

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

const formatSupabaseError = (error: any): string => {
    if (!error) return 'An unknown error occurred.';
    if (typeof error.message === 'string') {
        let message = error.message;
        if (error.details) message += ` | Details: ${error.details}`;
        if (error.hint) message += ` | Hint: ${error.hint}`;
        return message;
    }
    if (error instanceof Error && typeof error.message === 'string') {
        return error.message;
    }
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

    const fetchAllData = useCallback(async (isRetry = false) => {
        setIsLoadingContent(true);

        try {
            // --- Fetch Website Content ---
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
            } else if (!isRetry) {
                // --- DATABASE IS EMPTY: ATTEMPT TO SEED ---
                console.log("Database content is empty. Attempting to seed with default data...");
                showToast('First-time setup: Initializing content...', 'info');

                const { error: seedError } = await supabase
                    .from('website_content')
                    .insert([
                        { lang: 'en', data: seedData.en },
                        { lang: 'ms', data: seedData.ms }
                    ]);

                if (seedError) {
                    if (seedError.message.includes('violates row-level security policy')) {
                        // This is an expected failure if RLS is enabled without an insert policy for anon users.
                        // We will fall back to local data gracefully.
                        console.warn("Database seeding blocked by Row Level Security policy. This is expected if RLS is enabled. Falling back to local data. To persist content, please adjust your RLS policies in the Supabase dashboard to allow inserts or populate the data manually.");
                        showToast("Using default content. (DB seeding blocked by security policy)", "info");
                        setAllContent(seedData); // Use the local seed data as a fallback
                    } else {
                        // Another, unexpected database error occurred.
                        throw new Error(`Failed to seed database: ${seedError.message}`);
                    }
                } else {
                    // Seeding was successful.
                    console.log("Seeding successful. Refetching content.");
                    showToast('Content initialized successfully!', 'success');
                    await fetchAllData(true); // Re-run to fetch the now-seeded data and the rest of the app data
                    return; // Important to exit here to avoid fetching applications twice
                }
            } else {
                 // It was a retry but the DB is still empty. This shouldn't happen if seeding works.
                // Fallback to local data to prevent a broken state.
                console.warn("Database is still empty after seeding attempt. Falling back to local data.");
                setAllContent(seedData);
            }

            // --- Fetch Applications & Profiles (runs if seeding didn't happen or failed gracefully) ---
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
            console.error("Critical error during data fetch/seed:", error);
            showToast(`Error initializing app data: ${formatSupabaseError(error)}`, 'error');
            setAllContent(seedData); // Fallback to in-memory seed data on critical failure
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