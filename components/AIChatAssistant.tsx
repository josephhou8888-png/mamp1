import React, { useState, useEffect, useRef } from 'react';
import { streamChatResponse } from '../services/geminiService';
import { RobotIcon, SendIcon, ChatBubbleIcon } from './IconComponents';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-3">
        <div className="w-2 h-2 bg-slate-500 rounded-full typing-dot"></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full typing-dot"></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full typing-dot"></div>
    </div>
);

const AIChatAssistant: React.FC<{content: any}> = ({ content }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isWaving, setIsWaving] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ role: 'model', text: content.welcomeMessage }]);
            inputRef.current?.focus();
        }
    }, [isOpen, messages, content]);
    
    useEffect(() => {
        if (isOpen) {
            setIsWaving(false);
            setShowTooltip(false);
            return;
        };

        let waveTimerId: number | undefined;
        const intervalId = setInterval(() => {
            setIsWaving(true);
            setShowTooltip(true);
            waveTimerId = window.setTimeout(() => {
                setIsWaving(false);
                setShowTooltip(false);
            }, 3000);
        }, 30000);

        return () => {
            clearInterval(intervalId);
            if (waveTimerId) clearTimeout(waveTimerId);
        };
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userInput = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
        const messageText = userInput.value.trim();
        
        if (!messageText || isLoading) return;
        
        userInput.value = '';
        const newMessages: Message[] = [...messages, { role: 'user', text: messageText }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            
            let currentResponse = "";
            for await (const chunk of streamChatResponse(newMessages)) {
                currentResponse += chunk;
                setMessages(prev => {
                    const updatedMessages = [...prev];
                    updatedMessages[updatedMessages.length - 1].text = currentResponse;
                    return updatedMessages;
                });
            }
        } catch (error) {
            console.error("AI Chat Error:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessage.text = "Sorry, I encountered an error. Please try again.";
                return newMessages;
            });
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="chat-window bg-white/80 backdrop-blur-xl w-[calc(100vw-3rem)] max-w-sm h-[60vh] max-h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[var(--color-border)]">
                    <header className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <RobotIcon className="w-8 h-8 text-[var(--color-primary)]" />
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                            </div>
                            <h3 className="font-bold text-lg text-[var(--color-text)]">{content.headerTitle}</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    </header>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages-container">
                        {messages.map((msg, index) => (
                             <div key={index} className={`flex items-end gap-2 chat-message-bubble ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <RobotIcon className="w-6 h-6 text-slate-500 flex-shrink-0" />}
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.role === 'user' ? 'bg-[var(--color-primary)] text-white font-medium rounded-br-none' : 'bg-slate-200 text-[var(--color-text)] rounded-bl-none'}`}>
                                    <p className="text-sm break-words">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-end gap-2 justify-start">
                                <RobotIcon className="w-6 h-6 text-slate-500 flex-shrink-0" />
                                <div className="bg-slate-200 rounded-2xl rounded-bl-none">
                                     <TypingIndicator />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <footer className="p-4 border-t border-[var(--color-border)]">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                name="message"
                                placeholder={content.inputPlaceholder}
                                className="w-full px-4 py-2 bg-white border border-[var(--color-border)] rounded-full focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--color-text)]"
                                disabled={isLoading}
                                autoComplete="off"
                            />
                            <button type="submit" disabled={isLoading} className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-primary-hover)] disabled:opacity-50">
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </footer>
                </div>
            )}

            {!isOpen && (
                 <div className="relative group">
                     <div className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ease-out transform ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                         <div className="flex items-center gap-2 bg-slate-800 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-lg">
                             <ChatBubbleIcon className="w-5 h-5" />
                             <span>{content.initialTooltip}</span>
                         </div>
                         <div className="absolute right-4 -bottom-1.5 w-3 h-3 bg-slate-800 transform rotate-45"></div>
                     </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="chat-fab w-16 h-16 bg-[var(--color-primary)] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[var(--color-primary-hover)] transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/50"
                        aria-label={content.fabAriaLabel}
                    >
                       <RobotIcon className={`w-14 h-14 transition-transform duration-300 ${isWaving ? 'waving' : ''}`} />
                    </button>
                 </div>
            )}
        </div>
    );
};

export default AIChatAssistant;