import React from 'react';
import { TextInput, TextareaInput, Fieldset } from '../AdminFormComponents';

const CalculatorPanel = ({ data, onChange, adminContent }) => {
    const calculator = data.carbonCalculator || {};
    const labels = adminContent.labels;

    return (
        <div className="space-y-6">
            <Fieldset legend="Carbon Calculator Section">
                <TextInput label={labels.title} value={calculator.title || ''} onChange={e => onChange('carbonCalculator.title', e.target.value)} />
                <TextareaInput label={labels.subtitle} value={calculator.subtitle || ''} onChange={e => onChange('carbonCalculator.subtitle', e.target.value)} />
            </Fieldset>
        </div>
    );
};

export default CalculatorPanel;