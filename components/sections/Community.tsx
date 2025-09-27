import React, { useState, useEffect, memo } from 'react';
import Editable from '../inline-editor/Editable';

interface CommunityProps {
    content: any;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
}
const Community = memo(({ content, isEditing, onUpdate }: CommunityProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const testimonials = (content?.testimonials || []).filter(Boolean);

    useEffect(() => {
        if (!testimonials || testimonials.length <= 1 || isEditing) return;

        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % testimonials.length);
        }, 7000);

        return () => clearInterval(intervalId);
    }, [currentIndex, testimonials, isEditing]);

    if (testimonials.length === 0) return null;

    const handleDotClick = (index: number) => {
        if (index === currentIndex) return;
        setCurrentIndex(index);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section id="community" className="py-20 md:py-32 px-4 text-center bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto">
                <Editable path="community.title" isEditing={isEditing} onUpdate={onUpdate}>
                    <h2 className="text-5xl md:text-6xl font-sans tracking-tight">{content?.title || ''}</h2>
                </Editable>
                <div
                    key={currentIndex}
                    className="animate-fade-in"
                    style={{ minHeight: '280px' }}
                >
                    {currentTestimonial && (
                        <>
                            <Editable path={`community.testimonials.${currentIndex}.quote`} isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                                <blockquote className="mt-16 max-w-4xl mx-auto">
                                    <p className="text-3xl md:text-4xl font-sans text-[var(--color-text)] leading-relaxed">
                                        "{currentTestimonial.quote}"
                                    </p>
                                </blockquote>
                            </Editable>
                            <div className="mt-10 flex items-center justify-center space-x-4">
                                <Editable path={`community.testimonials.${currentIndex}.avatar`} isEditing={isEditing} onUpdate={onUpdate} type="image">
                                    <img src={currentTestimonial.avatar} alt={currentTestimonial.name} className="w-16 h-16 rounded-full bg-[var(--color-border)] object-cover" loading="lazy" />
                                </Editable>
                                <div>
                                    <Editable path={`community.testimonials.${currentIndex}.name`} isEditing={isEditing} onUpdate={onUpdate}>
                                        <p className="font-bold text-lg text-[var(--color-text)]">{currentTestimonial.name}</p>
                                    </Editable>
                                    <Editable path={`community.testimonials.${currentIndex}.role`} isEditing={isEditing} onUpdate={onUpdate}>
                                        <p className="text-[var(--color-text-secondary)]">{currentTestimonial.role}</p>
                                    </Editable>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-12 flex justify-center items-center space-x-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            aria-label={`View testimonial ${index + 1}`}
                            aria-current={currentIndex === index ? 'true' : 'false'}
                            className="p-2 group"
                        >
                            <div className={`h-2 rounded-full transition-all duration-300 ease-in-out group-hover:bg-slate-400 ${
                                currentIndex === index ? 'bg-[var(--color-primary)] w-8' : 'bg-slate-300 w-2'
                            }`} />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
});

Community.displayName = 'Community';

export default Community;
