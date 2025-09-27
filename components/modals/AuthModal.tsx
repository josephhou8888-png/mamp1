import React, { useState, useEffect, useRef } from 'react';
import ModalWrapper from './ModalWrapper';
import { SpinnerIcon } from '../IconComponents';
import { useAuth } from '../../contexts/AuthContext';
import { AppUser } from '../../types/firestore';


interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab: string;
    content: any;
    onUserLogin: () => void;
    onSponsorLogin: () => void;
}
const AuthModal = ({ isOpen, onClose, initialTab, content, onUserLogin, onSponsorLogin }: AuthModalProps) => {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactRole, setContactRole] = useState('');
    const [companyDescription, setCompanyDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const emailInputRefLogin = useRef<HTMLInputElement>(null);
    const emailInputRefSignup = useRef<HTMLInputElement>(null);
    const emailInputRefSponsor = useRef<HTMLInputElement>(null);

    const { handleLogin, handleSignUp, handleSponsorSignUp } = useAuth();

    useEffect(() => {
        if (isOpen) setActiveTab(initialTab || 'login');
        if (!isOpen) {
            setError('');
            setEmail('');
            setPassword('');
setName('');
            setPhone('');
            setCompanyName('');
            setCompanyWebsite('');
            setContactPerson('');
            setContactRole('');
            setCompanyDescription('');
            setLoading(false);
        }
    }, [isOpen, initialTab]);
    
    const handleLoginAction = async (e?: React.FormEvent<HTMLFormElement>) => {
        if(e) e.preventDefault();
        setLoading(true);
        setError('');
        const result = await handleLogin(email, password);
        if (result === 'error') {
            setError('Invalid email or password. Please try again.');
            emailInputRefLogin.current?.focus();
        } else {
            onClose();
            if (result === 'user') onUserLogin();
            if (result === 'sponsor') onSponsorLogin();
        }
        setLoading(false);
    };
    
    const handleSignUpAction = async (e?: React.FormEvent<HTMLFormElement>) => {
        if(e) e.preventDefault();
        setLoading(true);
        setError('');
        const result = await handleSignUp(name, email, password);
        if (result === 'user') {
            onClose();
            onUserLogin();
        } else {
            setError('Could not create account.');
            emailInputRefSignup.current?.focus();
        }
        setLoading(false);
    };

    const handleSponsorAction = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        // FIX: Removed `password` from `sponsorData` to match the `AppUser` type. The password will be passed as a separate argument.
        const sponsorData: Partial<AppUser> = { email, companyName, companyWebsite, contactPerson, contactRole, phone, companyDescription };
        const result = await handleSponsorSignUp(sponsorData, password);

        if (result === 'sponsor') {
            onClose();
            onSponsorLogin();
        } else {
            setError('Could not create sponsor account.');
            emailInputRefSponsor.current?.focus();
        }
        setLoading(false);
    };
    
    const inputStyles = "w-full mt-1 px-4 py-3 bg-white border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] text-[var(--color-text)]";

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
            <div className="p-8">
                <div className="flex border-b border-[var(--color-border)] mb-6">
                    <button onClick={() => setActiveTab('login')} className={`px-4 py-2 text-lg font-sans font-semibold transition-colors ${activeTab === 'login' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'}`}>{content.login}</button>
                    <button onClick={() => setActiveTab('signup')} className={`px-4 py-2 text-lg font-sans font-semibold transition-colors ${activeTab === 'signup' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'}`}>{content.signUp}</button>
                    <button onClick={() => setActiveTab('sponsor')} className={`px-4 py-2 text-lg font-sans font-semibold transition-colors ${activeTab === 'sponsor' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'}`}>{content.sponsor}</button>
                </div>

                {/* Login Tab */}
                <div className={activeTab === 'login' ? 'block' : 'hidden'}>
                     <h2 className="text-3xl font-sans font-bold text-center mb-6">{content.welcomeBack}</h2>
                     <form onSubmit={handleLoginAction} className="space-y-4">
                        <div>
                            <label className="font-semibold">{content.email}</label>
                            <input ref={emailInputRefLogin} type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputStyles} />
                        </div>
                        <div>
                            <label className="font-semibold">{content.password}</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inputStyles} />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full mt-4 text-lg font-semibold px-8 py-3 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center">
                            {loading && <SpinnerIcon />} {content.login}
                        </button>
                     </form>
                </div>
                
                {/* User Signup Tab */}
                <div className={activeTab === 'signup' ? 'block' : 'hidden'}>
                     <h2 className="text-3xl font-sans font-bold text-center mb-6">{content.createAccount}</h2>
                     <form onSubmit={handleSignUpAction} className="space-y-4">
                        <div>
                            <label className="font-semibold">{content.fullName}</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputStyles} />
                        </div>
                        <div>
                            <label className="font-semibold">{content.email}</label>
                            <input ref={emailInputRefSignup} type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputStyles} />
                        </div>
                        <div>
                            <label className="font-semibold">{content.password}</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inputStyles} />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full mt-4 text-lg font-semibold px-8 py-3 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center">
                            {loading && <SpinnerIcon />} {content.createAccountBtn}
                        </button>
                    </form>
                </div>

                {/* Sponsor Signup Tab */}
                <div className={activeTab === 'sponsor' ? 'block' : 'hidden'}>
                    <h2 className="text-3xl font-sans font-bold text-center mb-6">{content.sponsorSignUpTitle}</h2>
                    <form onSubmit={handleSponsorAction} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="font-semibold">{content.companyName}</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required className={inputStyles} /></div>
                            <div><label className="font-semibold">{content.companyWebsite}</label><input type="url" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} required className={inputStyles} /></div>
                            <div><label className="font-semibold">{content.contactPerson}</label><input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} required className={inputStyles} /></div>
                            <div><label className="font-semibold">{content.contactRole}</label><input type="text" value={contactRole} onChange={e => setContactRole(e.target.value)} required className={inputStyles} /></div>
                        </div>
                        <div>
                            <label className="font-semibold">{content.email}</label>
                            <input ref={emailInputRefSponsor} type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputStyles} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="font-semibold">{content.password}</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inputStyles} /></div>
                            <div><label className="font-semibold">{content.phone}</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className={inputStyles} /></div>
                        </div>
                        <div>
                            <label className="font-semibold">{content.companyDescription}</label>
                            <textarea value={companyDescription} onChange={e => setCompanyDescription(e.target.value)} required rows={3} className={inputStyles}></textarea>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full mt-4 text-lg font-semibold px-8 py-3 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center">
                            {loading && <SpinnerIcon />} {content.createAccountBtn}
                        </button>
                    </form>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default AuthModal;