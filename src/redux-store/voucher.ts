import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as VoucherService from 'services/voucher';

export const getAllVoucher = createAsyncThunk('Voucher/getVoucher', async (data, thunkAPI) => {
  try {
    const result = await VoucherService.getAllVoucher();
    return result.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export interface VoucherState {
  loading?: boolean;
  error?: {
    title: string;
    message: string;
  } | null;
  voucherList: any[];
}

const initialState: VoucherState = {
  loading: false,
  error: null,
  voucherList: [],
};

const voucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllVoucher.pending, state => {
      state.loading = true;
    });
    builder.addCase(getAllVoucher.fulfilled, (state, action) => {
      state.loading = false;
      state.voucherList = action.payload;
    });
    builder.addCase(getAllVoucher.rejected, state => {
      state.loading = false;
    });
  },
});

export default voucherSlice.reducer;
