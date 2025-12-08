import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartContextType, CartItem, MenuItem } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calculate cart total whenever cart changes
  const cartTotal = cart.reduce((total, item) => total + item.totalPrice, 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const addToCart = (menuItem: MenuItem, quantity: number, selectedModifiers: Record<string, string[]>, notes: string) => {
    // Calculate total price for this specific configuration
    let itemTotal = menuItem.basePrice;
    
    menuItem.modifierGroups.forEach(group => {
      const selectedOptionIds = selectedModifiers[group.id] || [];
      selectedOptionIds.forEach(optId => {
        const option = group.options.find(o => o.id === optId);
        if (option) {
          itemTotal += option.priceDelta;
        }
      });
    });

    itemTotal = itemTotal * quantity;

    const newItem: CartItem = {
      cartId: Math.random().toString(36).substr(2, 9),
      menuItem,
      quantity,
      selectedModifiers,
      totalPrice: itemTotal,
      notes
    };

    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true); // Open drawer on add
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        // Recalculate price
        const unitPrice = item.totalPrice / item.quantity;
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: unitPrice * newQuantity
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};