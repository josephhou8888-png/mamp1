import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useContent } from '../contexts/ContentContext';
import { SponsorApplication } from '../types/firestore';

const FormInput = ({ label, type, value, onChange, placeholder, required = true }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full mt-1 px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
            min={type === 'number' ? '1' : undefined}
        />
    </div>
);


const SponsorDashboard = ({ content }) => {
    const { currentUser } = useAuth();
    const { applications, handleSponsorApplicationSubmit } = useContent();
    const [productName, setProductName] = useState('');
    const [productImage, setProductImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    const user = currentUser!;
    const sponsorApplications = applications.filter(app => app.sponsorId === user.email);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newApplication: Omit<SponsorApplication, 'id'> = {
            sponsorId: user.email!,
            sponsorCompany: user.companyName!,
            productName,
            productImage,
            quantity: Number(quantity),
            status: 'pending'
        };
        handleSponsorApplicationSubmit(newApplication);
        setProductName('');
        setProductImage('');
        setQuantity(1);
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'approved': return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">{content.approved}</span>;
            case 'rejected': return <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">{content.rejected}</span>;
            default: return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">{content.pending}</span>;
        }
    };

    return (
        <div className="bg-slate-50 max-h-[85vh] overflow-y-auto p-8">
            <h1 className="text-4xl font-extrabold text-[#0D1B3A]">{content.title}</h1>
            <p className="mt-2 text-lg text-slate-600">{content.welcome.replace('{{companyName}}', user.companyName)}</p>
            <p className="text-slate-500">{content.subtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#0D1B3A] mb-4">{content.applyTitle}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormInput label={content.productName} type="text" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g., Reusable Coffee Cup" />
                        <FormInput label={content.productImage} type="text" value={productImage} onChange={e => setProductImage(e.target.value)} placeholder="https://..." />
                        <FormInput label={content.quantity} type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} placeholder="100" />
                        
                        <button type="submit" className="w-full bg-[var(--color-primary)] text-white font-bold py-3 px-4 rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
                            {content.submit}
                        </button>
                    </form>
                </section>

                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#0D1B3A] mb-4">{content.yourProducts}</h2>
                    {sponsorApplications.length > 0 ? (
                        <ul className="space-y-3 max-h-96 overflow-y-auto">
                            {sponsorApplications.map(app => (
                                <li key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <img src={app.productImage} alt={app.productName} className="w-12 h-12 rounded-md object-cover bg-slate-200 flex-shrink-0" />
                                        <div className="truncate">
                                            <p className="font-semibold text-slate-800 truncate">{app.productName}</p>
                                            <p className="text-sm text-slate-500">{app.quantity} units</p>
                                        </div>
                                    </div>
                                    {getStatusChip(app.status)}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 text-center py-8">{content.noProducts}</p>
                    )}
                </section>
            </div>
        </div>
    );
};
export default SponsorDashboard;