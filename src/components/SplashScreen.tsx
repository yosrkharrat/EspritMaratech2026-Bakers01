import { useEffect, useState } from 'react';
import rctLogo from '@/assets/rct-logo.png';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Wait for fade out animation
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible && !document.body.classList.contains('splash-visible')) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #fff5f3 100%)'
      }}
    >
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
        {/* Logo with pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <img 
              src={rctLogo} 
              alt="Running Club Tunis" 
              className="w-48 h-48 drop-shadow-2xl"
            />
          </div>
          <img 
            src={rctLogo} 
            alt="Running Club Tunis" 
            className="w-48 h-48 drop-shadow-2xl relative"
          />
        </div>

        {/* App name */}
        <div className="text-center space-y-2">
          <h1 className="font-display font-extrabold text-3xl text-gray-900">
            RCT Connect
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            Running Club Tunis
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex gap-1.5 mt-4">
          <div className="w-2 h-2 rounded-full bg-[#E53935] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#E53935] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#E53935] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
