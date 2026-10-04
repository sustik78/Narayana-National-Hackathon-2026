import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import bn from '../locales/bn.json';

const translations = { en, hi, bn };
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sach_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('sach_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[language] || translations.en;
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to english
        let fallback = translations.en;
        for (const fkey of keys) {
          if (fallback && fallback[fkey] !== undefined) {
            fallback = fallback[fkey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
