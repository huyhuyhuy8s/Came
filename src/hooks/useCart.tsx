
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import * as cartService from '@/services/cartService';

// Types
export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options?: string[];
  size?: string;
  selected_option_id?: string;
  selected_size_id?: string;
}

interface CartState {
  items: CartItem[];
  cartId: string | null;
  isLoading: boolean;
}

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  syncCart: () => Promise<void>;
}

// Action types
type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'SET_CART_ID'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Initial state
const initialState: CartState = {
  items: [],
  cartId: null,
  isLoading: false,
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    
    case 'SET_CART_ID':
      return { ...state, cartId: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems };
      }
      
      return { ...state, items: [...state.items, action.payload] };
    }
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
      
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }
      
    case 'CLEAR_CART':
      return { ...state, items: [] };
      
    default:
      return state;
  }
};

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  
  // Load cart when user logs in
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          // Get or create user cart
          const cart = await cartService.getOrCreateUserCart(user.id);
          dispatch({ type: 'SET_CART_ID', payload: cart.id });
          
          // Get cart items
          const items = await cartService.getCartItems(cart.id);
          
          // Transform items to match our CartItem interface
          const transformedItems: CartItem[] = await Promise.all(
            items.map(async (item) => {
              // Fetch product details if needed
              return {
                id: item.id,
                product_id: item.product_id || '',
                name: 'Product Name', // This would come from product details
                price: item.price,
                image: '/placeholder.svg', // This would come from product details
                quantity: item.quantity,
                options: item.options as string[],
                size: item.size || undefined,
                selected_option_id: item.selected_option_id || undefined,
                selected_size_id: item.selected_size_id || undefined,
              };
            })
          );
          
          dispatch({ type: 'SET_ITEMS', payload: transformedItems });
        } catch (error) {
          console.error('Error loading cart:', error);
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        // Load cart from localStorage if not authenticated
        const savedCart = localStorage.getItem('came-cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'SET_ITEMS', payload: parsedCart.items || [] });
        }
      }
    };
    
    loadCart();
  }, [isAuthenticated, user]);
  
  // Save cart to localStorage when it changes (for guest users)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('came-cart', JSON.stringify({ items: state.items }));
    }
  }, [state.items, isAuthenticated]);
  
  // Cart actions
  const addItem = async (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      if (isAuthenticated && user && state.cartId) {
        // Add item to database
        const addedItem = await cartService.addItemToCart({
          cart_id: state.cartId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          options: item.options || [],
          size: item.size || null,
          selected_option_id: item.selected_option_id || null,
          selected_size_id: item.selected_size_id || null,
        });
        
        // Add item to local state
        dispatch({ 
          type: 'ADD_ITEM', 
          payload: { 
            ...item, 
            id: addedItem.id 
          } 
        });
      } else {
        // For guest users, generate a local ID
        const localId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        dispatch({ 
          type: 'ADD_ITEM', 
          payload: { 
            ...item, 
            id: localId 
          } 
        });
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  const removeItem = async (itemId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      if (isAuthenticated && user) {
        // Remove item from database
        await cartService.removeCartItem(itemId);
      }
      
      // Remove item from local state
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    } catch (error) {
      console.error('Error removing item from cart:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  const updateQuantity = async (itemId: string, quantity: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      if (isAuthenticated && user) {
        // Update item in database
        await cartService.updateCartItem(itemId, { quantity });
      }
      
      // Update item in local state
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: itemId, quantity },
      });
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  const clearCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      if (isAuthenticated && user && state.cartId) {
        // Clear cart in database
        await cartService.clearCart(state.cartId);
      }
      
      // Clear local state
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  // Sync local cart with database when user logs in
  const syncCart = async () => {
    if (!isAuthenticated || !user || !state.cartId) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Get local cart items
      const localItems = state.items;
      
      // Clear existing cart in database
      await cartService.clearCart(state.cartId);
      
      // Add each local item to database
      const promises = localItems.map(item => 
        cartService.addItemToCart({
          cart_id: state.cartId!,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          options: item.options || [],
          size: item.size || null,
          selected_option_id: item.selected_option_id || null,
          selected_size_id: item.selected_size_id || null,
        })
      );
      
      await Promise.all(promises);
      
      // Reload cart from database
      const items = await cartService.getCartItems(state.cartId);
      
      // Transform items to match our CartItem interface
      const transformedItems: CartItem[] = await Promise.all(
        items.map(async (item) => {
          // Fetch product details if needed
          return {
            id: item.id,
            product_id: item.product_id || '',
            name: 'Product Name', // This would come from product details
            price: item.price,
            image: '/placeholder.svg', // This would come from product details
            quantity: item.quantity,
            options: item.options as string[],
            size: item.size || undefined,
            selected_option_id: item.selected_option_id || undefined,
            selected_size_id: item.selected_size_id || undefined,
          };
        })
      );
      
      dispatch({ type: 'SET_ITEMS', payload: transformedItems });
    } catch (error) {
      console.error('Error syncing cart:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
