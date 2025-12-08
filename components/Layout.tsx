import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Moon, Sun, ShoppingBag, Search, Menu as MenuIcon, Globe } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, setTheme, language, setLanguage, translations } = useConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const t = translations;

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => setLanguage(language === 'en' ? 'ar' : 'en');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sticky Header */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-md ${
            isScrolled 
            ? 'bg-white/80 dark:bg-zinc-900/80 shadow-sm py-3' 
            : 'bg-white/30 dark:bg-black/30 py-4 border-b border-white/10 dark:border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            {/* Logo area */}
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-gold-500/20">
                    L
                </div>
                <span className={`text-xl font-bold tracking-tight transition-opacity opacity-100`}>
                    LuxeMenu
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={toggleLanguage}
                    className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                    aria-label="Toggle Language"
                >
                    <span className="font-bold text-sm">{language === 'en' ? 'AR' : 'EN'}</span>
                </button>
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                    aria-label="Toggle Theme"
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <div className="w-px h-6 bg-gray-400/30 dark:bg-zinc-500/30 mx-1"></div>
                <button className="relative p-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg hover:shadow-xl transition-all">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
                </button>
            </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 py-12 mt-20 border-t border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 dark:text-gray-400">
            <p className="font-medium">© 2024 LuxeMenu. Crafted for Excellence.</p>
        </div>
      </footer>
    </div>
  );
};
