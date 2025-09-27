import React from 'react';
import ModalWrapper from './ModalWrapper';
import { sanitizeHTML } from '../../utils/sanitizer';

interface ArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: any;
}
const ArticleModal = ({ isOpen, onClose, article }: ArticleModalProps) => {
    if (!isOpen || !article) return null;

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
            <div className="p-8 md:p-12 max-h-[80vh] overflow-y-auto">
                <h3 className="text-4xl font-sans text-[var(--color-text)] mb-6">{article.title}</h3>
                <div 
                    className="prose prose-lg max-w-none text-[var(--color-text-secondary)] space-y-4" 
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.fullContent) }}>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ArticleModal;
