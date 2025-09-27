import React, { useRef, memo } from 'react';
import Counter, { useInView } from '../ui/Counter';
import Editable from '../inline-editor/Editable';

interface ImpactProps {
    content: any;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
}
const Impact = memo(({ content, isEditing, onUpdate }: ImpactProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { threshold: 0.2 });

    return (
        <section ref={sectionRef} id="impact" className="py-20 md:py-32 px-4 bg-slate-50/40 backdrop-blur-sm">
            <div className="container mx-auto text-center">
                <Editable path="impact.title" isEditing={isEditing} onUpdate={onUpdate}>
                    <h2 className="text-5xl md:text-6xl font-sans tracking-tight">{content?.title || ''}</h2>
                </Editable>
                <div className="mt-20 grid md:grid-cols-3 gap-8">
                    {(content?.stats || []).filter(Boolean).map((stat, index) => (
                        <div
                            key={index}
                            className={`bg-white p-10 rounded-2xl border border-[var(--color-border)] shadow-sm transition-all duration-500 transform ${
                                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <Editable path={`impact.stats.${index}.value`} isEditing={isEditing} onUpdate={onUpdate}>
                                <Counter value={stat.value || '0'} startAnimation={isInView} className="text-6xl md:text-7xl font-sans font-bold text-[var(--color-primary)]" />
                            </Editable>
                            <Editable path={`impact.stats.${index}.label`} isEditing={isEditing} onUpdate={onUpdate}>
                                <h3 className="mt-6 text-2xl font-sans text-[var(--color-text)]">{stat.label}</h3>
                            </Editable>
                             <Editable path={`impact.stats.${index}.description`} isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                                <p className="mt-2">{stat.description}</p>
                            </Editable>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Impact.displayName = 'Impact';

export default Impact;
