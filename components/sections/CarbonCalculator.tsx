import React, { useState, memo } from 'react';
import { generateContent } from '../../services/geminiService';
import { SpinnerIcon } from '../IconComponents';
import ResultsModal from '../modals/ResultsModal';
import Editable from '../inline-editor/Editable';

interface SliderInputCardProps {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    unit: string;
    min: string;
    max: string;
    step: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
}
const SliderInputCard = ({ icon, title, value, unit, min, max, step, onChange, name }: SliderInputCardProps) => (
    <div className="bg-white p-8 rounded-2xl border border-[var(--color-border)] flex flex-col gap-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
            {icon}
            <h3 className="text-2xl font-sans text-[var(--color-text)]">{title}</h3>
        </div>
        <div className="text-center py-4">
            <p className="text-5xl font-sans font-bold text-[var(--color-primary)]">{value}<span className="text-xl font-sans font-medium text-[var(--color-text-secondary)] ml-2">{unit}</span></p>
        </div>
        <input 
            type="range"
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer custom-slider [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full"
            aria-label={`${title} slider`}
        />
    </div>
);

interface CarbonCalculatorProps {
    content: any;
    onSignUpRedirect: () => void;
    geminiPrompt: string;
    resultsModalContent: any;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
}
const CarbonCalculator = memo(({ content, onSignUpRedirect, geminiPrompt, resultsModalContent, isEditing, onUpdate }: CarbonCalculatorProps) => {
    const [inputs, setInputs] = useState({
        electricity: 100,
        miles: 50,
        shortFlights: 2,
        longFlights: 1,
    });
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    const icons = {
        home: <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg flex items-center justify-center"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>,
        car: <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg flex items-center justify-center"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-5h-5l-2 5h3zM5 16h9l2-5H7l-2 5zm0 0l-2.75-5.5A2 2 0 014.2 8h15.6a2 2 0 011.95 2.5L19 16" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20h2m8 0h2" /></svg></div>,
        plane: <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg flex items-center justify-center"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></div>,
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: parseInt(value, 10) }));
    };

    const handleCalculate = async () => {
        setIsLoading(true);
        setError('');
        
        const { electricity, miles, shortFlights, longFlights } = inputs;
        const country = 'USA';

        const prompt = (geminiPrompt || '')
            .replace('{{electricity}}', String(electricity))
            .replace('{{miles}}', String(miles))
            .replace('{{shortFlights}}', String(shortFlights))
            .replace('{{longFlights}}', String(longFlights))
            .replace('{{country}}', country);

        const schema = {
            type: "OBJECT",
            properties: {
                footprint: { type: "NUMBER" },
                comparison: { type: "STRING" },
                tips: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            title: { type: "STRING" },
                            description: { type: "STRING" }
                        }
                    }
                }
            }
        };

        const config = { responseMimeType: "application/json", responseSchema: schema, thinkingConfig: { thinkingBudget: 0 } };

        try {
            // The service now calls our secure Cloud Function
            const responseText = await generateContent(prompt, null, config);
            const parsedResult = JSON.parse(responseText);
            setResult(parsedResult);
            setIsResultModalOpen(true);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : content?.error || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSignUpClick = () => {
        setIsResultModalOpen(false);
        onSignUpRedirect();
    };

    return (
        <section id="calculator" className="py-20 md:py-32 px-4 bg-slate-50/40 backdrop-blur-sm">
            <div className="container mx-auto text-center">
                <Editable path="carbonCalculator.title" isEditing={isEditing} onUpdate={onUpdate}>
                    <h2 className="text-5xl md:text-6xl font-sans tracking-tight">{content?.title || ''}</h2>
                </Editable>
                <Editable path="carbonCalculator.subtitle" isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                    <p className="mt-6 max-w-3xl mx-auto text-lg">{content?.subtitle || ''}</p>
                </Editable>
                
                <div className="mt-20 max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-left">
                    <SliderInputCard icon={icons.home} title={content?.energyTitle || 'Home Energy'} value={inputs.electricity} unit={content?.energyUnit || 'kWh/month'} min="0" max="500" step="10" name="electricity" onChange={handleSliderChange} />
                    <SliderInputCard icon={icons.car} title={content?.drivingTitle || 'Weekly Driving'} value={inputs.miles} unit={content?.drivingUnit || 'miles'} min="0" max="500" step="10" name="miles" onChange={handleSliderChange} />
                    <SliderInputCard icon={icons.plane} title={content?.shortFlightsTitle || 'Short Flights'} value={inputs.shortFlights} unit={content?.flightsUnit || 'yearly'} min="0" max="20" step="1" name="shortFlights" onChange={handleSliderChange} />
                    <SliderInputCard icon={icons.plane} title={content?.longFlightsTitle || 'Long Flights'} value={inputs.longFlights} unit={content?.flightsUnit || 'yearly'} min="0" max="10" step="1" name="longFlights" onChange={handleSliderChange} />
                </div>
                
                <div className="mt-16">
                    <button onClick={handleCalculate} disabled={isLoading} className="text-base font-semibold px-10 py-4 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mx-auto transform hover:scale-105">
                        {isLoading ? (
                            <>
                                <SpinnerIcon className="w-5 h-5 mr-3" />
                                <span>{content?.calculating || 'Calculating...'}</span>
                            </>
                        ) : (
                            content?.button || 'Calculate Footprint'
                        )}
                    </button>
                </div>

                {error && <p className="mt-6 text-red-500">{error}</p>}
                
                <ResultsModal isOpen={isResultModalOpen} onClose={() => setIsResultModalOpen(false)} result={result} onSignUpClick={handleSignUpClick} content={resultsModalContent} errorText={content?.error || 'Could not calculate results.'}/>
            </div>
        </section>
    );
});

CarbonCalculator.displayName = 'CarbonCalculator';

export default CarbonCalculator;