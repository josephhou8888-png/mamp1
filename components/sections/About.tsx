import React, { memo } from 'react';
import Editable from '../inline-editor/Editable';
import { sanitizeHTML } from '../../utils/sanitizer';

interface AboutProps {
    content: any;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
}
const About = memo(({ content, isEditing, onUpdate }: AboutProps) => (
    <section id="about" className="py-20 md:py-32 px-4 bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className="container mx-auto relative">
            {content?.imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center md:justify-end z-0">
                    <Editable path="about.imageUrl" isEditing={isEditing} onUpdate={onUpdate} type="image" className="w-3/4 md:w-1/2">
                        <img 
                            src={content.imageUrl} 
                            alt=""
                            className="h-auto object-contain opacity-10 pointer-events-none"
                            aria-hidden="true"
                            loading="lazy"
                        />
                    </Editable>
                </div>
            )}
            
            <div className="relative z-10 max-w-2xl text-center md:text-left">
                <Editable path="about.title" isEditing={isEditing} onUpdate={onUpdate} type="text">
                    <h2 className="text-5xl md:text-6xl font-sans tracking-tight">
                        {content?.title || ''}
                    </h2>
                </Editable>
                <Editable path="about.content" isEditing={isEditing} onUpdate={onUpdate} type="html">
                    <div 
                        className="mt-10 text-lg prose prose-lg max-w-none" 
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(content?.content || '')}}>
                    </div>
                </Editable>
            </div>
        </div>
    </section>
));

About.displayName = 'About';

export default About;
