'use client';

import { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const CartContext = createContext();

// Create the provider component
export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  // On initial load, try to get the cart from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('my_wyncell_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      localStorage.removeItem('my_wyncell_cart');
    }
  }, []);

  // When the cart changes, save it to local storage
  useEffect(() => {
    if (cart) {
      localStorage.setItem('my_wyncell_cart', JSON.stringify(cart));
    } else {
      // If cart is null (e.g., after checkout), remove it from storage
      localStorage.removeItem('my_wyncell_cart');
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Create a custom hook to easily use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
