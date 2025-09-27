

import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from '../IconComponents';

interface ModalWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    maxWidth?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, children, maxWidth = 'max-w-md' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);


    useEffect(() => {
        let timeoutId: number | undefined;
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            timeoutId = window.setTimeout(() => {
                setIsVisible(true);
                closeButtonRef.current?.focus();
            }, 10);
        } else {
            document.body.style.overflow = '';
            setIsVisible(false);
        }
        
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            } else if (event.key === 'Tab') {
                const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusableElements || focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) { // Shift+Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;

    return (
        <div 
            className={`fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 modal-overlay ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                ref={modalRef}
                className={`w-full ${maxWidth} relative modal-content bg-white rounded-3xl shadow-2xl overflow-hidden ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-5'}`} 
                onClick={e => e.stopPropagation()}
            >
                 <button ref={closeButtonRef} onClick={onClose} className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors z-10" aria-label="Close modal">
                    <CloseIcon />
                 </button>
                 {children}
            </div>
        </div>
    );
};

export default ModalWrapper;