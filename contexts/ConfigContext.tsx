import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, Language, Theme, Table } from '../types';
import { TRANSLATIONS } from '../constants';
import { useTables } from '../hooks/useApi';

// Split contexts
interface AppConfigContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  translations: typeof TRANSLATIONS;
}

interface ShopDataContextType {
  tables: Table[];
  addTable: (table: Table) => Promise<void>;
  removeTable: (id: string) => Promise<void>;
  updateTableStatus: (id: string, isOccupied: boolean) => Promise<void>;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);
const ShopDataContext = createContext<ShopDataContextType | undefined>(undefined);

export const AppConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');

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

  return (
    <AppConfigContext.Provider value={{
      language,
      setLanguage,
      theme,
      setTheme,
      translations: TRANSLATIONS
    }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const ShopDataProvider: React.FC<{ children: ReactNode; shopId?: string }> = ({ children, shopId = 'shop-1' }) => {
  // Fetch tables from API
  const { tables: apiTables, createTable: apiCreateTable, updateTableStatus: apiUpdateTableStatus, deleteTable: apiDeleteTable } = useTables(shopId);
  const [tables, setTables] = useState<Table[]>(apiTables);

  // Update local tables when API tables change
  useEffect(() => {
    setTables(apiTables);
  }, [apiTables]);

  const addTable = async (table: Table) => {
    try {
      await apiCreateTable(table);
    } catch (error) {
      console.error('Failed to add table:', error);
      setTables(prev => [...prev, table]);
    }
  };

  const removeTable = async (id: string) => {
    try {
      await apiDeleteTable(id);
    } catch (error) {
      console.error('Failed to remove table:', error);
      setTables(prev => prev.filter(t => t.id !== id));
    }
  };

  const updateTableStatus = async (id: string, isOccupied: boolean) => {
    try {
      await apiUpdateTableStatus(id, isOccupied);
    } catch (error) {
      console.error('Failed to update table status:', error);
      setTables(prev => prev.map(t => t.id === id ? { ...t, isOccupied } : t));
    }
  };

  return (
    <ShopDataContext.Provider value={{
      tables,
      addTable,
      removeTable,
      updateTableStatus
    }}>
      {children}
    </ShopDataContext.Provider>
  );
};

// Legacy ConfigProvider for backward compatibility (wraps both)
export const ConfigProvider: React.FC<{ children: ReactNode; shopId?: string }> = ({ children, shopId }) => {
  return (
    <AppConfigProvider>
      <ShopDataProvider shopId={shopId}>
        {children}
      </ShopDataProvider>
    </AppConfigProvider>
  );
};

export const useConfig = () => {
  const appConfig = useContext(AppConfigContext);
  const shopData = useContext(ShopDataContext);

  if (!appConfig) {
    throw new Error('useConfig must be used within an AppConfigProvider');
  }

  // Return combined data, with fallback for shop data if missing
  return {
    ...appConfig,
    tables: shopData?.tables || [],
    addTable: shopData?.addTable || (async () => console.warn('ShopDataProvider missing')),
    removeTable: shopData?.removeTable || (async () => console.warn('ShopDataProvider missing')),
    updateTableStatus: shopData?.updateTableStatus || (async () => console.warn('ShopDataProvider missing')),
  };
};
