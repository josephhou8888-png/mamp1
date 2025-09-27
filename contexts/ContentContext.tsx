import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { contentData as seedData } from '../content';
import { useToast } from './ToastContext';
import { AllContent, SponsorApplication, Content } from '../types/firestore';

interface ContentContextType {
    allContent: AllContent | null;
    setAllContent: React.Dispatch<React.SetStateAction<AllContent | null>>;
    content: Content | null;
    isLoadingContent: boolean;
    applications: SponsorApplication[];
    language: string;
    setLanguage: (lang: string) => void;
    handleFullContentUpdate: (newContent: AllContent) => Promise<void>;
    handleSponsorApplicationSubmit: (application: Omit<SponsorApplication, 'id'>) => Promise<void>;
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

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allContent, setAllContent] = useState<AllContent | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [applications, setApplications] = useState<SponsorApplication[]>([]);
    const [language, setLanguage] = useState('en');
    const { showToast } = useToast();

    useEffect(() => {
        // With Firebase removed, we load content directly from the local seed file.
        // This simulates fetching data without a database.
        setIsLoadingContent(true);
        setAllContent(seedData as AllContent);
        // We also get initial applications from the seed data.
        setApplications(seedData.en.sponsoredApplications || []);
        setIsLoadingContent(false);
    }, []);

    const handleFullContentUpdate = useCallback(async (newContent: AllContent) => {
        // This function now only updates the local state.
        setAllContent(newContent);
        showToast('Content updated in local state!', 'success');
    }, [showToast]);

    const handleSponsorApplicationSubmit = useCallback(async (application: Omit<SponsorApplication, 'id'>) => {
        // Creates a new application in local state.
        const newApp = { id: `app_${Date.now()}`, ...application, status: 'pending' } as SponsorApplication;
        setApplications(prev => [...prev, newApp]);
        showToast('Application submitted locally!', 'success');
    }, [showToast]);

    const handleApplicationUpdate = useCallback(async (appId: string, updates: any) => {
        // Updates an application in local state.
        setApplications(prev => prev.map(app => app.id === appId ? { ...app, ...updates } : app));
        showToast('Application status updated locally!', 'info');
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
