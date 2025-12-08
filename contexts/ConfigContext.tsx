
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, Language, Theme, Table } from '../types';
import { TRANSLATIONS, MOCK_TABLES } from '../constants';

const ConfigContext = createContext<AppContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES);

  useEffect(() => {
    // Apply theme class to html element
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Update direction and lang attribute
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Update font family based on language
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-arabic');
    }
  }, [language]);

  const addTable = (table: Table) => {
    setTables(prev => [...prev, table]);
  };

  const removeTable = (id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
  };

  const updateTableStatus = (id: string, isOccupied: boolean) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, isOccupied } : t));
  };

  return (
    <ConfigContext.Provider value={{
      language,
      setLanguage,
      theme,
      setTheme,
      translations: TRANSLATIONS,
      tables,
      addTable,
      removeTable,
      updateTableStatus
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
};
