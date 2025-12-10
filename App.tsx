import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Search, Filter, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { AppConfigProvider, ShopDataProvider, useConfig } from './contexts/ConfigContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { ProviderProvider, useProvider } from './contexts/ProviderContext';
import { Layout } from './components/Layout';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { ShopHeader } from './components/ShopHeader';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MOCK_SHOP } from './constants';
import { MenuItem } from './types';
import { useMenu, useShop } from './hooks/useApi';
import Navbar from './components/navigation/Navbar';
import AuthCallback from './components/AuthCallback';

const MotionButton = motion.button as any;
const MotionDiv = motion.div as any;

// Wrapper component for provider dashboard that gets userId from context
const ProviderDashboardWrapper = () => {
  const { userId } = useProvider();
  return (
    <ShopDataProvider shopId={userId || ''}>
      <AdminDashboard />
    </ShopDataProvider>
  );
};

// ... (FloatingCartButton remains same)

// Helper component to handle routing params and data fetching
const MenuAppWrapper = () => {
  const { slug } = useParams();
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const navigate = useNavigate();

  // If no slug provided, redirect to home
  if (!slug) {
    navigate('/');
    return null;
  }

  return (
    <ShopDataProvider shopId={slug}>
      <CartProvider shopId={slug}>
        {view === 'customer' ? <MenuApp setView={setView} shopId={slug} /> : <AdminDashboard />}

        {/* Helper to go back to customer view from admin */}
        {view === 'admin' && (
          <button
            onClick={() => setView('customer')}
            className="fixed bottom-6 left-6 z-50 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full font-bold shadow-xl"
          >
            ← Back to Menu
          </button>
        )}
      </CartProvider>
    </ShopDataProvider>
  );
};

// ... (MenuApp remains same)

// Main App Component with Routing
function App() {
  const [userData, setUserData] = useState<any>(null);

  // Load user data from localStorage
  useEffect(() => {
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        setUserData(JSON.parse(userDataStr));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  return (
    <AppConfigProvider>
      <div className="min-h-screen bg-white dark:bg-slate-900">
        {/* Navbar */}
        <Navbar user={userData} />

        <Routes>
          {/* Auth callback route */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Provider dashboard routes */}
          <Route path="/provider/:userId/*" element={
            <ProviderProvider>
              <ProviderDashboardWrapper />
            </ProviderProvider>
          } />

          {/* Customer menu view - supports both userId and slug */}
          <Route path="/:slug" element={<MenuAppWrapper />} />

          {/* Home/landing page */}
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
              <UtensilsCrossed className="h-20 w-20 text-orange-500 mb-6" />
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Restaurant Menu App
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                Welcome to the menu management system. Enter a restaurant ID or use the link provided by your restaurant.
              </p>
            </div>
          } />
        </Routes>
      </div>
    </AppConfigProvider>
  );
}

export default App;