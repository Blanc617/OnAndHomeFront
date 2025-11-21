import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = action.payload.reduce(
        (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity,
        0
      );
    },
    addCartItem: (state, action) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.product.id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity,
        0
      );
    },
    updateCartItem: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === cartItemId);
      
      if (item) {
        item.quantity = quantity;
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity,
          0
        );
      }
    },
    removeCartItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
