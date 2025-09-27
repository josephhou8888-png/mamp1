import React from 'react';
import { TextInput, TextareaInput, Fieldset, ImageUploadInput } from '../AdminFormComponents';

const SplashPanel = ({ data, onChange, adminContent }) => {
    const splash = data.splash || {};
    const labels = adminContent.labels;
    const actions = adminContent.actions;

    return (
        <div className="space-y-6">
            <Fieldset legend="Splash Page Content">
                <p className="text-sm text-slate-500">Note: The Splash Page can be toggled on/off in Website Settings &rarr; Features.</p>
                <TextInput label={labels.title} value={splash.title || ''} onChange={e => onChange('splash.title', e.target.value)} />
                <TextareaInput label={labels.subtitle} value={splash.subtitle || ''} onChange={e => onChange('splash.subtitle', e.target.value)} rows={3} />
                <TextInput label={labels.buttonText} value={splash.buttonText || ''} onChange={e => onChange('splash.buttonText', e.target.value)} />
                <ImageUploadInput 
                    label={labels.imageUrl} 
                    value={splash.imageUrl || ''} 
                    onChange={e => onChange('splash.imageUrl', e.target.value)}
                    buttonText={actions.uploadImage}
                />
            </Fieldset>
        </div>
    );
};

export default SplashPanel;