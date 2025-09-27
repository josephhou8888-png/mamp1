import React from 'react';
import { TextInput, TextareaInput, Fieldset } from '../AdminFormComponents';

const StepsPanel = ({ data, onChange, onAddItem, onRemoveItem, adminContent }) => {
    const stepsSection = data.stepsSection || {};
    const labels = adminContent.labels;
    const actions = adminContent.actions;

    return (
        <div className="space-y-6">
            <Fieldset legend="Section Header">
                <TextInput label={labels.title} value={stepsSection.title || ''} onChange={e => onChange('stepsSection.title', e.target.value)} />
                <TextareaInput label={labels.subtitle} value={stepsSection.subtitle || ''} onChange={e => onChange('stepsSection.subtitle', e.target.value)} />
            </Fieldset>

            <Fieldset legend="Steps">
                {(stepsSection.steps || []).map((item, index) => (
                    <div key={index} className="p-4 border rounded-md my-4 relative space-y-4 bg-white">
                        <h4 className="font-semibold text-slate-600">Step {index + 1}</h4>
                        <TextareaInput label={labels.stepIcon} value={item.icon} onChange={e => onChange(`stepsSection.steps.${index}.icon`, e.target.value)} rows={4} />
                        <TextInput label={labels.title} value={item.title} onChange={e => onChange(`stepsSection.steps.${index}.title`, e.target.value)} />
                        <TextareaInput label={labels.description} value={item.description} onChange={e => onChange(`stepsSection.steps.${index}.description`, e.target.value)} />
                        <button onClick={() => onRemoveItem('stepsSection.steps', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold p-1 leading-none">✕</button>
                    </div>
                ))}
                <button onClick={() => onAddItem('stepsSection.steps', { icon: '', title: '', description: '' })} className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-md hover:bg-emerald-200 text-sm">
                    {actions.addStep}
                </button>
            </Fieldset>
        </div>
    );
};

export default StepsPanel;