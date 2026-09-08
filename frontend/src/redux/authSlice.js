import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const { setAuthUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
