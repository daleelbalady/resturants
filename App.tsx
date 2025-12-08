import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { Layout } from './components/Layout';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { ShopHeader } from './components/ShopHeader';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MOCK_SHOP } from './constants';
import { MenuItem } from './types';
import { useMenu, useShop } from './hooks/useApi';

const MotionButton = motion.button as any;
const MotionDiv = motion.div as any;

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

import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import AuthCallback from './components/AuthCallback';

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
  // We only fetch menu if shop is loaded and has a userId
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

  // Show loading state if data is still being fetched
  if (menuLoading || shopLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-400">
          Loading menu...
        </div>
      </Layout>
    );
  }

  // Show error state if shop data is not available
  if (!shop) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen text-red-500">
          Error: Shop not found or failed to load.
        </div>
      </Layout>
    );
  }

  return (
    <Layout onDashboardClick={() => setView('admin')} showDashboardLink={true}>
      {/* Shop Profile Header */}
      <ShopHeader shop={shop} />

      {/* Search Bar (Floating) */}
      <div className="max-w-xl mx-auto px-4 -mt-16 relative z-20 mb-10">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative group shadow-2xl rounded-full"
        >
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder={t.search[language]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-6 py-4 rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
          />
        </MotionDiv>
      </div>

      {/* Category Filter */}
      <div className="sticky top-[72px] z-30 py-4 bg-gray-50/95 dark:bg-zinc-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-800 mb-8">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2 rtl:space-x-reverse min-w-max px-2">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                            px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border
                            ${activeCategory === cat
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-md scale-105'
                    : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'}
                        `}
              >
                {cat === 'All' ? t.all[language] : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 min-h-[50vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block p-4 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No items found.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-4 text-gold-500 hover:text-gold-600 font-bold"
            >
              Clear Filters
            </button>
          </MotionDiv>
        )}
      </div>

      {/* Interactive Elements */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartDrawer />
      <FloatingCartButton />
    </Layout>
  );
};

// Empty home page component
const HomePage = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
          Welcome to Menu Platform
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Access your shop menu by visiting /your-shop-slug
        </p>
      </div>
    </Layout>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/:slug" element={<MenuAppWrapper />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default App;