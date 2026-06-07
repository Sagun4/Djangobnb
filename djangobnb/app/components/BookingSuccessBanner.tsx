'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const BookingSuccessBanner = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (searchParams.get('booking_success') === 'true') {
            setIsVisible(true);
            // Auto-dismiss after 5 seconds
            const timer = setTimeout(() => {
                dismiss();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    const dismiss = () => {
        setIsVisible(false);
        // Clean up the URL query parameters
        router.replace('/');
    };

    if (!isVisible) return null;

    return (
        <div className="mb-6 p-4 bg-emerald-500 text-white rounded-xl flex items-center justify-between shadow-md transition-all duration-300 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Your booking was successful!</span>
            </div>
            <button 
                onClick={dismiss} 
                className="hover:bg-emerald-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Dismiss message"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default BookingSuccessBanner;
