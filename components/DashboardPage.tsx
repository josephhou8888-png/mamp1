import React, { useState } from 'react';
import { GiftIcon, ShoppingCartIcon, Co2Icon, TreeIcon } from './IconComponents';
import CarbonSpinGame from './CarbonSpinGame';
import { useAuth } from '../contexts/AuthContext';
import { useContent } from '../contexts/ContentContext';
import { Product, Reward } from '../types/data';

const ImpactStat = ({ icon, value, unit, label, color }) => (
    <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800">{value} <span className="text-lg font-normal text-slate-500">{unit}</span></p>
            <p className="text-sm font-medium text-slate-500">{label}</p>
        </div>
    </div>
);

const ProgressBar = ({ value, goal, label, color }) => {
    const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <p className="text-xs font-medium text-slate-500">{value.toLocaleString()} / {goal.toLocaleString()}</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                    className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

interface ProductPurchaseCardProps {
    product: Product;
    addToCartText: string;
}

const ProductPurchaseCard: React.FC<ProductPurchaseCardProps> = ({ product, addToCartText }) => {
    const { handleAddToCart } = useAuth();
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col shadow-sm transition-shadow hover:shadow-md">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-xl font-bold text-slate-800">{product.name}</h4>
                <p className="text-sm text-slate-500 mt-2 flex-grow">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-2xl font-extrabold text-[#0D1B3A]">${product.price.toFixed(2)}</p>
                    <button onClick={() => handleAddToCart(product)} className="font-semibold text-sm px-4 py-2 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-2">
                        <ShoppingCartIcon className="w-4 h-4" />
                        {addToCartText}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface RewardCardProps {
    reward: Reward;
    content: any;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, content }) => {
    const { currentUser, handleRedeemReward } = useAuth();
    const userPoints = currentUser?.points || 0;
    const canAfford = userPoints >= reward.cost;
    return (
        <div className={`bg-white p-4 rounded-xl border ${canAfford ? 'border-slate-200' : 'border-slate-100'} flex items-center justify-between gap-4 ${!canAfford && 'opacity-60'}`}>
            <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${canAfford ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                    <GiftIcon className="w-5 h-5" />
                </div>
                <div>
                    <p className={`font-bold text-sm ${canAfford ? 'text-slate-800' : 'text-slate-500'}`}>{reward.title}</p>
                    <p className="text-xs text-slate-500">{reward.cost} {content.points}</p>
                </div>
            </div>
            <button 
                disabled={!canAfford}
                onClick={() => handleRedeemReward(reward)}
                className="font-semibold text-xs px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
                {content.redeem}
            </button>
        </div>
    )
}

const DashboardPage = ({ onCartClick }) => {
    const [activeTab, setActiveTab] = useState('impact');
    const { currentUser, handlePlayCarbonSpin } = useAuth();
    const { content } = useContent();

    const { products, rewards, dashboardPage, dashboard: dashboardContent, gamePrizes } = content;
    const user = currentUser!;
    const cartItemCount = user.cart?.length || 0;

    return (
        <div className="bg-slate-50 max-h-[85vh] overflow-y-auto">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0D1B3A]">{dashboardPage.title.replace('{{name}}', user.name || '')}</h1>
                        <p className="mt-2 text-lg text-slate-600">{dashboardPage.subtitle.replace('{{name}}', user.name || '')}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button onClick={onCartClick} className="relative text-slate-600 hover:text-[var(--color-primary)] p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-100 transition-colors" aria-label={`Open cart with ${cartItemCount} items`}>
                            <ShoppingCartIcon />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-xs font-bold">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2">
                        <div className="flex border-b border-slate-200 mb-8">
                             <button onClick={() => setActiveTab('impact')} className={`px-4 py-2 font-semibold text-lg transition-colors duration-200 ${activeTab === 'impact' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-slate-500 hover:text-slate-800'}`}>
                                {dashboardPage.impactTab}
                            </button>
                             <button onClick={() => setActiveTab('rewards')} className={`px-4 py-2 font-semibold text-lg transition-colors duration-200 ${activeTab === 'rewards' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-slate-500 hover:text-slate-800'}`}>
                               {dashboardPage.rewardsTab}
                            </button>
                        </div>
                        
                        <div className="animate-fade-in">
                            {activeTab === 'impact' && (
                                <section>
                                    <h2 className="text-3xl font-bold text-[#0D1B3A] mb-6">{dashboardPage.products.title}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {(products || []).map((p: Product) => <ProductPurchaseCard key={p.id} product={p} addToCartText={dashboardPage.projects.addToCart} />)}
                                    </div>
                                </section>
                            )}
                             {activeTab === 'rewards' && (
                                <div className="space-y-8">
                                    <section>
                                        <CarbonSpinGame
                                            userPoints={user.points || 0}
                                            onPlay={handlePlayCarbonSpin}
                                            content={dashboardPage.carbonSpin}
                                            prizes={gamePrizes}
                                        />
                                    </section>
                                    <section>
                                        <h3 className="text-2xl font-bold text-[#0D1B3A] mb-4">{dashboardPage.rewards.title}</h3>
                                        <div className="space-y-3">
                                            {(rewards || []).map((r: Reward) => <RewardCard key={r.id} reward={r} content={dashboardPage.rewards} />)}
                                        </div>
                                    </section>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <aside className="lg:col-span-1 space-y-8">
                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                            <h3 className="text-xl font-bold text-[#0D1B3A]">{dashboardPage.yourImpact}</h3>
                            <ImpactStat icon={<Co2Icon className="w-6 h-6" />} label={dashboardContent.co2Offset} value={user.impact?.co2Offset || 0} unit={dashboardContent.tonnes} color="bg-blue-100 text-blue-600" />
                            <ImpactStat icon={<TreeIcon className="w-6 h-6" />} label={dashboardContent.planted} value={user.impact?.treesPlanted || 0} unit={dashboardContent.trees} color="bg-green-100 text-green-600" />
                            <ImpactStat icon={<GiftIcon className="w-6 h-6" />} label={dashboardPage.points.label} value={user.points || 0} unit={dashboardPage.points.unit} color="bg-amber-100 text-amber-600" />
                        </section>
                        
                         <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-[#0D1B3A]">{dashboardPage.goals.title}</h3>
                             <ProgressBar value={user.impact?.co2Offset || 0} goal={user.goals?.co2Offset || 1} label={dashboardPage.goals.co2Offset} color="bg-blue-500" />
                             <ProgressBar value={user.impact?.treesPlanted || 0} goal={user.goals?.treesPlanted || 1} label={dashboardPage.goals.treesPlanted} color="bg-green-500" />
                             <p className="text-xs text-slate-400 text-center pt-2">Goal data is for demonstration purposes.</p>
                        </section>
                    </aside>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;