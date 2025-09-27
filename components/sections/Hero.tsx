import React, { useState, useEffect, useRef, memo } from 'react';
import Editable from '../inline-editor/Editable';

interface HeroProps {
    content: any;
    onCalculateClick: () => void;
    onSignUpClick: () => void;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
}

const animations = [
    { in: 'animate-slide-in-up', out: 'animate-slide-out-up' },
    { in: 'animate-fade-in-simple', out: 'animate-fade-out-simple' },
    { in: 'animate-slide-in-right', out: 'animate-slide-out-left' },
    { in: 'animate-zoom-in', out: 'animate-zoom-out' }
];

const Hero = memo(({ content, onCalculateClick, onSignUpClick, isEditing, onUpdate }: HeroProps) => {
    const rotatingTitles = content?.rotatingTitles || [];
    
    const [titleIndex, setTitleIndex] = useState(0);
    const [animationClass, setAnimationClass] = useState('');
    const lastAnimationIndexRef = useRef<number | null>(null);

    useEffect(() => {
        if (isEditing) return;

        const initialIndex = Math.floor(Math.random() * animations.length);
        lastAnimationIndexRef.current = initialIndex;
        setAnimationClass(animations[initialIndex].in);

        const animationDuration = 600;
        const messageInterval = 4000;

        const interval = setInterval(() => {
            const currentAnimation = animations[lastAnimationIndexRef.current!];
            setAnimationClass(currentAnimation.out);
            
            setTimeout(() => {
                let nextAnimationIndex;
                do {
                    nextAnimationIndex = Math.floor(Math.random() * animations.length);
                } while (animations.length > 1 && nextAnimationIndex === lastAnimationIndexRef.current);
                
                lastAnimationIndexRef.current = nextAnimationIndex;
                const nextAnimation = animations[nextAnimationIndex];

                setTitleIndex(prevIndex => (prevIndex + 1) % rotatingTitles.length);
                setAnimationClass(nextAnimation.in);
            }, animationDuration);
            
        }, messageInterval);

        return () => clearInterval(interval);
    }, [rotatingTitles.length, isEditing]);

    return (
        <section className="relative text-center h-screen min-h-[700px] flex items-center justify-center overflow-hidden px-4">
            <div className="relative z-20">
                <div className="h-48 md:h-64 flex items-center justify-center overflow-hidden">
                    {isEditing ? (
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg space-y-2 w-full max-w-3xl">
                             <h2 className="text-xl font-bold text-white mb-2 text-left">Edit Rotating Titles</h2>
                             {rotatingTitles.map((title, index) => (
                                 <Editable key={index} path={`hero.rotatingTitles.${index}`} isEditing={isEditing} onUpdate={onUpdate}>
                                    <div className="text-white text-lg bg-black/20 p-3 rounded">{title}</div>
                                 </Editable>
                             ))}
                        </div>
                    ) : (
                         <h1 className={`text-5xl md:text-7xl font-sans font-bold text-white leading-tight tracking-tight max-w-5xl ${animationClass}`}>
                            {rotatingTitles[titleIndex]}
                        </h1>
                    )}
                </div>

                <Editable path="hero.subtitle" isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        {content?.subtitle || ''}
                    </p>
                </Editable>

                <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <Editable path="hero.button1" isEditing={isEditing} onUpdate={onUpdate}>
                        <button onClick={onCalculateClick} className="w-full sm:w-auto text-base font-semibold px-10 py-4 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all duration-300 transform hover:scale-105">
                            {content?.button1 || 'Calculate'}
                        </button>
                    </Editable>
                    <Editable path="hero.button2" isEditing={isEditing} onUpdate={onUpdate}>
                        <button onClick={onSignUpClick} className="w-full sm:w-auto text-base font-semibold px-10 py-4 rounded-full text-white border-2 border-white/80 hover:bg-white hover:text-black transition-colors duration-300">
                            {content?.button2 || 'Sign Up'}
                        </button>
                    </Editable>
                </div>
            </div>
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;