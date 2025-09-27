import React, { useState, useRef, memo } from 'react';
import MampaniLogo from './MampaniLogo';
import Editable from '../inline-editor/Editable';
import { TwitterIcon, FacebookIcon, InstagramIcon, LinkedInIcon } from '../IconComponents';

interface FooterProps {
    content: any;
    settings: any;
    onSponsorClick: () => void;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
}
const Footer = memo(({ content, settings, onSponsorClick, isEditing, onUpdate }: FooterProps) => {
    const socialLinks = settings?.socialLinks || {};
    const hasSocialLinks = Object.values(socialLinks).some(link => link);
    const quickLinks = content?.quickLinks;
    const newsletter = content?.newsletter;
    const [newsletterMessage, setNewsletterMessage] = useState('');
    const emailInputRef = useRef<HTMLInputElement>(null);

    const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setNewsletterMessage("Thank you for subscribing!");
        if (emailInputRef.current) {
            emailInputRef.current.value = '';
        }
        setTimeout(() => setNewsletterMessage(''), 5000);
    };

    return (
        <footer className="bg-slate-50/80 backdrop-blur-sm text-[var(--color-text-secondary)] border-t border-white/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 grid md:grid-cols-4 gap-12">
                <div className="md:col-span-1 space-y-6">
                    <MampaniLogo logoUrl={settings.logoUrl} inFooter={true} />
                    <Editable path="footer.description" isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                        <p>{content?.description}</p>
                    </Editable>
                    {hasSocialLinks && (
                        <div className="flex space-x-4 pt-2">
                           {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[var(--color-primary)]"><TwitterIcon /></a>}
                           {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[var(--color-primary)]"><FacebookIcon className="w-6 h-6" /></a>}
                           {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[var(--color-primary)]"><InstagramIcon /></a>}
                           {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[var(--color-primary)]"><LinkedInIcon /></a>}
                        </div>
                    )}
                </div>
                <div className="md:col-span-1">
                    <Editable path="footer.quickLinks.title" isEditing={isEditing} onUpdate={onUpdate}>
                        <h3 className="font-sans text-xl text-[var(--color-text)]">{quickLinks?.title}</h3>
                    </Editable>
                    <ul className="mt-4 space-y-3">
                        {(quickLinks?.links || []).filter(Boolean).map((link, index) => (
                            <li key={index}>
                                <Editable path={`footer.quickLinks.links.${index}`} isEditing={isEditing} onUpdate={onUpdate}>
                                    <a href="#" className="hover:text-[var(--color-primary)] transition-colors">{link}</a>
                                </Editable>
                            </li>
                        ))}
                         {content?.forSponsors && (
                            <li>
                                <Editable path="footer.forSponsors" isEditing={isEditing} onUpdate={onUpdate}>
                                    <button onClick={onSponsorClick} className="hover:text-[var(--color-primary)] transition-colors">{content.forSponsors}</button>
                                </Editable>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="md:col-span-2">
                     <Editable path="footer.newsletter.title" isEditing={isEditing} onUpdate={onUpdate}>
                        <h3 className="font-sans text-xl text-[var(--color-text)]">{newsletter?.title}</h3>
                     </Editable>
                     <Editable path="footer.newsletter.subtitle" isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                        <p className="mt-4">{newsletter?.subtitle}</p>
                     </Editable>
                     <form className="mt-6" onSubmit={handleNewsletterSubmit}>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input ref={emailInputRef} type="email" placeholder={newsletter?.placeholder} required className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-lg focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
                            <button type="submit" className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">{newsletter?.button}</button>
                        </div>
                        {newsletterMessage && <p className="mt-3 text-sm text-green-600 font-medium animate-fade-in">{newsletterMessage}</p>}
                     </form>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-white/20 text-center text-sm">
                <Editable path="footer.copyright" isEditing={isEditing} onUpdate={onUpdate}>
                    <p>{content?.copyright}</p>
                </Editable>
            </div>
        </footer>
    );
});

Footer.displayName = 'Footer';

export default Footer;