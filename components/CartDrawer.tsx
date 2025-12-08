
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useConfig } from '../contexts/ConfigContext';
import { MenuItem } from '../types';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { translations, language } = useConfig();
  const t = translations;

  // Helper to get selected option names
  const getModifierNames = (item: MenuItem, modifiers: Record<string, string[]>) => {
    const names: string[] = [];
    item.modifierGroups.forEach(group => {
      const selectedIds = modifiers[group.id] || [];
      selectedIds.forEach(id => {
        const option = group.options.find(o => o.id === id);
        if (option) names.push(option.name[language]);
      });
    });
    return names;
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: language === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: language === 'ar' ? '-100%' : '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed inset-y-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-full sm:w-[450px] bg-white dark:bg-zinc-950 shadow-2xl z-[70] flex flex-col border-l border-white/10`}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="bg-gold-500/10 p-2 rounded-lg text-gold-600 dark:text-gold-500">
                    <ShoppingBag className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Receipt</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-zinc-700" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.cartEmpty[language]}</h3>
                    <p className="text-sm text-gray-500">{t.cartEmptySub[language]}</p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.cartId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/50"
                  >
                    {/* Tiny Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.menuItem.image} className="w-full h-full object-cover" alt="" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-900 dark:text-white truncate pr-2">
                                {item.menuItem.name[language]}
                            </h4>
                            <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                {item.totalPrice.toLocaleString()} {t.currency[language]}
                            </span>
                        </div>
                        
                        {/* Customizations List */}
                        <div className="flex flex-wrap gap-1 mb-3">
                            {getModifierNames(item.menuItem, item.selectedModifiers).map((mod, i) => (
                                <span key={i} className="text-[10px] bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded text-gray-500 border border-gray-100 dark:border-zinc-700">
                                    {mod}
                                </span>
                            ))}
                            {item.notes && (
                                <span className="text-[10px] bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-100 dark:border-yellow-900/30 italic">
                                    "{item.notes}"
                                </span>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-lg p-1 shadow-sm">
                                <button 
                                    onClick={() => item.quantity > 1 ? updateQuantity(item.cartId, -1) : removeFromCart(item.cartId)}
                                    className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                                >
                                    {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3 text-gray-600 dark:text-gray-300" />}
                                </button>
                                <span className="text-sm font-bold w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.cartId, 1)}
                                    className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                                >
                                    <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>
                        </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
                <div className="p-6 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">{t.total[language]}</span>
                        <span className="text-2xl font-black text-gray-900 dark:text-white">
                            {cartTotal.toLocaleString()} {t.currency[language]}
                        </span>
                    </div>
                    <button className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-gold-500/20 transition-all active:scale-[0.98]">
                        {t.checkout[language]}
                    </button>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
