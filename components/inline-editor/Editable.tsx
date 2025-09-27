import React, { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    cloudinary: any;
  }
}

/**
 * Recursively traverses React children to extract a plain text string representation.
 * This is used to correctly display initial values in the editor for complex children.
 * @param children The React.ReactNode to extra text from.
 * @returns A plain text string.
 */
const getChildrenAsText = (children: React.ReactNode): string => {
    return React.Children.toArray(children).map(child => {
        if (typeof child === 'string' || typeof child === 'number') {
            return child;
        }
        // FIX: Cast `child.props` to `any` to safely access `children`. The TypeScript compiler
        // infers `child.props` as `unknown` here, causing a type error.
        if (React.isValidElement(child) && (child.props as any).children) {
            return getChildrenAsText((child.props as any).children);
        }
        return '';
    }).join('');
};

interface EditableProps {
    path: string;
    onUpdate: (path: string, value: any) => void;
    children: React.ReactNode;
    isEditing: boolean;
    type?: 'text' | 'textarea' | 'html' | 'image';
    className?: string;
}

const Editable: React.FC<EditableProps> = ({ path, onUpdate, children, isEditing, type = 'text', className = '' }) => {
    const [isEditingActive, setIsEditingActive] = useState(false);
    const [currentValue, setCurrentValue] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const getDeepValueFromChildren = (element: React.ReactElement): string => {
        if (!element) return '';
        const props = element.props as any;
        if (type === 'html' && props?.dangerouslySetInnerHTML?.__html) {
             return props.dangerouslySetInnerHTML.__html;
        }
        if (type === 'image' && props?.src) {
            return props.src;
        }
        // FIX: Recursively extract text content to avoid "[object Object]" errors
        // when children contain nested React components.
        return getChildrenAsText(props.children);
    };

    useEffect(() => {
        if (isEditingActive) {
           const childElement = React.Children.only(children) as React.ReactElement;
           setCurrentValue(getDeepValueFromChildren(childElement));
        }
    }, [isEditingActive, children, type]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsEditingActive(false);
            }
        };

        if (isEditingActive) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEditingActive]);
    
    const handleSave = () => {
        onUpdate(path, currentValue);
        setIsEditingActive(false);
    };
    
    const handleImageUpload = () => {
        const myWidget = window.cloudinary.createUploadWidget({
            cloudName: 'dqrgk0du2',
            uploadPreset: 'mampani-image',
            cropping: true,
            sources: ['local', 'url', 'camera'],
            multiple: false,
        }, (error, result) => { 
            if (!error && result && result.event === "success") { 
                onUpdate(path, result.info.secure_url);
            }
        });
        myWidget.open();
    };

    if (!isEditing) {
        return <>{children}</>;
    }
    
    const popoverContent = () => {
        const InputComponent = (type === 'textarea' || type === 'html') ? 'textarea' : 'input';
        
        return (
             <div ref={popoverRef} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 bg-white border border-slate-300 rounded-lg shadow-2xl p-4 z-[10000] space-y-2" onClick={e => e.stopPropagation()}>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{path}</label>
                <InputComponent
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-black"
                    rows={type === 'textarea' || type === 'html' ? 8 : undefined}
                    autoFocus
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey && type !== 'textarea' && type !== 'html') { e.preventDefault(); handleSave(); }}}
                />
                <div className="flex justify-end gap-2">
                     <button onClick={() => setIsEditingActive(false)} className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-sm font-semibold">Cancel</button>
                     <button onClick={handleSave} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm font-semibold">Save</button>
                </div>
            </div>
        );
    };

    const activateEditing = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (type === 'image') {
            handleImageUpload();
        } else {
            setIsEditingActive(true);
        }
    };

    return (
        <div ref={wrapperRef} className={`relative group outline outline-2 outline-dashed outline-transparent hover:outline-emerald-500 transition-all p-1 -m-1 rounded-md ${className}`}>
            {children}
            <button 
                onClick={activateEditing}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-emerald-600 text-white w-6 h-6 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label={`Edit ${path}`}
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
            </button>
            {isEditingActive && popoverContent()}
        </div>
    );
};

export default Editable;