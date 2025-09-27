import React, { useState, useEffect, memo } from 'react';
import MampaniLogo from './MampaniLogo';
import { CloseIcon, MenuIcon, ShoppingCartIcon } from '../IconComponents';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#calculator', label: 'Calculator' },
    { href: '#impact', label: 'Impact' },
    { href: '#projects', label: 'Projects' },
    { href: '#knowledge', label: 'Knowledge' }
];

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
    onSignUpClick: () => void;
    onDashboardClick: () => void;
    onCartClick: () => void;
    content: any;
    language: string;
    onLanguageChange: (lang: string) => void;
}
const MobileNav = ({ isOpen, onClose, onLoginClick, onSignUpClick, onDashboardClick, onCartClick, content, language, onLanguageChange }: MobileNavProps) => {
    const { currentUser, handleLogout } = useAuth();
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} role="dialog" aria-modal="true">
            <div
                className="absolute top-0 right-0 h-full w-full max-w-xs bg-white shadow-lg p-6 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-end mb-8">
                    <button onClick={onClose} aria-label="Close menu"><CloseIcon /></button>
                </div>
                {!currentUser && (
                    <nav className="flex flex-col space-y-6 text-lg font-semibold text-center">
                        {navLinks.map(link => (
                            <a key={link.href} href={link.href} onClick={onClose} className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">{link.label}</a>
                        ))}
                    </nav>
                )}
                <div className="mt-auto pt-8 border-t border-[var(--color-border)] space-y-4">
                     <div className="flex justify-center items-center gap-4 text-sm font-semibold">
                        <button onClick={() => onLanguageChange('en')} className={language === 'en' ? 'text-[var(--color-primary)]' : 'text-slate-500'}>English</button>
                        <span className="text-slate-300">|</span>
                        <button onClick={() => onLanguageChange('ms')} className={language === 'ms' ? 'text-[var(--color-primary)]' : 'text-slate-500'}>Bahasa Melayu</button>
                    </div>
                    {currentUser ? (
                         <div className="space-y-3">
                             <button
                                onClick={() => { onDashboardClick(); onClose(); }}
                                className="w-full font-semibold text-sm px-6 py-3 rounded-full text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                            >
                                Dashboard
                            </button>
                             <button
                                onClick={() => { onCartClick(); onClose(); }}
                                className="w-full font-semibold text-sm px-6 py-3 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                                View Cart
                            </button>
                            <button
                                onClick={() => { handleLogout(); onClose(); }}
                                className="w-full font-semibold text-sm px-6 py-3 rounded-full bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                             <button
                                onClick={() => { onSignUpClick(); onClose(); }}
                                className="w-full font-semibold text-sm px-6 py-3 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                            >
                                {content?.signUp}
                            </button>
                             <button
                                onClick={() => { onLoginClick(); onClose(); }}
                                className="w-full font-semibold text-sm px-6 py-3 rounded-full text-[var(--color-text)] bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                {content?.login}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface HeaderProps {
    onLoginClick: () => void;
    onSignUpClick: () => void;
    onCartClick: () => void;
    onDashboardClick: () => void;
    logoUrl: string;
    content: any;
    language: string;
    onLanguageChange: (lang: string) => void;
}
const Header = memo(({ onLoginClick, onSignUpClick, onCartClick, onDashboardClick, logoUrl, content, language, onLanguageChange }: HeaderProps) => {
    const { currentUser, handleLogout } = useAuth();
    const cartItemCount = currentUser?.cart?.length || 0;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <>
            <header className={`py-5 px-4 sm:px-6 lg:px-8 fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]' : 'bg-transparent'}`}>
                <div className="container mx-auto flex justify-between items-center">
                    <MampaniLogo logoUrl={logoUrl} />
                    
                    {!currentUser && (
                         <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-500">
                            {navLinks.map(link => (
                                <a key={link.href} href={link.href} className="hover:text-[var(--color-primary)] transition-colors">{link.label}</a>
                            ))}
                        </nav>
                    )}

                    <div className="hidden lg:flex items-center gap-6 text-base font-medium">
                         <div className="text-sm font-semibold">
                            <button onClick={() => onLanguageChange('en')} className={language === 'en' ? 'text-[var(--color-primary)]' : 'text-slate-500 hover:text-[var(--color-primary)]'}>EN</button>
                            <span className="text-slate-300 mx-1">|</span>
                            <button onClick={() => onLanguageChange('ms')} className={language === 'ms' ? 'text-[var(--color-primary)]' : 'text-slate-500 hover:text-[var(--color-primary)]'}>MS</button>
                        </div>
                         {currentUser ? (
                            <div className="flex items-center gap-4">
                                 <button
                                    onClick={onDashboardClick}
                                    className="font-semibold text-sm px-6 py-2.5 rounded-full text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                                >
                                    Dashboard
                                </button>
                                <button onClick={onCartClick} className="relative text-slate-600 hover:text-[var(--color-primary)] p-2" aria-label={`Open cart with ${cartItemCount} items`}>
                                    <ShoppingCartIcon />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-xs font-bold">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </button>
                                <button onClick={handleLogout} className="font-semibold text-sm px-6 py-2.5 rounded-full bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onLoginClick}
                                    className="font-semibold text-sm px-6 py-2.5 rounded-full text-[var(--color-text)] hover:bg-slate-100 transition-colors"
                                >
                                    {content?.login}
                                </button>
                                <button
                                    onClick={onSignUpClick}
                                    className="font-semibold text-sm px-6 py-2.5 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                                >
                                    {content?.signUp}
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="lg:hidden text-slate-800" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>
            <MobileNav 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                onLoginClick={onLoginClick} 
                onSignUpClick={onSignUpClick}
                onDashboardClick={onDashboardClick}
                onCartClick={onCartClick}
                content={content}
                language={language}
                onLanguageChange={onLanguageChange}
            />
        </>
    );
});

Header.displayName = 'Header';

export default Header;