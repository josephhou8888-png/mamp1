import React, { useState, useEffect } from 'react';

export const useInView = (ref: React.RefObject<HTMLElement>, options: IntersectionObserverInit = { threshold: 0.1 }) => {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
            }
        }, options);

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [ref, options]);

    return isInView;
};

const Counter = ({ value, startAnimation, duration = 2000, className = '' }: { value: string, startAnimation: boolean, duration?: number, className?: string }) => {
    const [count, setCount] = useState(0);
    const safeValue = String(value || '0');
    const endValue = parseInt(safeValue.replace(/,/g, '').replace(/\+/g, ''), 10);
    const suffix = typeof value === 'string' && value.includes('+') ? '+' : '';


    useEffect(() => {
        if (!startAnimation || isNaN(endValue)) return;

        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentVal = Math.floor(progress * endValue);
            setCount(currentVal);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);

    }, [startAnimation, endValue, duration]);
    
    return <p className={className}>{count.toLocaleString()}{suffix}</p>;
};

export default Counter;