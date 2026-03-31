import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
  },
});

export const { setOrders, setLoading, setError, addOrder } = purchasesSlice.actions;
export default purchasesSlice.reducer;
