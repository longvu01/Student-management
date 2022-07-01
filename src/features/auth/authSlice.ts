import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { User } from 'models/user';

export interface LoginPayload extends User {
  password?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  isLogging?: boolean;
  currentUser?: User;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isLogging: false,
  currentUser: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, actions: PayloadAction<LoginPayload>) {
      state.isLogging = true;
    },
    loginSuccess(state, actions: PayloadAction<User>) {
      state.currentUser = actions.payload;
      state.isLoggedIn = true;
      state.isLogging = false;
    },
    loginFailed(state, actions: PayloadAction<string>) {
      state.isLogging = false;
    },

    logout(state) {
      state.currentUser = undefined;
      state.isLoggedIn = false;
    },
  },
});

// Actions
export const authActions = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth?.currentUser;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectIsLogging = (state: RootState) => state.auth.isLogging;

// Reducer
const authReducer = authSlice.reducer;
export default authReducer;
