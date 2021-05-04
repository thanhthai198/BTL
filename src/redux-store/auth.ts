import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'models/User';

export interface AuthState {
  loading?: boolean;
  user?: User | null;
  token?: string;
}

const initialState: AuthState = {
  loading: false,
  token: '',
  user: null,
};

const authSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<User | null | undefined>) {
      state.user = action.payload;
    },
  },
});

export const { setToken, setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
