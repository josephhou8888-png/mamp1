

import React from 'react';

declare global {
  interface Window {
    cloudinary: any;
  }
}

export const Fieldset = ({ legend, children }: { legend: string, children?: React.ReactNode }) => (
    <fieldset className="p-4 border border-slate-200 rounded-lg space-y-4">
        <legend className="px-2 font-semibold text-slate-700">{legend}</legend>
        {children}
    </fieldset>
);


// Reusable input fields
export const TextInput = ({ label, value, onChange, placeholder = '' }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <input 
        type="text" 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
    />
  </div>
);

export const ImageUploadInput = ({ label, value, onChange, buttonText }) => {
    const handleUpload = () => {
        const myWidget = window.cloudinary.createUploadWidget({
            cloudName: 'dqrgk0du2', 
            uploadPreset: 'mampani-image',
            cropping: true,
            sources: ['local', 'url', 'camera'],
            multiple: false,
        }, (error, result) => { 
            if (!error && result && result.event === "success") { 
                console.log('Uploaded Image Info: ', result.info);
                // Create a synthetic event to pass to the onChange handler,
                // making this component's API consistent with a standard input.
                const syntheticEvent = {
                    target: {
                        value: result.info.secure_url
                    }
                };
                onChange(syntheticEvent);
            }
        });

        myWidget.open();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    value={value} 
                    onChange={onChange} // Pass the event handler directly
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button 
                    type="button" 
                    onClick={handleUpload}
                    className="flex-shrink-0 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md hover:bg-slate-200 text-sm"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export const VideoUploadInput = ({ label, value, onChange, buttonText }) => {
    const handleUpload = () => {
        const myWidget = window.cloudinary.createUploadWidget({
            cloudName: 'dqrgk0du2', 
            uploadPreset: 'mampani-video',
            sources: ['local', 'url'],
            multiple: false,
            resourceType: 'video',
        }, (error, result) => { 
            if (!error && result && result.event === "success") { 
                console.log('Uploaded Video Info: ', result.info);
                const syntheticEvent = {
                    target: {
                        value: result.info.secure_url
                    }
                };
                onChange(syntheticEvent);
            }
        });

        myWidget.open();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    value={value} 
                    onChange={onChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button 
                    type="button" 
                    onClick={handleUpload}
                    className="flex-shrink-0 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md hover:bg-slate-200 text-sm"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export const TextareaInput = ({ label, value, onChange, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <textarea 
        rows={rows} 
        value={value} 
        onChange={onChange} 
        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
    />
  </div>
);

export const ToggleInput = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between p-3 bg-slate-50 rounded-md border">
        <span className="font-medium text-slate-700">{label}</span>
        <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </div>
    </label>
);

export const SocialLinkInput = ({ socialLinks, onChange, labels }) => {
    return (
        <div className="space-y-3">
             <TextInput label={labels.twitterUrl} value={socialLinks.twitter} onChange={e => onChange('websiteSettings.socialLinks.twitter', e.target.value)} />
             <TextInput label={labels.facebookUrl} value={socialLinks.facebook} onChange={e => onChange('websiteSettings.socialLinks.facebook', e.target.value)} />
             <TextInput label={labels.instagramUrl} value={socialLinks.instagram} onChange={e => onChange('websiteSettings.socialLinks.instagram', e.target.value)} />
             <TextInput label={labels.linkedinUrl} value={socialLinks.linkedin} onChange={e => onChange('websiteSettings.socialLinks.linkedin', e.target.value)} />
        </div>
    );
};