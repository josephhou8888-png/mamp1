import React, { useState, useEffect } from 'react';
import { cloneDeep } from '../../utils/sanitizer';
import { SettingsIcon, HomeIcon, InfoIcon, UsersIcon, ProjectIcon, KnowledgeIcon, JoinIcon, FooterIcon, LogoutIcon, ExternalLinkIcon, SparklesIcon, CalculatorIcon, StepsIcon, ImpactIcon, GiftIcon, TrophyIcon } from '../IconComponents';
import SettingsPanel from './panels/SettingsPanel';
import HeroPanel from './panels/HeroPanel';
import AboutPanel from './panels/AboutPanel';
import CommunityPanel from './panels/CommunityPanel';
import ProjectsPanel from './panels/ProjectsPanel';
import JoinPanel from './panels/JoinPanel';
import FooterPanel from './panels/FooterPanel';
import SplashPanel from './panels/SplashPanel';
import CalculatorPanel from './panels/CalculatorPanel';
import StepsPanel from './panels/StepsPanel';
import ImpactPanel from './panels/ImpactPanel';
import KnowledgePanel from './panels/KnowledgePanel';
import CarbonSpinPanel from './panels/CarbonSpinPanel';
import SponsoredProductsPanel from './panels/SponsoredProductsPanel';
import { useAuth } from '../../contexts/AuthContext';
import { useContent } from '../../contexts/ContentContext';

const MampaniLogo = ({ logoUrl }) => {
    const finalLogoUrl = logoUrl || "https://i.ibb.co/tDWTX9V/logo.png";
    return (
        <div className="flex items-center space-x-2">
            <img src={finalLogoUrl} alt="Mampani Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold text-white">Mampani</span>
        </div>
    );
};


const AdminDashboard = () => {
    const { currentUser, handleLogout } = useAuth();
    const { allContent, applications, handleFullContentUpdate, handleApplicationUpdate, language, setLanguage } = useContent();

    const [editableContent, setEditableContent] = useState(allContent ? allContent[language] : null);
    const [saveStatus, setSaveStatus] = useState('');
    const [activeSection, setActiveSection] = useState('settings');
    
    const adminContent = allContent?.en?.adminDashboard;

    useEffect(() => {
        if (allContent) {
            setEditableContent(cloneDeep(allContent[language]));
        }
    }, [allContent, language]);

    const handleSave = () => {
        const newFullContent = { ...allContent, [language]: editableContent };
        handleFullContentUpdate(newFullContent);
        setSaveStatus(adminContent.saveStatus);
        setTimeout(() => setSaveStatus(''), 3000);
    };

    const handleChange = (path, value) => {
        setEditableContent(prev => {
            const keys = path.split('.');
            const newContent = cloneDeep(prev);
            let current = newContent;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newContent;
        });
    };
    
    const handleAddItem = (path, newItem) => {
        const keys = path.split('.');
        let current = { ...editableContent };
        let parent = null;
        let lastKey = '';
        for (const key of keys) {
            parent = current;
            lastKey = key;
            current = current[key];
        }
        const newArray = [...(current || []), newItem];
        if (parent) {
            parent[lastKey] = newArray;
            setEditableContent({ ...editableContent, ...parent });
        } else {
             handleChange(path, newArray);
        }
    };
    
    const handleRemoveItem = (path, index) => {
        const keys = path.split('.');
        let current = { ...editableContent };
        let temp = current;
        for (let i = 0; i < keys.length; i++) {
            temp = temp[keys[i]];
        }
        const newArray = temp.filter((_, i) => i !== index);
        handleChange(path, newArray);
    };

    if (!editableContent || !adminContent) {
        return <div className="text-center p-12">Loading admin dashboard...</div>;
    }
    
    const navItems = [
        { key: 'settings', label: adminContent.sectionTitles.settings, icon: <SettingsIcon className="w-5 h-5"/> },
        { key: 'carbonSpin', label: adminContent.sectionTitles.carbonSpin, icon: <GiftIcon className="w-5 h-5" /> },
        { key: 'sponsoredProducts', label: adminContent.sectionTitles.sponsoredProducts, icon: <TrophyIcon className="w-5 h-5" /> },
        { key: 'splash', label: adminContent.sectionTitles.splash, icon: <SparklesIcon className="w-5 h-5"/> },
        { key: 'hero', label: adminContent.sectionTitles.hero, icon: <HomeIcon className="w-5 h-5"/> },
        { key: 'about', label: adminContent.sectionTitles.about, icon: <InfoIcon className="w-5 h-5"/> },
        { key: 'calculator', label: adminContent.sectionTitles.calculator, icon: <CalculatorIcon className="w-5 h-5"/> },
        { key: 'steps', label: adminContent.sectionTitles.steps, icon: <StepsIcon className="w-5 h-5"/> },
        { key: 'impact', label: adminContent.sectionTitles.impact, icon: <ImpactIcon className="w-5 h-5"/> },
        { key: 'community', label: adminContent.sectionTitles.community, icon: <UsersIcon className="w-5 h-5"/> },
        { key: 'projects', label: adminContent.sectionTitles.projects, icon: <ProjectIcon className="w-5 h-5"/> },
        { key: 'knowledge', label: adminContent.sectionTitles.knowledge, icon: <KnowledgeIcon className="w-5 h-5"/> },
        { key: 'join', label: adminContent.sectionTitles.join, icon: <JoinIcon className="w-5 h-5"/> },
        { key: 'footer', label: adminContent.sectionTitles.footer, icon: <FooterIcon className="w-5 h-5"/> },
    ];

    const renderPanel = () => {
        // FIX: Pass handleAddItem and handleRemoveItem to child components.
        const commonProps = { data: editableContent, onChange: handleChange, onAddItem: handleAddItem, onRemoveItem: handleRemoveItem, adminContent };
        switch (activeSection) {
            case 'settings': return <SettingsPanel {...commonProps} />;
            case 'splash': return <SplashPanel {...commonProps} />;
            case 'hero': return <HeroPanel {...commonProps} />;
            case 'about': return <AboutPanel {...commonProps} />;
            case 'calculator': return <CalculatorPanel {...commonProps} />;
            case 'steps': return <StepsPanel {...commonProps} />;
            case 'impact': return <ImpactPanel {...commonProps} />;
            case 'community': return <CommunityPanel {...commonProps} />;
            case 'projects': return <ProjectsPanel {...commonProps} />;
            case 'knowledge': return <KnowledgePanel {...commonProps} />;
            case 'carbonSpin': return <CarbonSpinPanel {...commonProps} />;
            case 'sponsoredProducts': return <SponsoredProductsPanel {...commonProps} applications={applications} onApplicationUpdate={handleApplicationUpdate} />;
            case 'join': return <JoinPanel {...commonProps} />;
            case 'footer': return <FooterPanel {...commonProps} />;
            default: return <div>Select a section</div>;
        }
    };

    return (
        <div className="flex h-full bg-slate-100">
            <aside className="w-64 bg-[#0D1B3A] text-white flex flex-col flex-shrink-0">
                <div className="h-20 flex items-center px-6 border-b border-slate-700">
                    <MampaniLogo logoUrl={editableContent.websiteSettings?.logoUrl} />
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{adminContent.navigationTitle}</p>
                    {navItems.map(item => (
                        <button key={item.key} onClick={() => setActiveSection(item.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeSection === item.key ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                            {item.icon}<span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                 <div className="px-4 py-4 border-t border-slate-700">
                     <div className="px-3 py-2.5 text-sm">
                        <p className="font-semibold">{currentUser?.name}</p>
                        <p className="text-xs text-slate-400">{currentUser?.email}</p>
                     </div>
                     <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white">
                        <LogoutIcon className="w-5 h-5" />
                        <span>{adminContent.logout}</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
                     <h1 className="text-2xl font-extrabold text-[#0D1B3A]">{navItems.find(item => item.key === activeSection)?.label}</h1>
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 rounded-md p-1 flex items-center text-sm font-semibold">
                            <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded ${language === 'en' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}>English</button>
                            <button onClick={() => setLanguage('ms')} className={`px-3 py-1 rounded ${language === 'ms' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}>Malaysian</button>
                        </div>
                        {saveStatus && <span className="text-green-600 font-semibold text-sm animate-fade-in">{saveStatus}</span>}
                        <a href="/" target="_blank" rel="noopener noreferrer" className="font-semibold text-sm px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-2">
                            {adminContent.viewSite} <ExternalLinkIcon />
                        </a>
                        <button onClick={handleSave} className="font-semibold px-6 py-2 rounded-md bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition-colors">
                            {adminContent.saveButton}
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="p-8">{renderPanel()}</div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;