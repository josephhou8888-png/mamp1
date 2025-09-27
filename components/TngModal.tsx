import React, { useState, useEffect } from 'react';
import { SpinnerIcon, CheckIcon } from './IconComponents';

interface TngModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    onPaymentSuccess: () => void;
}

const TngModal: React.FC<TngModalProps> = ({ isOpen, onClose, totalAmount, onPaymentSuccess }) => {
    const [status, setStatus] = useState<'qr' | 'processing' | 'successful'>('qr');

    useEffect(() => {
        if (isOpen) {
            // Reset status when modal opens
            setStatus('qr');

            // Simulate the payment process
            const processingTimer = setTimeout(() => {
                setStatus('processing');
            }, 3000); // Wait 3 seconds before showing 'processing'

            const successTimer = setTimeout(() => {
                setStatus('successful');
            }, 6000); // Wait 6 seconds before showing 'successful'

            const closeTimer = setTimeout(() => {
                onPaymentSuccess();
                onClose();
            }, 8000); // Wait 8 seconds before closing

            return () => {
                clearTimeout(processingTimer);
                clearTimeout(successTimer);
                clearTimeout(closeTimer);
            };
        }
    }, [isOpen, onPaymentSuccess, onClose]);

    if (!isOpen) return null;

    const renderContent = () => {
        switch (status) {
            case 'processing':
                return (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <SpinnerIcon className="w-16 h-16 text-[var(--color-primary)]" />
                        <h3 className="text-2xl font-bold mt-6">Processing Payment...</h3>
                        <p className="text-slate-500 mt-2">Please do not close this window.</p>
                    </div>
                );
            case 'successful':
                return (
                    <div className="text-center flex flex-col items-center justify-center h-full animate-zoom-in">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-16 h-16 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold mt-6 text-green-700">Payment Successful!</h3>
                        <p className="text-slate-500 mt-2">Your purchase has been confirmed.</p>
                    </div>
                );
            case 'qr':
            default:
                return (
                    <>
                        <div className="flex items-center gap-4">
                            <img src="https://www.touchngo.com.my/images/tng-logo.png" alt="Touch 'n Go eWallet" className="h-8"/>
                            <h2 className="text-2xl font-bold text-slate-800">Scan to Pay</h2>
                        </div>
                        <div className="my-6 p-4 border rounded-lg bg-slate-50 flex flex-col items-center">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MampaniPayment" alt="QR Code" className="w-48 h-48 rounded-md" />
                            <p className="mt-4 text-sm text-slate-500">Scan this QR code with your Touch 'n Go eWallet app.</p>
                        </div>
                        <div className="text-center">
                            <p className="text-slate-600">Total Amount</p>
                            <p className="text-4xl font-extrabold text-[#0D1B3A]">${totalAmount.toFixed(2)}</p>
                        </div>
                        <p className="text-xs text-slate-400 mt-6 text-center">This is a sandbox environment. Your payment will be simulated automatically.</p>
                    </>
                );
        }
    };
    
    return (
        <div 
            className={`fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-8 h-96 flex flex-col justify-center">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default TngModal;
