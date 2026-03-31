import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  loading: false,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setCustomers, setLoading } = customersSlice.actions;
export default customersSlice.reducer;
