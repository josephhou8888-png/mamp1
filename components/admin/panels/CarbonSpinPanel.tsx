import React from 'react';
import { TextInput, ImageUploadInput, Fieldset } from '../AdminFormComponents';

const CarbonSpinPanel = ({ data, onChange, onAddItem, onRemoveItem, adminContent }) => {
    const prizes = data.gamePrizes || [];
    const actions = adminContent.actions;

    const handleNumericChange = (path, value) => {
        const numericValue = parseInt(value, 10);
        onChange(path, isNaN(numericValue) ? 0 : numericValue);
    };

    return (
        <div className="space-y-6">
            <Fieldset legend="CarbonSpin Prizes">
                <p className="text-sm text-slate-500 -mt-2 mb-4">Manage the prizes available in the CarbonSpin game. The 'weight' value influences the chance of winning (a higher number means a higher chance relative to other items). If inventory is 0, the item will not be available to win.</p>
                
                {(prizes).map((prize, index) => (
                    <div key={prize.id || index} className="p-4 border rounded-md my-4 relative space-y-4 bg-white shadow-sm">
                         <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-slate-700 pt-2">Prize {index + 1}</h4>
                            <button onClick={() => onRemoveItem('gamePrizes', index)} className="text-red-500 hover:text-red-700 font-bold p-1 leading-none text-xl">✕</button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput 
                                label="Prize Name" 
                                value={prize.name || ''} 
                                onChange={e => onChange(`gamePrizes.${index}.name`, e.target.value)} 
                            />
                             <ImageUploadInput 
                                label="Prize Image" 
                                value={prize.image || ''} 
                                onChange={e => onChange(`gamePrizes.${index}.image`, e.target.value)} 
                                buttonText={actions.uploadImage} 
                            />
                             <TextInput 
                                label="Inventory Count" 
                                value={prize.inventory !== undefined ? String(prize.inventory) : '0'} 
                                onChange={e => handleNumericChange(`gamePrizes.${index}.inventory`, e.target.value)} 
                                placeholder="e.g., 50"
                             />
                             <TextInput 
                                label="Win Weight" 
                                value={prize.weight !== undefined ? String(prize.weight) : '0'} 
                                onChange={e => handleNumericChange(`gamePrizes.${index}.weight`, e.target.value)} 
                                placeholder="e.g., 20"
                             />
                         </div>
                    </div>
                ))}

                <button 
                    onClick={() => onAddItem('gamePrizes', { id: `prize_${Date.now()}`, name: 'New Prize', image: '', inventory: 10, weight: 10 })} 
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-md hover:bg-emerald-200 text-sm"
                >
                    Add New Prize
                </button>
            </Fieldset>
        </div>
    );
};

export default CarbonSpinPanel;