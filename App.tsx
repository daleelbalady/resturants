import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Search, Filter, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';
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
    <ConfigProvider shopId={userId || ''}>
      <AdminDashboard />
    </ConfigProvider>
  );
};

// Floating Cart Button Component
const FloatingCartButton = () => {
  const { setIsCartOpen, itemCount } = useCart();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <MotionButton
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gray-900 dark:bg-white text-white dark:text-black p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
            {itemCount}
          </span>
        </MotionButton>
      )}
    </AnimatePresence>
  );
};

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
    <ConfigProvider shopId={slug}>
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
    </ConfigProvider>
  );
};

// Inner component to access context
const MenuApp: React.FC<{ setView: (v: 'customer' | 'admin') => void; shopId: string }> = ({ setView, shopId }) => {
  const { translations, language } = useConfig();
  const t = translations;

  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Fetch shop first
  const { shop, loading: shopLoading } = useShop(shopId);

  // Then fetch menu using the shop's user ID (owner ID)
  const { menuItems, loading: menuLoading } = useMenu(shop?.userId);

  // Get unique categories from menu items
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(menuItems.map(item => item.category))];
    return cats;
  }, [menuItems]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return menuItems.filter(product => {
      const searchLower = searchQuery.toLowerCase();
      const nameEn = product.name.en.toLowerCase();
      const nameAr = product.name.ar;

      const matchesSearch = nameEn.includes(searchLower) || nameAr.includes(searchQuery);
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, menuItems]);

  // Show loading state
  if (menuLoading || shopLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-400">
          Loading menu...
        </div>
      </Layout>
    );
  }

  // Main Menu UI
  return (
    <Layout>
      <ShopHeader
        shop={shop || MOCK_SHOP}
        onShowAdmin={() => setView('admin')}
      />

      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`${t.search[language]}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-800 border-none rounded-full focus:ring-2 focus:ring-gold-500 outline-none"
            />
          </div>
          <button className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="max-w-7xl mx-auto mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${activeCategory === category
                ? 'bg-gold-500 text-white'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
            >
              {category === 'All' ? t.all[language] : category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartDrawer />
      <FloatingCartButton />
    </Layout>
  );
};

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
  );
}

export default App;