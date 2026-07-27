import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Lang, translations, getSubjectKey, getPositionKey, getTeacherPositionKey, CATEGORY_KEYS } from '@/lib/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, fallback?: string) => string;
  translateSubject: (subject: string) => string;
  translatePosition: (position: string) => string;
  translateTeacherPosition: (position: string) => string;
  translateCategory: (categoryKey: string) => string;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'class_connect_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved === 'zh' || saved === 'en') ? saved : 'zh';
    } catch {
      return 'zh';
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState(prev => prev === 'zh' ? 'en' : 'zh');
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    const entry = translations[key];
    if (entry) {
      return entry[lang] || entry['zh'] || fallback || key;
    }
    return fallback || key;
  }, [lang]);

  const translateSubject = useCallback((subject: string): string => {
    const key = getSubjectKey(subject);
    const entry = translations[key];
    if (entry) {
      return entry[lang] || entry['zh'] || subject;
    }
    return subject;
  }, [lang]);

  const translateCategory = useCallback((categoryKey: string): string => {
    const key = CATEGORY_KEYS[categoryKey];
    if (key) {
      const entry = translations[key];
      if (entry) {
        return entry[lang] || entry['zh'] || categoryKey;
      }
    }
    return categoryKey;
  }, [lang]);

  const translatePosition = useCallback((position: string): string => {
    const key = getPositionKey(position);
    const entry = translations[key];
    if (entry) {
      return entry[lang] || entry['zh'] || position;
    }
    return position;
  }, [lang]);

  const translateTeacherPosition = useCallback((position: string): string => {
    const key = getTeacherPositionKey(position);
    const entry = translations[key];
    if (entry) {
      return entry[lang] || entry['zh'] || position;
    }
    return position;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translateSubject, translatePosition, translateTeacherPosition, translateCategory, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

