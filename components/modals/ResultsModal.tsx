import React from 'react';
import ModalWrapper from './ModalWrapper';

interface ResultsModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: any;
    onSignUpClick: () => void;
    content: any;
    errorText: string;
}
const ResultsModal = ({ isOpen, onClose, result, onSignUpClick, content, errorText }: ResultsModalProps) => {
    if (!isOpen || !result) return null;

    const tips = Array.isArray(result.tips) ? result.tips : [];

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
            <div className="p-8 md:p-12 text-left">
                <h3 className="text-3xl font-sans text-[var(--color-text)] mb-6">{content.title}</h3>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="text-center flex-shrink-0">
                        <p className="text-7xl font-sans font-bold text-[var(--color-primary)]">{result.footprint || 'N/A'}</p>
                        <p className="font-semibold text-[var(--color-text-secondary)]">{content.unit}</p>
                    </div>
                    <p className="text-lg text-[var(--color-text-secondary)] flex-1">{result.comparison || errorText}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                     <h4 className="text-2xl font-sans text-[var(--color-text)] mb-4">{content.tipsTitle}</h4>
                     <div className="space-y-4">
                        {tips.map((tip, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-6 h-6 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-full flex items-center justify-center mt-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-[var(--color-text)]">{tip?.title || ''}</p>
                                    <p className="text-[var(--color-text-secondary)]">{tip?.description || ''}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
                <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center">
                    <h4 className="text-2xl font-sans text-[var(--color-text)]">{content.ctaTitle}</h4>
                    <p className="text-[var(--color-text-secondary)] mt-2">{content.ctaSubtitle}</p>
                    <button onClick={onSignUpClick} className="mt-6 text-lg font-semibold px-8 py-3 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors duration-300">
                        {content.ctaButton}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ResultsModal;
