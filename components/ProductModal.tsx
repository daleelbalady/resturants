import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, AlertCircle } from 'lucide-react';
import { MenuItem, ModifierGroup, ModifierOption } from '../types';
import { useConfig } from '../contexts/ConfigContext';
import { useCart } from '../contexts/CartContext';

interface ProductModalProps {
  product: MenuItem | null;
  onClose: () => void;
}

const MotionDiv = motion.div as any;

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { translations, language } = useConfig();
  const { addToCart } = useCart();
  const t = translations;

  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset state when product opens
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNotes('');
      setValidationError(null);
      
      // Pre-select defaults
      const defaults: Record<string, string[]> = {};
      product.modifierGroups.forEach(group => {
        if (group.minSelection === 1 && group.maxSelection === 1) {
          const defaultOpt = group.options.find(o => o.isDefault);
          if (defaultOpt) {
            defaults[group.id] = [defaultOpt.id];
          }
        }
      });
      setSelectedModifiers(defaults);
    }
  }, [product]);

  // Calculate dynamic price
  const currentTotal = useMemo(() => {
    if (!product) return 0;
    let total = product.basePrice;
    
    product.modifierGroups.forEach(group => {
      const selectedIds = selectedModifiers[group.id] || [];
      selectedIds.forEach(id => {
        const opt = group.options.find(o => o.id === id);
        if (opt) total += opt.priceDelta;
      });
    });

    return total * quantity;
  }, [product, selectedModifiers, quantity]);

  const toggleOption = (group: ModifierGroup, optionId: string) => {
    setValidationError(null); // Clear errors on interaction
    
    setSelectedModifiers(prev => {
      const current = prev[group.id] || [];
      const isSelected = current.includes(optionId);
      
      if (group.maxSelection === 1) {
        // Radio behavior
        return { ...prev, [group.id]: [optionId] };
      } else {
        // Checkbox behavior
        if (isSelected) {
          return { ...prev, [group.id]: current.filter(id => id !== optionId) };
        } else {
          if (current.length < group.maxSelection) {
            return { ...prev, [group.id]: [...current, optionId] };
          }
          return prev; // Max reached
        }
      }
    });
  };

  const handleAddToOrder = () => {
    if (!product) return;

    // Validate requirements
    for (const group of product.modifierGroups) {
      const selectedCount = (selectedModifiers[group.id] || []).length;
      if (selectedCount < group.minSelection) {
        setValidationError(`Please select at least ${group.minSelection} option(s) for ${group.name[language]}`);
        
        // Scroll to error (simple implementation)
        const el = document.getElementById(`group-${group.id}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    addToCart(product, quantity, selectedModifiers, notes);
    onClose();
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {product && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <MotionDiv
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 top-10 sm:top-20 z-50 bg-gray-50 dark:bg-zinc-900 rounded-t-[2rem] shadow-2xl overflow-hidden flex flex-col max-w-2xl mx-auto border-t border-white/10"
          >
            {/* Header Image */}
            <div className="relative h-48 sm:h-64 flex-shrink-0">
              <img 
                src={product.image} 
                alt={product.name[language]} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-zinc-900 to-transparent" />
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/50 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
              {/* Title & Desc */}
              <div>
                <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name[language]}</h2>
                    <span className="text-xl font-bold text-gold-600 dark:text-gold-500">
                        {product.basePrice} {t.currency[language]}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description[language]}</p>
                {product.calories && (
                    <span className="inline-block mt-2 text-xs font-bold text-gray-400 bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded">
                        {product.calories} kcal
                    </span>
                )}
              </div>

              {/* Modifier Groups */}
              {product.modifierGroups.map(group => (
                <div key={group.id} id={`group-${group.id}`} className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-zinc-800 pb-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {group.name[language]}
                        </h3>
                        {group.description && <p className="text-sm text-gray-500">{group.description[language]}</p>}
                    </div>
                    <div className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-zinc-800 text-gray-500">
                        {group.minSelection > 0 ? t.required[language] : t.optional[language]}
                        {group.maxSelection > 1 && ` (Max ${group.maxSelection})`}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {group.options.map(option => {
                        const isSelected = (selectedModifiers[group.id] || []).includes(option.id);
                        return (
                            <div 
                                key={option.id}
                                onClick={() => toggleOption(group, option.id)}
                                className={`
                                    flex items-center justify-between p-4 rounded-xl cursor-pointer border-2 transition-all duration-200
                                    ${isSelected 
                                        ? 'border-gold-500 bg-gold-500/5 dark:bg-gold-500/10' 
                                        : 'border-transparent bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-5 h-5 rounded-full flex items-center justify-center border
                                        ${isSelected ? 'border-gold-500 bg-gold-500' : 'border-gray-400 dark:border-gray-600'}
                                    `}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className={`font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {option.name[language]}
                                    </span>
                                </div>
                                {option.priceDelta > 0 && (
                                    <span className="text-sm font-semibold text-gray-500">
                                        +{option.priceDelta} {t.currency[language]}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                  </div>
                </div>
              ))}

              {/* Special Instructions */}
              <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.specialInstructions[language]}</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.specialInstructionsPlaceholder[language]}
                    className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                    rows={3}
                  />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 p-4 pb-8 sm:pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                {validationError && (
                    <MotionDiv 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4 text-sm font-medium"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {validationError}
                    </MotionDiv>
                )}
                
                <div className="flex items-center gap-4">
                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-4 bg-gray-100 dark:bg-zinc-800 rounded-xl p-2">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm hover:scale-105 transition-transform"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xl font-bold w-6 text-center text-gray-900 dark:text-white">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm hover:scale-105 transition-transform"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add Button */}
                    <button 
                        onClick={handleAddToOrder}
                        className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black h-14 rounded-xl font-bold text-lg flex items-center justify-between px-6 shadow-lg active:scale-95 transition-all"
                    >
                        <span>{t.addToOrder[language]}</span>
                        <span>{currentTotal.toLocaleString()} {t.currency[language]}</span>
                    </button>
                </div>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};