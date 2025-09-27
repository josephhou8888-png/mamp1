import React from 'react';
import { TextInput, TextareaInput, Fieldset, ImageUploadInput, VideoUploadInput } from '../AdminFormComponents';

const HeroPanel = ({ data, onChange, onAddItem, onRemoveItem, adminContent }) => {
    const hero = data.hero || {};
    const sponsors = data.sponsors || {};
    const labels = adminContent.labels;
    const actions = adminContent.actions;

    return (
        <div className="space-y-6">
            <Fieldset legend="Hero Content">
                <TextareaInput label={labels.title} value={hero.title || ''} onChange={e => onChange('hero.title', e.target.value)} />
                <TextareaInput label={labels.subtitle} value={hero.subtitle || ''} onChange={e => onChange('hero.subtitle', e.target.value)} />
                <TextInput label={labels.buttonText + " 1 (Primary)"} value={hero.button1 || ''} onChange={e => onChange('hero.button1', e.target.value)} />
                <TextInput label={labels.buttonText + " 2 (Secondary)"} value={hero.button2 || ''} onChange={e => onChange('hero.button2', e.target.value)} />
                <VideoUploadInput 
                    label={labels.videoUrl} 
                    value={hero.videoUrl || ''} 
                    onChange={e => onChange('hero.videoUrl', e.target.value)}
                    buttonText={actions.uploadVideo}
                />
            </Fieldset>

            <Fieldset legend="Sponsors Bar">
                {(sponsors.logos || []).map((logo, index) => (
                    <div key={index} className="p-4 border rounded-md mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                        <ImageUploadInput 
                            label={labels.sponsorLogoSrc} 
                            value={logo.src} 
                            onChange={e => onChange(`sponsors.logos.${index}.src`, e.target.value)}
                            buttonText={actions.uploadImage}
                        />
                        <TextInput label={labels.sponsorAlt} value={logo.alt} onChange={e => onChange(`sponsors.logos.${index}.alt`, e.target.value)} />
                        <button onClick={() => onRemoveItem('sponsors.logos', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold p-1 leading-none">✕</button>
                    </div>
                ))}
                <button onClick={() => onAddItem('sponsors.logos', { src: '', alt: '' })} className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-md hover:bg-emerald-200 text-sm">
                    {actions.addSponsor}
                </button>
            </Fieldset>
        </div>
    );
};

export default HeroPanel;