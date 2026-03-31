import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  debtors: [],
  loading: false,
};

const debtorsSlice = createSlice({
  name: 'debtors',
  initialState,
  reducers: {
    setDebtors: (state, action) => {
      state.debtors = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setDebtors, setLoading } = debtorsSlice.actions;
export default debtorsSlice.reducer;
