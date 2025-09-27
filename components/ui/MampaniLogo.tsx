import React from 'react';

interface MampaniLogoProps {
    logoUrl?: string;
    inFooter?: boolean;
}

const MampaniLogo = ({ logoUrl, inFooter = false }: MampaniLogoProps) => {
    const finalLogoUrl = logoUrl || "https://www.zoji.me/images/logo1.png";
    return (
        <a href="/" className="flex items-center space-x-3 focus:outline-none" aria-label="Mampani Homepage">
            <img src={finalLogoUrl} alt="Mampani Logo" className="w-8 h-8" />
            <span className={`text-2xl font-sans font-bold ${inFooter ? 'text-slate-700' : 'text-[var(--color-text)]'}`}>Mampani</span>
        </a>
    );
};

export default MampaniLogo;
