import React from 'react';

interface EditModeBarProps {
    onSave: () => void;
    onExit: () => void;
    isSaving: boolean;
}

const EditModeBar: React.FC<EditModeBarProps> = ({ onSave, onExit, isSaving }) => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-slate-800 text-white p-4 z-[9999] shadow-lg flex items-center justify-center gap-6 animate-slide-up-fade-in">
            <p className="text-lg font-semibold flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                You are in Edit Mode
            </p>
            <div className="flex gap-4">
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-emerald-600 rounded-md font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                    onClick={onExit}
                    className="px-6 py-2 bg-slate-600 rounded-md font-bold hover:bg-slate-700 transition-colors"
                >
                    Exit Edit Mode
                </button>
            </div>
        </div>
    );
};

export default EditModeBar;
