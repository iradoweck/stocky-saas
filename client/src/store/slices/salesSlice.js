import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  total: 0,
  discount: 0,
  tax: 0,
  loading: false,
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.cart.find(item => item.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.productId !== action.payload);
    },
    updateCartItem: (state, action) => {
      const item = state.cart.find(i => i.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    setTax: (state, action) => {
      state.tax = action.payload;
    },
    clearCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.discount = 0;
      state.tax = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateCartItem, setDiscount, setTax, clearCart } = salesSlice.actions;
export default salesSlice.reducer;
