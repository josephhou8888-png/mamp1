import React, { memo } from 'react';
import Editable from '../inline-editor/Editable';

interface SponsorsProps {
    content: any;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
}
const Sponsors = memo(({ content, isEditing, onUpdate }: SponsorsProps) => {
    const logos = (content?.logos || []).filter(Boolean);
    if (logos.length === 0) return null;

    return (
        <div className="py-16 overflow-hidden bg-white/80 backdrop-blur-sm" role="region" aria-label="Our Sponsors">
            <div className={`flex whitespace-nowrap ${!isEditing && 'animate-scroll'}`}>
                {[...logos, ...logos].map((logo, index) => {
                    const originalIndex = index % logos.length;
                    return (
                        <div key={index} className="flex-shrink-0 mx-12 flex flex-col items-center gap-2" aria-hidden={index >= logos.length}>
                            <Editable
                                path={`sponsors.logos.${originalIndex}.src`}
                                isEditing={isEditing}
                                onUpdate={onUpdate}
                                type="image"
                                className="inline-block"
                            >
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="h-8 md:h-10 object-contain grayscale opacity-60 hover:opacity-100 transition-opacity"
                                />
                             </Editable>
                             <Editable
                                path={`sponsors.logos.${originalIndex}.alt`}
                                isEditing={isEditing}
                                onUpdate={onUpdate}
                                type="text"
                                className="inline-block"
                            >
                                <span className="text-xs text-transparent group-hover:text-slate-400">{logo.alt}</span>
                             </Editable>
                        </div>
                    )
                })}
            </div>
        </div>
    );
});

Sponsors.displayName = 'Sponsors';

export default Sponsors;
