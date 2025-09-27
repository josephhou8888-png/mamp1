import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { LeafIcon, SunIcon, WindIcon, WaterDropIcon } from './IconComponents';
import { useToast } from '../contexts/ToastContext';
import { GamePrize } from '../types/firestore';

const Fireworks = () => {
    const particles = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        style: {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            color: `hsl(${Math.random() * 360}, 100%, 70%)`,
            animationDelay: `${Math.random() * 1.0}s`,
        }
    }));

    return (
        <div className="fireworks-container" aria-hidden="true">
            {particles.map(p => <div key={p.id} className="particle" style={p.style}></div>)}
        </div>
    );
};

const FireworksPortal = () => {
    if (typeof document === 'undefined') return null;
    return createPortal(<Fireworks />, document.body);
};

interface CarbonSpinCardProps {
    isFlipped: boolean;
    onFlip: () => void;
    prize: GamePrize | null;
    content: any;
    isHighlighted: boolean;
    IconComponent: React.ComponentType<{ className?: string }>;
}

const CarbonSpinCard: React.FC<CarbonSpinCardProps> = ({ isFlipped, onFlip, prize, content, isHighlighted, IconComponent }) => {
    const hasPrize = prize && typeof prize === 'object' && prize.id;
    // Apply transform and shadow to the container for persistent effect
    const highlightClass = isHighlighted ? 'shadow-[0_0_25px_8px] shadow-amber-400/70 scale-105 z-10' : '';
    const frontBorderClass = isHighlighted ? 'border-[var(--color-primary)]' : 'border-slate-300';
    const backBorderClass = isHighlighted ? 'border-amber-500' : (hasPrize ? 'border-green-500' : 'border-slate-300');

    return (
        <div 
            className={`flip-card w-full h-full ${isFlipped ? 'flipped' : ''} ${highlightClass} transition-all duration-300`}
            onClick={onFlip}
            role="button"
            aria-label={isFlipped ? (hasPrize ? `You won ${prize.name}` : 'Try again') : 'Click to reveal prize'}
        >
            <div className="flip-card-inner">
                <div className={`flip-card-front bg-white border-2 border-dashed ${frontBorderClass} flex items-center justify-center transition-colors duration-300 hover:border-[var(--color-primary)]`}>
                    <IconComponent className="w-12 h-12 text-slate-300" />
                </div>
                <div className={`flip-card-back flex flex-col items-center justify-center text-center p-2 border-2 ${backBorderClass} ${hasPrize ? 'bg-green-100' : 'bg-slate-100'}`}>
                    {hasPrize ? (
                        <>
                            <img src={prize.image} alt={prize.name} className="w-16 h-16 object-cover rounded-full mb-2" />
                            <p className="text-xs font-bold text-green-800">{content.winMessage}</p>
                            <p className="text-sm font-semibold text-slate-800">{prize.name}</p>
                        </>
                    ) : (
                         <p className="font-semibold text-slate-500">{content.tryAgainMessage}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

interface CarbonSpinGameProps {
    userPoints: number;
    onPlay: () => GamePrize | 'cooldown_or_empty' | null;
    content: any;
    prizes: GamePrize[];
}

const CarbonSpinGame: React.FC<CarbonSpinGameProps> = ({ userPoints, onPlay, content, prizes }) => {
    const greenEnergyIcons = [LeafIcon, SunIcon, WindIcon, WaterDropIcon];
    const { showToast } = useToast();

    const generateInitialGrid = () => Array.from({ length: 9 }).map(() => ({
        isFlipped: false,
        prize: null,
        isHighlighted: false,
        IconComponent: greenEnergyIcons[Math.floor(Math.random() * greenEnergyIcons.length)],
    }));

    const [grid, setGrid] = useState(generateInitialGrid);
    const [gameState, setGameState] = useState('ready'); // ready, spinning, revealing, finished
    const [result, setResult] = useState<GamePrize | string | null>(null);
    const [showFireworks, setShowFireworks] = useState(false);
    const [shuffleHighlight, setShuffleHighlight] = useState<number | null>(null);

    const handleCardFlip = (clickedIndex: number) => {
        if (gameState !== 'ready') return;

        if (userPoints < 1) {
            setGameState('finished');
            setResult('no_points');
            return;
        }

        setGameState('spinning');
        const prizeWon = onPlay();
        const isWin = prizeWon && typeof prizeWon === 'object';

        // --- Shuffle Animation ---
        const shuffleDuration = 2000;
        const shuffleIntervalTime = 100;
        const totalShuffles = shuffleDuration / shuffleIntervalTime;
        let shuffleCount = 0;

        const intervalId = setInterval(() => {
            shuffleCount++;
            setShuffleHighlight(Math.floor(Math.random() * 9));

            if (shuffleCount >= totalShuffles) {
                clearInterval(intervalId);
                setShuffleHighlight(null); // Clear shuffle highlight before reveal

                // --- Reveal Logic (after shuffle) ---
                if (isWin) {
                    setGameState('revealing');
                    setShowFireworks(true);

                    const otherAvailablePrizes = prizes
                        .filter(p => p.inventory > 0 && p.id !== (prizeWon as GamePrize).id)
                        .sort((a, b) => a.inventory - b.inventory);

                    let otherPrizeIdx = 0;
                    const finalGrid = grid.map((card, index) => {
                        let finalPrize: any = { name: content.tryAgainMessage, image: '' };
                        if (index === clickedIndex) {
                            finalPrize = prizeWon;
                        } else if (otherAvailablePrizes[otherPrizeIdx]) {
                            finalPrize = otherAvailablePrizes[otherPrizeIdx];
                            otherPrizeIdx++;
                        }
                        return { ...card, isFlipped: true, prize: finalPrize, isHighlighted: index === clickedIndex };
                    });
                    setGrid(finalGrid);

                    setTimeout(() => {
                        setShowFireworks(false);
                        setGameState('finished');
                        setResult(prizeWon);
                    }, 5000);
                } else { // LOSS PATH
                    const newGridLoss = grid.map((card, index) => ({
                        ...card,
                        isFlipped: index === clickedIndex,
                        prize: prizeWon as any,
                    }));
                    setGrid(newGridLoss);

                    setTimeout(() => {
                        setGameState('finished');
                        setResult(prizeWon);
                    }, 600);
                }
            }
        }, shuffleIntervalTime);
    };


    const resetGame = () => {
        setGrid(generateInitialGrid());
        setResult(null);
        setGameState('ready');
    };

    const renderResult = () => {
        if (gameState !== 'finished') return null;

        let title, subtitle, buttonText, buttonAction;

        if (result === 'no_points') {
            title = content.noPointsTitle;
            subtitle = content.noPointsSubtitle;
            buttonText = content.viewStore;
            buttonAction = () => { showToast('Redirecting to the Impact Store...', 'info'); resetGame(); /* Add actual navigation later */ };
        } else if (result === 'cooldown_or_empty' || result === null) {
            title = content.tryAgainMessage;
            subtitle = content.cooldownMessage;
            buttonText = content.playAgain;
            buttonAction = resetGame;
        } else if (typeof result === 'object') {
            title = content.winMessage;
            subtitle = `You've won: ${result.name}! It has been added to your account.`;
            buttonText = content.playAgain;
            buttonAction = resetGame;
        } else {
            // Default case for any other non-win result
             title = "Better Luck Next Time!";
             subtitle = "No prize this time, but more chances await. Purchase products to earn more points!";
             buttonText = content.playAgain;
             buttonAction = resetGame;
        }

        return (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 z-20 animate-fade-in-simple rounded-2xl">
                <h3 className="text-3xl font-bold text-slate-800">{title}</h3>
                
                {typeof result === 'object' && result?.image && (
                    <img src={result.image} alt={result.name} className="w-32 h-32 object-cover rounded-full my-4 border-4 border-[var(--color-primary)] shadow-lg" />
                )}

                <p className="mt-2 text-slate-600 max-w-sm">{subtitle}</p>
                <button
                    onClick={buttonAction}
                    className="mt-6 font-semibold px-6 py-3 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                    {buttonText}
                </button>
            </div>
        );
    };

    return (
        <>
            {showFireworks && <FireworksPortal />}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0D1B3A]">{content.title}</h2>
                        <p className="text-slate-500 mt-1">{content.subtitle}</p>
                    </div>
                    <div className="flex-shrink-0 text-center">
                        <p className="text-3xl font-bold text-slate-800">{userPoints}</p>
                        <p className="text-sm font-medium text-slate-500">Points to Play</p>
                    </div>
                </div>

                <div className="relative">
                    <div className={`grid grid-cols-3 gap-4 aspect-square max-w-lg mx-auto ${gameState !== 'ready' ? 'pointer-events-none' : 'cursor-pointer'}`}>
                        {grid.map((card, index) => (
                            <CarbonSpinCard
                                key={index}
                                isFlipped={card.isFlipped}
                                prize={card.prize}
                                content={content}
                                isHighlighted={card.isHighlighted || (gameState === 'spinning' && shuffleHighlight === index)}
                                IconComponent={card.IconComponent}
                                onFlip={() => handleCardFlip(index)}
                            />
                        ))}
                    </div>
                    {renderResult()}
                </div>
            </div>
        </>
    );
};

export default CarbonSpinGame;