import React from 'react';

interface LoadingProps {
  isLoading: boolean;
}

export function Loading({ isLoading }: LoadingProps) {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden" 
         style={{
           background: `linear-gradient(to bottom, 
             #42886A 0%, 
             #BD9F67 50%, 
             #C97C46 100%)`
         }}>
      <div className="text-center p-6 max-w-lg">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2 text-tycoon-cream drop-shadow-[4px_4px_0_rgba(30,58,95,0.8)]">
            GLOBAL<br />
            TRADING<br />
            TYCOON
          </h1>
        </div>
        
        {/* Loading animation */}
        <div className="flex justify-center items-center mt-6 relative">
          <div className="w-24 h-24 rounded-full bg-tycoon-teal flex items-center justify-center relative">
            <div className="w-16 h-16 rounded-full bg-tycoon-cream-light flex items-center justify-center animate-pulse">
              <span className="text-3xl font-bold text-tycoon-navy">$</span>
            </div>
            
            {/* Pulsing border */}
            <div className="absolute inset-0 rounded-full border-4 border-tycoon-orange animate-ping opacity-25"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="mt-8 text-tycoon-cream-light font-bold">
          <p className="text-xl">LOADING
            <span className="inline-block animate-bounce mx-1">.</span>
            <span className="inline-block animate-bounce mx-1" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="inline-block animate-bounce mx-1" style={{ animationDelay: '0.4s' }}>.</span>
          </p>
        </div>
      </div>
    </div>
  );
}