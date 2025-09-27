import React from 'react';
import { TextInput, TextareaInput, Fieldset } from '../AdminFormComponents';

const JoinPanel = ({ data, onChange, adminContent }) => {
    const join = data.join || {};
    const labels = adminContent.labels;

    return (
        <div className="space-y-6">
            <Fieldset legend="Join Section Content">
                <TextInput label={labels.title} value={join.title || ''} onChange={e => onChange('join.title', e.target.value)} />
                <TextareaInput label={labels.subtitle} value={join.subtitle || ''} onChange={e => onChange('join.subtitle', e.target.value)} />
                <TextInput label={labels.buttonText} value={join.button || ''} onChange={e => onChange('join.button', e.target.value)} />
            </Fieldset>
        </div>
    );
};

export default JoinPanel;