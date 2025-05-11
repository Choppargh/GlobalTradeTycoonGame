import React from 'react';

interface LoadingProps {
  isLoading: boolean;
}

export function Loading({ isLoading }: LoadingProps) {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden" 
         style={{
           backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      <div className="text-center p-6 max-w-lg">
        {/* Logo */}
        <div className="mb-10">
          <img src="/images/GTC_Logo.png" alt="Global Trading Tycoon" className="w-80 mx-auto" />
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