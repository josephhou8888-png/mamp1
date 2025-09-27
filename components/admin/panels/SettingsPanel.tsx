import React, { useState } from 'react';
import { TextInput, TextareaInput, ToggleInput, SocialLinkInput, Fieldset, ImageUploadInput } from '../AdminFormComponents';
import { supabase } from '../../../services/supabaseClient';
import { useToast } from '../../../contexts/ToastContext';
import { SpinnerIcon } from '../../IconComponents';

const SettingsPanel = ({ data, onChange, adminContent }) => {
    const settings = data.websiteSettings || { features: {}, socialLinks: {} };
    const labels = adminContent.labels;
    const actions = adminContent.actions;
    const [isTesting, setIsTesting] = useState(false);
    const { showToast } = useToast();

    const handleTestConnection = async () => {
        setIsTesting(true);
        try {
            // A simple, low-cost query to test the connection
            const { error } = await supabase.from('website_content').select('lang').limit(1).single();
            if (error) {
                // Supabase client might not throw but return an error object
                throw error;
            }
            showToast('Database connection successful!', 'success');
        } catch (err: any) {
            console.error("Database connection test failed:", err);
            showToast(`Database connection failed: ${err.message}`, 'error');
        } finally {
            setIsTesting(false);
        }
    };

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

            <Fieldset legend="Database">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md hover:bg-slate-200 text-sm disabled:opacity-50"
                    >
                        {isTesting && <SpinnerIcon />}
                        {isTesting ? 'Testing...' : 'Test Database Connection'}
                    </button>
                    <p className="text-xs text-slate-500">
                        Click to verify the application can connect to the Supabase database.
                    </p>
                </div>
            </Fieldset>
        </div>
    );
};

export default SettingsPanel;