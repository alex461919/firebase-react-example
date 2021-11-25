import { configureStore, createSerializableStateInvariantMiddleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import authResultReducer from './authSlice';

export const store = configureStore({
  reducer: {
    authResultReducer,
  },
  middleware: [
    createSerializableStateInvariantMiddleware({
      ignoredActions: ['auth/setAuthResult'],
    }),
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export { setAuthResult, clearAuthResult } from './authSlice';
