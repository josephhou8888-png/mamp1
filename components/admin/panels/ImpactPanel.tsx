import React from 'react';
import { TextInput, TextareaInput, Fieldset } from '../AdminFormComponents';

const ImpactPanel = ({ data, onChange, onAddItem, onRemoveItem, adminContent }) => {
    const impact = data.impact || {};
    const labels = adminContent.labels;
    const actions = adminContent.actions;

    return (
        <div className="space-y-6">
            <Fieldset legend="Section Header">
                <TextInput label={labels.title} value={impact.title || ''} onChange={e => onChange('impact.title', e.target.value)} />
            </Fieldset>

            <Fieldset legend="Impact Statistics">
                {(impact.stats || []).map((item, index) => (
                    <div key={index} className="p-4 border rounded-md my-4 relative space-y-4 bg-white">
                        <h4 className="font-semibold text-slate-600">Stat {index + 1}</h4>
                        <TextInput label={labels.statValue} value={item.value} onChange={e => onChange(`impact.stats.${index}.value`, e.target.value)} />
                        <TextInput label={labels.statLabel} value={item.label} onChange={e => onChange(`impact.stats.${index}.label`, e.target.value)} />
                        <TextareaInput label={labels.description} value={item.description} onChange={e => onChange(`impact.stats.${index}.description`, e.target.value)} />
                        <button onClick={() => onRemoveItem('impact.stats', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold p-1 leading-none">✕</button>
                    </div>
                ))}
                <button onClick={() => onAddItem('impact.stats', { value: '', label: '', description: '' })} className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-md hover:bg-emerald-200 text-sm">
                    {actions.addStat}
                </button>
            </Fieldset>
        </div>
    );
};

export default ImpactPanel;