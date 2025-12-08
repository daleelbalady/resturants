
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus, Utensils, Truck, MapPin, CheckCircle, ChevronLeft, ChevronRight, User, Phone, Home, Users } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useConfig } from '../contexts/ConfigContext';
import { MenuItem, OrderMethod, DeliveryProvider } from '../types';
import { LocationPicker } from './LocationPicker';

const MotionDiv = motion.div as any;

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { translations, language, tables } = useConfig();
  const t = translations;

  // Wizard State
  const [step, setStep] = useState<number>(1); // 1: Cart, 2: Method, 3: Details, 4: Success
  const [method, setMethod] = useState<OrderMethod | null>(null);
  
  // Dine-in Details
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState<number>(2);
  
  // Delivery Details
  const [deliveryProvider, setDeliveryProvider] = useState<DeliveryProvider | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [contactInfo, setContactInfo] = useState({ name: '', phone: '', address: '' });

  // Reset function
  const resetWizard = () => {
    setStep(1);
    setMethod(null);
    setSelectedTableId(null);
    setGuestCount(2);
    setDeliveryProvider(null);
    setLocation(null);
    setContactInfo({ name: '', phone: '', address: '' });
  };

  const closeDrawer = () => {
    setIsCartOpen(false);
    setTimeout(resetWizard, 300); // Reset after close animation
  };

  const handlePlaceOrder = () => {
      // In a real app, this sends data to backend
      const orderData = {
          method,
          items: cart,
          total: cartTotal,
          ...(method === 'dine_in' ? { tableId: selectedTableId, guests: guestCount } : {}),
          ...(method === 'delivery' ? { provider: deliveryProvider, location, contact: contactInfo } : {})
      };
      
      console.log('ORDER PLACED:', JSON.stringify(orderData, null, 2));
      clearCart();
      setStep(4); // Success step
  };

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

  // Step Renders
  const renderCartItems = () => (
    <div className="space-y-6">
       {cart.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-zinc-700" />
                <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.cartEmpty[language]}</h3>
                <p className="text-sm text-gray-500">{t.cartEmptySub[language]}</p>
                </div>
            </div>
        ) : (
            cart.map((item) => (
                <MotionDiv 
                layout
                key={item.cartId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/50"
                >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.menuItem.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-900 dark:text-white truncate pr-2">{item.menuItem.name[language]}</h4>
                        <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">{item.totalPrice.toLocaleString()} {t.currency[language]}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                        {getModifierNames(item.menuItem, item.selectedModifiers).map((mod, i) => (
                            <span key={i} className="text-[10px] bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded text-gray-500 border border-gray-100 dark:border-zinc-700">{mod}</span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-lg p-1 shadow-sm">
                            <button onClick={() => item.quantity > 1 ? updateQuantity(item.cartId, -1) : removeFromCart(item.cartId)} className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors">
                                {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3 text-gray-600 dark:text-gray-300" />}
                            </button>
                            <span className="text-sm font-bold w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartId, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors">
                                <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>
                </div>
                </MotionDiv>
            ))
        )}
    </div>
  );

  const renderMethodSelection = () => (
      <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{t.selectMethod[language]}</h3>
          <button 
            onClick={() => { setMethod('dine_in'); setStep(3); }}
            className="w-full flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 hover:border-gold-500 dark:hover:border-gold-500 bg-white dark:bg-zinc-900 transition-all group"
          >
              <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Utensils className="w-8 h-8" />
              </div>
              <div className="text-left">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t.dineIn[language]}</h4>
                  <p className="text-sm text-gray-500">Book a table & enjoy service</p>
              </div>
          </button>

          <button 
            onClick={() => { setMethod('delivery'); setStep(3); }}
            className="w-full flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 hover:border-gold-500 dark:hover:border-gold-500 bg-white dark:bg-zinc-900 transition-all group"
          >
              <div className="p-4 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                  <Truck className="w-8 h-8" />
              </div>
              <div className="text-left">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t.delivery[language]}</h4>
                  <p className="text-sm text-gray-500">Fast delivery to your doorstep</p>
              </div>
          </button>
      </div>
  );

  const renderDineInDetails = () => (
      <div className="space-y-6">
          {/* Guest Count */}
          <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-2xl">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">{t.guestCount[language]}</h4>
              <div className="flex items-center gap-4">
                  <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm"><Minus className="w-4 h-4" /></button>
                  <span className="text-xl font-bold w-8 text-center">{guestCount}</span>
                  <button onClick={() => setGuestCount(guestCount + 1)} className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm"><Plus className="w-4 h-4" /></button>
              </div>
          </div>

          {/* Table Grid */}
          <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">{t.selectTable[language]}</h4>
              <div className="grid grid-cols-2 gap-3">
                  {tables.map(table => (
                      <button
                        key={table.id}
                        disabled={table.isOccupied}
                        onClick={() => setSelectedTableId(table.id)}
                        className={`
                            p-4 rounded-xl border-2 text-left transition-all
                            ${table.isOccupied 
                                ? 'bg-gray-100 dark:bg-zinc-800 border-transparent opacity-50 cursor-not-allowed' 
                                : selectedTableId === table.id 
                                    ? 'bg-gold-500/10 border-gold-500' 
                                    : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 hover:border-gold-300'}
                        `}
                      >
                          <div className="flex justify-between items-center mb-1">
                              <span className="font-bold">{table.label}</span>
                              <Users className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="text-xs text-gray-500">
                              {table.capacity} {t.capacity[language]} • {table.isOccupied ? t.occupied[language] : t.available[language]}
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderDeliveryDetails = () => (
      <div className="space-y-6">
          {/* Provider Selection */}
          <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">{t.deliveryProvider[language]}</h4>
              <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setDeliveryProvider('restaurant')}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${deliveryProvider === 'restaurant' ? 'border-gold-500 bg-gold-500/10' : 'border-gray-200 dark:border-zinc-800'}`}
                  >
                      {t.restDelivery[language]}
                  </button>
                  <button 
                    onClick={() => setDeliveryProvider('daleel_balady')}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${deliveryProvider === 'daleel_balady' ? 'border-gold-500 bg-gold-500/10' : 'border-gray-200 dark:border-zinc-800'}`}
                  >
                      {t.daleelDelivery[language]}
                  </button>
              </div>
          </div>

          {/* Map */}
          <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" /> {t.pinLocation[language]}
              </h4>
              <LocationPicker onLocationSelect={(lat, lng) => setLocation({ lat, lng })} />
              {location && <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Location set</p>}
          </div>

          {/* Contact Form */}
          <div className="space-y-3">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t.contactInfo[language]}</h4>
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-700">
                  <User className="w-4 h-4 text-gray-400" />
                  <input 
                    placeholder={t.fullName[language]} 
                    className="flex-1 bg-transparent outline-none text-sm"
                    value={contactInfo.name}
                    onChange={e => setContactInfo({...contactInfo, name: e.target.value})}
                  />
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <input 
                    placeholder={t.phoneNumber[language]} 
                    className="flex-1 bg-transparent outline-none text-sm"
                    value={contactInfo.phone}
                    onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
                  />
              </div>
              <div className="flex items-start gap-2 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-700">
                  <Home className="w-4 h-4 text-gray-400 mt-0.5" />
                  <textarea 
                    placeholder={t.addressDetails[language]} 
                    className="flex-1 bg-transparent outline-none text-sm resize-none"
                    rows={2}
                    value={contactInfo.address}
                    onChange={e => setContactInfo({...contactInfo, address: e.target.value})}
                  />
              </div>
          </div>
      </div>
  );

  const renderSuccess = () => (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
          <MotionDiv 
            initial={{ scale: 0 }} animate={{ scale: 1 }} 
            className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
          >
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </MotionDiv>
          <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Order Received!</h3>
              <p className="text-gray-500">Your order #{Math.floor(Math.random() * 1000)} has been sent to the kitchen.</p>
          </div>
          <button onClick={closeDrawer} className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl font-bold">
              Done
          </button>
      </div>
  );

  // Validation
  const canProceed = () => {
      if (step === 1) return cart.length > 0;
      if (step === 2) return method !== null;
      if (step === 3) {
          if (method === 'dine_in') return selectedTableId !== null;
          if (method === 'delivery') return deliveryProvider !== null && location !== null && contactInfo.name && contactInfo.phone && contactInfo.address;
      }
      return true;
  };

  return createPortal(
    <AnimatePresence>
      {isCartOpen && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
          />

          <MotionDiv
            initial={{ x: language === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: language === 'ar' ? '-100%' : '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed inset-y-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-full sm:w-[450px] bg-white dark:bg-zinc-950 shadow-2xl z-[100] flex flex-col border-l border-white/10`}
          >
            {step < 4 && (
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
                             {language === 'ar' ? <ChevronRight className="w-5 h-5"/> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {step === 1 ? 'My Cart' : step === 2 ? 'Order Method' : step === 3 ? 'Details' : 'Summary'}
                    </h2>
                </div>
                <button onClick={closeDrawer} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                {step === 1 && renderCartItems()}
                {step === 2 && renderMethodSelection()}
                {step === 3 && (method === 'dine_in' ? renderDineInDetails() : renderDeliveryDetails())}
                {step === 4 && renderSuccess()}
            </div>

            {step < 4 && cart.length > 0 && (
                <div className="p-6 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">{t.total[language]}</span>
                        <span className="text-2xl font-black text-gray-900 dark:text-white">
                            {cartTotal.toLocaleString()} {t.currency[language]}
                        </span>
                    </div>
                    <button 
                        disabled={!canProceed()}
                        onClick={() => step === 3 ? handlePlaceOrder() : setStep(step + 1)}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98]
                            ${canProceed() 
                                ? 'bg-gold-500 hover:bg-gold-600 text-white shadow-gold-500/20' 
                                : 'bg-gray-300 dark:bg-zinc-800 text-gray-500 cursor-not-allowed'}
                        `}
                    >
                        {step === 3 ? t.placeOrder[language] : t.next[language]}
                    </button>
                </div>
            )}
          </MotionDiv>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
