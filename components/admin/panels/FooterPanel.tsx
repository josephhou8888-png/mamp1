import React from 'react';
import { TextInput, TextareaInput, Fieldset } from '../AdminFormComponents';

const FooterPanel = ({ data, onChange, onAddItem, onRemoveItem, adminContent }) => {
    const footer = data.footer || {};
    const quickLinks = footer.quickLinks || {};
    const newsletter = footer.newsletter || {};
    const labels = adminContent.labels;
    const actions = adminContent.actions;

    return (
        <div className="space-y-6">
            <Fieldset legend="General Footer Content">
                <TextareaInput label={labels.description} value={footer.description || ''} onChange={e => onChange('footer.description', e.target.value)} />
                <TextInput label={labels.copyright} value={footer.copyright || ''} onChange={e => onChange('footer.copyright', e.target.value)} />
            </Fieldset>

            <Fieldset legend="Quick Links">
                <TextInput label={labels.title} value={quickLinks.title || ''} onChange={e => onChange('footer.quickLinks.title', e.target.value)} />
                {(quickLinks.links || []).map((link, index) => (
                    <div key={index} className="flex items-end gap-2">
                        <div className="flex-grow">
                             <TextInput label={`${labels.quickLink} ${index + 1}`} value={link} onChange={e => onChange(`footer.quickLinks.links.${index}`, e.target.value)} />
                        </div>
                         <button onClick={() => onRemoveItem('footer.quickLinks.links', index)} className="h-10 px-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-md">✕</button>
                    </div>
                ))}
                <button onClick={() => onAddItem('footer.quickLinks.links', 'New Link')} className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-md hover:bg-emerald-200 text-sm">
                    {actions.addQuickLink}
                </button>
            </Fieldset>
            
            <Fieldset legend="Newsletter Box">
                <TextInput label={labels.title} value={newsletter.title || ''} onChange={e => onChange('footer.newsletter.title', e.target.value)} />
                <TextareaInput label={labels.subtitle} value={newsletter.subtitle || ''} onChange={e => onChange('footer.newsletter.subtitle', e.target.value)} />
                <TextInput label={labels.newsletterPlaceholder} value={newsletter.placeholder || ''} onChange={e => onChange('footer.newsletter.placeholder', e.target.value)} />
                <TextInput label={labels.buttonText} value={newsletter.button || ''} onChange={e => onChange('footer.newsletter.button', e.target.value)} />
            </Fieldset>
        </div>
    );
};

export default FooterPanel;