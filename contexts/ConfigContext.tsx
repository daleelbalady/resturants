import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, Language, Theme, Table } from '../types';
import { TRANSLATIONS } from '../constants';
import { useTables } from '../hooks/useApi';

const ConfigContext = createContext<AppContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode; shopId?: string }> = ({ children, shopId = 'shop-1' }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');

  // Fetch tables from API
  const { tables: apiTables, createTable: apiCreateTable, updateTableStatus: apiUpdateTableStatus, deleteTable: apiDeleteTable } = useTables(shopId);
  const [tables, setTables] = useState<Table[]>(apiTables);

  // Update local tables when API tables change
  useEffect(() => {
    setTables(apiTables);
  }, [apiTables]);

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

  const addTable = async (table: Table) => {
    try {
      await apiCreateTable(table);
      // Tables will be updated via useEffect when apiTables changes
    } catch (error) {
      console.error('Failed to add table:', error);
      // Fallback to local state if API fails
      setTables(prev => [...prev, table]);
    }
  };

  const removeTable = async (id: string) => {
    try {
      await apiDeleteTable(id);
      // Tables will be updated via useEffect when apiTables changes
    } catch (error) {
      console.error('Failed to remove table:', error);
      // Fallback to local state if API fails
      setTables(prev => prev.filter(t => t.id !== id));
    }
  };

  const updateTableStatus = async (id: string, isOccupied: boolean) => {
    try {
      await apiUpdateTableStatus(id, isOccupied);
      // Tables will be updated via useEffect when apiTables changes
    } catch (error) {
      console.error('Failed to update table status:', error);
      // Fallback to local state if API fails
      setTables(prev => prev.map(t => t.id === id ? { ...t, isOccupied } : t));
    }
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
