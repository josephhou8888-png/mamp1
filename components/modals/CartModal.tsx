import React from 'react';
import { CloseIcon } from '../IconComponents';
import { useAuth } from '../../contexts/AuthContext';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
    content: any;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout, content }) => {
    const { currentUser, handleRemoveFromCart } = useAuth();
    const cartItems = currentUser?.cart || [];
    
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const pointsEarned = cartItems.reduce((sum, item) => sum + (item.points || 0), 0);

    return (
        <div 
            className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
            onClick={onClose}
        >
            <div 
                className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-lg flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                    <h2 className="text-2xl font-sans font-bold text-[var(--color-text)]">{content?.title || 'Your Cart'}</h2>
                    <button onClick={onClose} aria-label="Close cart"><CloseIcon /></button>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    {cartItems.length === 0 ? (
                        <p className="text-center text-slate-500 py-12">{content?.empty || 'Your cart is empty.'}</p>
                    ) : (
                        <ul className="space-y-4">
                            {cartItems.map((item, index) => (
                                <li key={`${item.id}-${index}`} className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800">{item.name}</p>
                                        <p className="text-sm text-slate-500">${item.price.toFixed(2)}</p>
                                    </div>
                                    <p className="font-semibold text-slate-800">${item.price.toFixed(2)}</p>
                                    <button onClick={() => handleRemoveFromCart(index)} className="text-red-500 hover:text-red-700 p-1">&times;</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <footer className="p-6 border-t border-[var(--color-border)] space-y-4">
                        <div className="flex justify-between font-semibold text-lg">
                            <span>{content?.subtotal || 'Subtotal'}</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600 font-medium">
                            <span>{content?.pointsEarned || 'Points Earned'}</span>
                            <span>+{pointsEarned} {content?.points || 'Points'}</span>
                        </div>
                        <button 
                            onClick={onCheckout}
                            className="w-full text-lg font-semibold px-8 py-3 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors duration-300"
                        >
                            {content?.checkout || 'Proceed to Checkout'}
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default CartModal;