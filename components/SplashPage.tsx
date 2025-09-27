import React from 'react';
import { CloseIcon } from './IconComponents';

const SplashPage = ({ isOpen, content, onClose, onRegisterClick }) => {
    // The decision to show the splash page is now fully controlled by the `isOpen` prop from App.tsx.
    // The content and enabled checks are handled there.
    if (!isOpen || !content) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
            aria-labelledby="splash-title"
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden flex flex-col md:flex-row chat-fab border border-slate-200"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-slate-500 bg-white/50 rounded-full p-1.5 hover:bg-white/80 transition-colors z-20" 
                    aria-label="Close promotional message"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>

                <div className="md:w-1/2 h-64 md:h-auto min-h-[250px] relative">
                    <img src={content.imageUrl} alt="Event Promotion" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r"></div>
                </div>
                
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
                    <h2 id="splash-title" className="text-4xl md:text-5xl font-sans text-black tracking-tight">{content.title}</h2>
                    <p className="mt-4 text-slate-600 text-lg">{content.subtitle}</p>
                    <button
                        onClick={(e) => { e.preventDefault(); onRegisterClick(); }} 
                        className="mt-8 w-full md:w-auto text-lg font-semibold px-10 py-4 rounded-full bg-primary text-white shadow-lg hover:bg-primary-hover transition-colors duration-300 self-center md:self-start"
                    >
                        {content.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SplashPage;