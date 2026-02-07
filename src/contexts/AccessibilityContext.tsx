import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'x-large';
  setFontSize: (size: 'normal' | 'large' | 'x-large') => void;
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'x-large'>('normal');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Load preferences from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('rct_high_contrast') === 'true';
    const savedFontSize = localStorage.getItem('rct_font_size') as 'normal' | 'large' | 'x-large' || 'normal';
    const savedReduceMotion = localStorage.getItem('rct_reduce_motion') === 'true';

    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);
    setReduceMotion(savedReduceMotion);

    // Also check system preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && !savedReduceMotion) {
      setReduceMotion(true);
    }
  }, []);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;

    // High contrast mode
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.classList.remove('font-normal', 'font-large', 'font-x-large');
    root.classList.add(`font-${fontSize}`);

    // Reduced motion
    if (reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [highContrast, fontSize, reduceMotion]);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('rct_high_contrast', String(newValue));
    announceToScreenReader(
      newValue ? 'Mode contraste élevé activé' : 'Mode contraste élevé désactivé'
    );
  };

  const updateFontSize = (size: 'normal' | 'large' | 'x-large') => {
    setFontSize(size);
    localStorage.setItem('rct_font_size', size);
    const sizeLabels = { normal: 'normale', large: 'grande', 'x-large': 'très grande' };
    announceToScreenReader(`Taille de police : ${sizeLabels[size]}`);
  };

  const toggleReduceMotion = () => {
    const newValue = !reduceMotion;
    setReduceMotion(newValue);
    localStorage.setItem('rct_reduce_motion', String(newValue));
    announceToScreenReader(
      newValue ? 'Réduction des animations activée' : 'Réduction des animations désactivée'
    );
  };

  const announceToScreenReader = (message: string) => {
    setAnnouncement(message);
    // Clear after announcement is made
    setTimeout(() => setAnnouncement(''), 1000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        fontSize,
        setFontSize: updateFontSize,
        reduceMotion,
        toggleReduceMotion,
        announceToScreenReader,
      }}
    >
      {children}
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
