import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [bundleSuggestion, setBundleSuggestion] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await cartAPI.get();
      setItems(res.data.items || []);
      setBundleSuggestion(res.data.bundleSuggestion || null);
      setSubtotal(res.data.subtotal || 0);
    } catch (e) {
      console.error('Fetch cart error:', e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, size, color, quantity = 1) => {
    try {
      const res = await cartAPI.add({ productId, size, color, quantity });
      if (res.data.cart) {
        await fetchCart();
      }
      return res.data;
    } catch (e) {
      throw e.response?.data || e;
    }
  };

  const updateItem = async (itemId, quantity) => {
    await cartAPI.update(itemId, { quantity });
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    await cartAPI.remove(itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setItems([]);
    setBundleSuggestion(null);
    setSubtotal(0);
  };

  const acceptBundle = async () => {
    await cartAPI.acceptBundle();
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{
      items, subtotal, bundleSuggestion, loading,
      addToCart, updateItem, removeItem, clearCart, acceptBundle, fetchCart,
      itemCount: items.reduce((acc, item) => acc + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be inside CartProvider');
  return context;
};
