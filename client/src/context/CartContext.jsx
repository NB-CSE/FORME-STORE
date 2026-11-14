import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage for guests, from API for logged-in users
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch { /* ignore */ }
      }
      return;
    }
    try {
      setLoading(true);
      const { data } = await cartAPI.getCart();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addToCart = async (productId, quantity = 1, size, color, productData) => {
    if (!isAuthenticated) {
      // Guest cart — store locally
      const existingIndex = cart.items.findIndex(
        item => (item.product?._id || item.product) === productId && item.size === size && item.color === color
      );

      const newItems = [...cart.items];
      if (existingIndex > -1) {
        newItems[existingIndex].quantity += quantity;
      } else {
        newItems.push({
          _id: Date.now().toString(),
          product: productData || { _id: productId },
          quantity,
          size,
          color
        });
      }
      setCart({ items: newItems });
      toast.success('Added to cart');
      return;
    }

    try {
      const { data } = await cartAPI.addToCart({ productId, quantity, size, color });
      if (data.success) {
        setCart(data.cart);
        toast.success(data.message || 'Added to cart');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) {
      if (quantity <= 0) {
        setCart({ items: cart.items.filter(item => item._id !== itemId) });
      } else {
        setCart({
          items: cart.items.map(item =>
            item._id === itemId ? { ...item, quantity } : item
          )
        });
      }
      return;
    }

    try {
      const { data } = await cartAPI.updateItem(itemId, { quantity });
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) {
      setCart({ items: cart.items.filter(item => item._id !== itemId) });
      toast.success('Removed from cart');
      return;
    }

    try {
      const { data } = await cartAPI.removeItem(itemId);
      if (data.success) {
        setCart(data.cart);
        toast.success(data.message || 'Removed from cart');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      localStorage.removeItem('guestCart');
      return;
    }

    try {
      await cartAPI.clearCart();
      setCart({ items: [] });
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    cartCount,
    cartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
