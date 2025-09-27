import React from 'react';
import { TextInput, Fieldset, ImageUploadInput, TextareaInput } from '../AdminFormComponents';

const AboutPanel = ({ data, onChange, adminContent }) => {
    const about = data.about || {};
    const labels = adminContent.labels;

    return (
        <div className="space-y-6">
            <Fieldset legend="About Section Content">
                <TextInput label={labels.title} value={about.title || ''} onChange={e => onChange('about.title', e.target.value)} />
                <TextareaInput 
                    label={labels.aboutContent} 
                    value={about.content || ''} 
                    onChange={e => onChange('about.content', e.target.value)} 
                    rows={10} 
                />
                <ImageUploadInput 
                    label={labels.imageUrl} 
                    value={about.imageUrl || ''} 
                    onChange={e => onChange('about.imageUrl', e.target.value)}
                    buttonText={adminContent.actions.uploadImage}
                />
            </Fieldset>
        </div>
    );
};

export default AboutPanel;