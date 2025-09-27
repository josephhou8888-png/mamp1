import React from 'react';
import { TextInput, TextareaInput, ToggleInput, SocialLinkInput, Fieldset, ImageUploadInput } from '../AdminFormComponents';

const SettingsPanel = ({ data, onChange, adminContent }) => {
    const settings = data.websiteSettings || { features: {}, socialLinks: {} };
    const labels = adminContent.labels;
    const actions = adminContent.actions;

    return (
        <div className="space-y-6">
            <Fieldset legend="General">
                <TextInput label={labels.metaTitle} value={settings.title || ''} onChange={e => onChange('websiteSettings.title', e.target.value)} />
                <TextareaInput label={labels.metaDescription} value={settings.metaDescription || ''} onChange={e => onChange('websiteSettings.metaDescription', e.target.value)} />
            </Fieldset>
            
            <Fieldset legend="Branding">
                 <ImageUploadInput 
                    label={labels.logoUrl} 
                    value={settings.logoUrl || ''} 
                    onChange={e => onChange('websiteSettings.logoUrl', e.target.value)}
                    buttonText={actions.uploadImage}
                />
                 <TextInput label={labels.primaryColor} value={settings.primaryColor || '#059669'} onChange={e => onChange('websiteSettings.primaryColor', e.target.value)} />
            </Fieldset>

            <Fieldset legend="Features">
                <ToggleInput label={labels.enableSplash} checked={settings.features?.splashEnabled === 'true'} onChange={e => onChange('websiteSettings.features.splashEnabled', e.target.checked ? 'true' : 'false')} />
                <ToggleInput label={labels.enableAIChat} checked={settings.features?.aiChatEnabled === 'true'} onChange={e => onChange('websiteSettings.features.aiChatEnabled', e.target.checked ? 'true' : 'false')} />
            </Fieldset>

            <Fieldset legend="Payment Gateway">
                <TextInput 
                    label={labels.tngApiKey} 
                    value={settings.tngApiKey || ''} 
                    onChange={e => onChange('websiteSettings.tngApiKey', e.target.value)}
                    placeholder="Enter your API key"
                />
            </Fieldset>

             <Fieldset legend="Social Media Links">
                 <SocialLinkInput socialLinks={settings.socialLinks || {}} onChange={onChange} labels={labels} />
             </Fieldset>
        </div>
    );
};

export default SettingsPanel;
