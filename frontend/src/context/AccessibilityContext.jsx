import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem('sach_large_text') === 'true';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('sach_high_contrast') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sach_large_text', largeText);
    if (largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem('sach_high_contrast', highContrast);
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const toggleLargeText = () => setLargeText(prev => !prev);
  const toggleHighContrast = () => setHighContrast(prev => !prev);

  return (
    <AccessibilityContext.Provider
      value={{
        largeText,
        highContrast,
        toggleLargeText,
        toggleHighContrast
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
