import React, { memo } from 'react';
import Editable from '../inline-editor/Editable';

interface JoinProps {
    content: any;
    onSignUpClick: () => void;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
}
const Join = memo(({ content, onSignUpClick, isEditing, onUpdate }: JoinProps) => (
    <section id="join" className="py-20 md:py-32 px-4 text-center bg-slate-50/40 backdrop-blur-sm">
        <div className="container mx-auto max-w-3xl">
            <Editable path="join.title" isEditing={isEditing} onUpdate={onUpdate}>
                <h2 className="text-5xl md:text-6xl font-sans tracking-tight">{content?.title || ''}</h2>
            </Editable>
            <Editable path="join.subtitle" isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                <p className="mt-6 text-lg">
                    {content?.subtitle || ''}
                </p>
            </Editable>
            <div className="mt-12">
                <Editable path="join.button" isEditing={isEditing} onUpdate={onUpdate}>
                    <button onClick={onSignUpClick} className="text-base font-semibold px-10 py-4 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all duration-300 transform hover:scale-105">
                        {content?.button || ''}
                    </button>
                </Editable>
            </div>
        </div>
    </section>
));

Join.displayName = 'Join';

export default Join;
