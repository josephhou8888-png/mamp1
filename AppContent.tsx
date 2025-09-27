import React, { useState, useEffect, useRef, useCallback, lazy } from 'react';
import { useToast } from './contexts/ToastContext';
import { useAuth } from './contexts/AuthContext';
import { useContent } from './contexts/ContentContext';

import Header from './components/ui/Header';
import Hero from './components/sections/Hero';
import Sponsors from './components/sections/Sponsors';
import About from './components/sections/About';
import CarbonCalculator from './components/sections/CarbonCalculator';
import Steps from './components/sections/Steps';
import Impact from './components/sections/Impact';
import Community from './components/sections/Community';
import Projects from './components/sections/Projects';
import KnowledgeSection from './components/sections/KnowledgeSection';
import Join from './components/sections/Join';
import Footer from './components/ui/Footer';
import ModalWrapper from './components/modals/ModalWrapper';
import { PauseIcon, PlayIcon, VolumeOffIcon, VolumeUpIcon } from './components/IconComponents';
import MampaniLogo from './components/ui/MampaniLogo';
import EditModeBar from './components/inline-editor/EditModeBar';
import { cloneDeep } from './utils/sanitizer';

// Lazy-loaded components
const AIChatAssistant = lazy(() => import('./components/AIChatAssistant'));
const SplashPage = lazy(() => import('./components/SplashPage'));
const TheAdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const DashboardPage = lazy(() => import('./components/DashboardPage'));
const TngModal = lazy(() => import('./components/TngModal'));
const SponsorDashboard = lazy(() => import('./components/SponsorDashboard'));
const AuthModal = lazy(() => import('./components/modals/AuthModal'));
const ArticleModal = lazy(() => import('./components/modals/ArticleModal'));
const CartModal = lazy(() => import('./components/modals/CartModal'));

const AppContent: React.FC = () => {
    // --- Context Hooks ---
    const { showToast } = useToast();
    const { currentUser, handleLogout, handleTngPaymentSuccess } = useAuth();
    const { 
        allContent, 
        content, 
        language, 
        setLanguage, 
        isLoadingContent, 
        handleFullContentUpdate, 
    } = useContent();

    // --- UI State ---
    const [authInitialTab, setAuthInitialTab] = useState('login');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isSplashVisible, setIsSplashVisible] = useState(false);
    const [editableContent, setEditableContent] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // --- Modal State ---
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
    const [isSponsorDashboardOpen, setIsSponsorDashboardOpen] = useState(false);
    const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
    const [isTngModalOpen, setIsTngModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // --- Video Player State ---
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    
    // --- Refs ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const calculatorRef = useRef<HTMLDivElement>(null);

    // --- Effects ---
    useEffect(() => {
        if (content) {
            setEditableContent(cloneDeep(content));
        }
    }, [content]);
    
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);
    
    useEffect(() => {
        if (!content?.websiteSettings) return;
        const { title, metaDescription } = content.websiteSettings;
        document.title = title || 'Mampani';
        document.querySelector('meta[name="description"]')?.setAttribute('content', metaDescription || '');
    }, [content?.websiteSettings]);

    useEffect(() => {
        const isEnabledInSettings = content?.websiteSettings?.features?.splashEnabled === 'true';
        const hasSplashContent = content?.splash?.enabled === 'true';
        setIsSplashVisible(isEnabledInSettings && hasSplashContent);
    }, [content]);

    // --- Edit Mode Handlers ---
    const handleEnterEditMode = () => {
        setEditableContent(cloneDeep(content));
        setIsEditMode(true);
        document.body.style.paddingBottom = '80px';
    };

    const handleExitEditMode = useCallback(() => {
        setIsEditMode(false);
        setEditableContent(null);
        document.body.style.paddingBottom = '0';
    }, []);

    const handleSaveChanges = async () => {
        setIsSaving(true);
        await handleFullContentUpdate({ ...allContent, [language]: editableContent });
        setIsSaving(false);
        handleExitEditMode();
    };

    const handleUpdateEditableContent = (path, value) => {
        setEditableContent(prev => {
            const keys = path.split('.');
            const newContent = cloneDeep(prev);
            let current = newContent;
            for (let i = 0; i < keys.length - 1; i++) {
                if (current[keys[i]] === undefined) {
                    current[keys[i]] = isNaN(Number(keys[i + 1])) ? {} : [];
                }
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newContent;
        });
    };
    
    const extendedLogout = useCallback(() => {
        handleLogout();
        setIsAdminDashboardOpen(false);
        if (isEditMode) handleExitEditMode();
    }, [isEditMode, handleExitEditMode, handleLogout]);

    // --- UI Action Handlers ---
    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            isPlaying ? videoRef.current.pause() : videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    const handleScrollToCalculator = useCallback(() => {
        calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const handleArticleClick = useCallback((article) => {
        setSelectedArticle(article);
        setIsArticleModalOpen(true);
    }, []);

    const handleSplashRegisterClick = useCallback(() => {
        setIsSplashVisible(false);
        setAuthInitialTab('signup');
        setIsAuthModalOpen(true);
    }, []);

    const handleLoginClick = useCallback(() => {
        setAuthInitialTab('login');
        setIsAuthModalOpen(true);
    }, []);

    const handleSignUpClick = useCallback(() => {
        setAuthInitialTab('signup');
        setIsAuthModalOpen(true);
    }, []);
    
    const handleCheckout = useCallback(() => {
        if (!currentUser || (currentUser.cart?.length || 0) === 0) return;
        setIsCartOpen(false);
        setIsTngModalOpen(true);
    }, [currentUser]);

    // --- Render Logic ---
    const displayContent = isEditMode ? editableContent : content;

    if (isLoadingContent || !displayContent) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-pulse">
                     <MampaniLogo logoUrl="https://www.zoji.me/images/logo1.png" />
                </div>
            </div>
        );
    }
    
    const settings = displayContent.websiteSettings || {};

    return (
        <div>
            {currentUser?.role === 'admin' && !isEditMode && (
                <div className="fixed bottom-6 left-6 z-[9998]">
                    <button
                        onClick={handleEnterEditMode}
                        className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-full shadow-lg hover:bg-emerald-700 transition-transform hover:scale-105"
                    >
                        Edit Page
                    </button>
                </div>
            )}
            
            {isEditMode && (
                <EditModeBar onSave={handleSaveChanges} onExit={handleExitEditMode} isSaving={isSaving} />
            )}

            {displayContent?.hero?.videoUrl && (
                <div className="fixed inset-0 z-[-1] overflow-hidden">
                    <video
                        ref={videoRef}
                        key={displayContent.hero.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    >
                        <source src={displayContent.hero.videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
            )}

            {displayContent?.hero?.videoUrl && (
                <div className="fixed bottom-6 right-6 z-30 flex items-center gap-3">
                    <button onClick={togglePlay} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors" aria-label={isPlaying ? "Pause video" : "Play video"}>
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button onClick={toggleMute} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors" aria-label={isMuted ? "Unmute video" : "Mute video"}>
                        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </button>
                </div>
            )}

            <SplashPage 
                isOpen={isSplashVisible}
                content={displayContent.splash} 
                onClose={() => setIsSplashVisible(false)}
                onRegisterClick={handleSplashRegisterClick}
            />

            <Header 
                onLoginClick={handleLoginClick}
                onSignUpClick={handleSignUpClick}
                onDashboardClick={() => {
                    if (currentUser?.role === 'user') setIsDashboardModalOpen(true);
                    if (currentUser?.role === 'sponsor') setIsSponsorDashboardOpen(true);
                    if (currentUser?.role === 'admin') setIsAdminDashboardOpen(true);
                }}
                onCartClick={() => setIsCartOpen(true)}
                logoUrl={settings.logoUrl}
                content={displayContent.header}
                language={language}
                onLanguageChange={setLanguage}
            />
            <main>
                <Hero content={displayContent.hero} onCalculateClick={handleScrollToCalculator} onSignUpClick={handleSignUpClick} isEditing={isEditMode} onUpdate={handleUpdateEditableContent} />
                <Sponsors content={displayContent.sponsors} isEditing={isEditMode} onUpdate={handleUpdateEditableContent} />
                <About content={displayContent.about} isEditing={isEditMode} onUpdate={handleUpdateEditableContent} />
                <div ref={calculatorRef}>
                    <CarbonCalculator content={displayContent.carbonCalculator} geminiPrompt={displayContent.geminiPrompt || ''} resultsModalContent={displayContent.resultsModal} onSignUpRedirect={handleSignUpClick} isEditing={isEditMode} onUpdate={handleUpdateEditableContent} />
                </div>
                <Steps content={displayContent.stepsSection} isEditing={isEditMode} onUpdate={handleUpdateEditableContent} />
                <Impact content={displayContent.impact} isEditing={isEditMode} onUpdate={handleUpdateEditableContent} />
                <Community content={displayContent.community} isEditing={isEditMode} onUpdate={handleUpdateEditableContent} />
                <Projects content={displayContent.projectsSection} cardContent={displayContent.projectCard} isEditing={isEditMode} onUpdate={handleUpdateEditableContent} />
                <KnowledgeSection content={displayContent.knowledgeSection} onArticleClick={handleArticleClick} isEditing={isEditMode} onUpdate={handleUpdateEditableContent} />
                <Join content={displayContent.join} onSignUpClick={handleSignUpClick} isEditing={isEditMode} onUpdate={handleUpdateEditableContent} />
            </main>
            <Footer content={displayContent.footer} settings={settings} onSponsorClick={() => { setAuthInitialTab('sponsor'); setIsAuthModalOpen(true); }} isEditing={isEditMode} onUpdate={handleUpdateEditableContent} />

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialTab={authInitialTab} content={displayContent.auth} onUserLogin={() => setIsDashboardModalOpen(true)} onSponsorLogin={() => setIsSponsorDashboardOpen(true)} />
            <ArticleModal isOpen={isArticleModalOpen} onClose={() => setIsArticleModalOpen(false)} article={selectedArticle} />
            
            {currentUser?.role === 'user' && (
                <>
                    <ModalWrapper isOpen={isDashboardModalOpen} onClose={() => setIsDashboardModalOpen(false)} maxWidth="max-w-5xl">
                         <DashboardPage onCartClick={() => { setIsDashboardModalOpen(false); setIsCartOpen(true); }} />
                    </ModalWrapper>
                    
                    <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} content={displayContent.cart} />

                    <TngModal isOpen={isTngModalOpen} onClose={() => setIsTngModalOpen(false)} totalAmount={currentUser.cart?.reduce((sum, item) => sum + item.price, 0) || 0} onPaymentSuccess={handleTngPaymentSuccess} />
                </>
            )}

            {currentUser?.role === 'sponsor' && (
                <ModalWrapper isOpen={isSponsorDashboardOpen} onClose={() => setIsSponsorDashboardOpen(false)} maxWidth="max-w-4xl">
                    <SponsorDashboard content={displayContent.sponsorDashboard} />
                </ModalWrapper>
            )}

            {currentUser?.role === 'admin' && (
                <ModalWrapper isOpen={isAdminDashboardOpen} onClose={() => setIsAdminDashboardOpen(false)} maxWidth="max-w-screen-xl">
                    <div className="h-[90vh]">
                        <TheAdminDashboard />
                    </div>
                </ModalWrapper>
            )}

            {settings?.features?.aiChatEnabled === 'true' && <AIChatAssistant content={displayContent.aiChat} />}
        </div>
    );
};

export default AppContent;