import React, { memo } from 'react';
import Editable from '../inline-editor/Editable';
import { sanitizeHTML } from '../../utils/sanitizer';

interface StepsProps {
    content: any;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
}
const Steps = memo(({ content, isEditing, onUpdate }: StepsProps) => (
    <section id="steps" className="py-20 md:py-32 px-4 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto text-center">
            <Editable path="stepsSection.title" isEditing={isEditing} onUpdate={onUpdate}>
                <h2 className="text-5xl md:text-6xl font-sans tracking-tight">{content?.title || ''}</h2>
            </Editable>
            <Editable path="stepsSection.subtitle" isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                <p className="mt-6 max-w-3xl mx-auto text-lg">
                    {content?.subtitle || ''}
                </p>
            </Editable>
            <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
                {(content?.steps || []).filter(Boolean).map((step, index) => (
                    <div key={index} className="bg-white p-10 border border-[var(--color-border)] rounded-2xl shadow-sm transition-shadow hover:shadow-md">
                        <div className="w-14 h-14 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl flex items-center justify-center" dangerouslySetInnerHTML={{ __html: sanitizeHTML(step.icon) }}>
                        </div>
                        <Editable path={`stepsSection.steps.${index}.title`} isEditing={isEditing} onUpdate={onUpdate}>
                            <h3 className="mt-8 text-3xl font-sans text-[var(--color-text)]">{step.title}</h3>
                        </Editable>
                        <Editable path={`stepsSection.steps.${index}.description`} isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                            <p className="mt-4">{step.description}</p>
                        </Editable>
                    </div>
                ))}
            </div>
        </div>
    </section>
));

Steps.displayName = 'Steps';

export default Steps;
