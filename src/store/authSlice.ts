import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/compat/app';

export interface AuthResultState {
  value: firebase.auth.UserCredential | null;
}

const initialState: AuthResultState = {
  value: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthResult: (state, action: PayloadAction<firebase.auth.UserCredential>) => {
      state.value = action.payload;
    },
    clearAuthResult: (state) => {
      state.value = null;
    },
  },
});
export const { setAuthResult, clearAuthResult } = authSlice.actions;
export default authSlice.reducer;
