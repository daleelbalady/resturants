
import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Moon, Sun, ShoppingBag, Search, Menu as MenuIcon, Globe, LayoutDashboard } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
    onDashboardClick?: () => void;
    showDashboardLink?: boolean;
    isAdmin?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, onDashboardClick, showDashboardLink, isAdmin }) => {
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
            {/* Main Content */}
            <main className="relative z-10">
                {children}
            </main>

            {/* Footer (Hide on Admin) */}
            {!isAdmin && (
                <footer className="bg-white dark:bg-zinc-900 py-12 mt-20 border-t border-gray-100 dark:border-zinc-800">
                    <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 dark:text-gray-400">
                        <p className="font-medium">© 2024 LuxeMenu. Crafted for Excellence.</p>
                    </div>
                </footer>
            )}
        </div>
    );
};
