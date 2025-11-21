import { createSlice } from '@reduxjs/toolkit';
import { setTokens, removeTokens, getUserFromToken } from '../../utils/auth';

const initialState = {
  user: null,
  isLoggedIn: false,
  isAdmin: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      setTokens(accessToken, refreshToken);
      
      const userInfo = getUserFromToken(accessToken);
      state.user = userInfo;
      state.isLoggedIn = true;
      state.isAdmin = userInfo?.role === 'ROLE_ADMIN';
      state.loading = false;
      state.error = null;
      
      // 사용자 정보 저장
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      removeTokens();
      state.user = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
      state.isAdmin = action.payload?.role === 'ROLE_ADMIN';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
