import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingOperations: 0,
  lastSyncTime: null,
  syncInProgress: false,
};

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    setPendingOperations: (state, action) => {
      state.pendingOperations = action.payload;
    },
    setLastSyncTime: (state, action) => {
      state.lastSyncTime = action.payload;
    },
    setSyncInProgress: (state, action) => {
      state.syncInProgress = action.payload;
    },
  },
});

export const { setOnlineStatus, setPendingOperations, setLastSyncTime, setSyncInProgress } = syncSlice.actions;
export default syncSlice.reducer;
