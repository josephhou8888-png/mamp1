import React from 'react';
import { TextInput, TextareaInput, Fieldset, ImageUploadInput } from '../AdminFormComponents';

const CommunityPanel = ({ data, onChange, onAddItem, onRemoveItem, adminContent }) => {
    const community = data.community || {};
    const labels = adminContent.labels;
    const actions = adminContent.actions;

    return (
        <div className="space-y-6">
            <Fieldset legend="Section Header">
                <TextInput label={labels.title} value={community.title || ''} onChange={e => onChange('community.title', e.target.value)} />
            </Fieldset>

            <Fieldset legend="Testimonials">
                {(community.testimonials || []).map((item, index) => (
                    <div key={index} className="p-4 border rounded-md my-4 relative space-y-4 bg-white">
                        <h4 className="font-semibold text-slate-600">Testimonial {index + 1}</h4>
                        <TextareaInput label={labels.testimonialQuote} value={item.quote} onChange={e => onChange(`community.testimonials.${index}.quote`, e.target.value)} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput label={labels.testimonialName} value={item.name} onChange={e => onChange(`community.testimonials.${index}.name`, e.target.value)} />
                            <TextInput label={labels.testimonialRole} value={item.role} onChange={e => onChange(`community.testimonials.${index}.role`, e.target.value)} />
                        </div>
                        <ImageUploadInput 
                            label={labels.testimonialAvatar} 
                            value={item.avatar} 
                            onChange={e => onChange(`community.testimonials.${index}.avatar`, e.target.value)}
                            buttonText={actions.uploadImage}
                        />
                        <button onClick={() => onRemoveItem('community.testimonials', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold p-1 leading-none">✕</button>
                    </div>
                ))}
                <button onClick={() => onAddItem('community.testimonials', { quote: '', name: '', role: '', avatar: '' })} className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-md hover:bg-emerald-200 text-sm">
                    {actions.addTestimonial}
                </button>
            </Fieldset>
        </div>
    );
};

export default CommunityPanel;