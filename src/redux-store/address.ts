import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as AddressService from 'services/address';

export const getProvince = createAsyncThunk('Address/getProvince', async (data, thunkAPI) => {
  try {
    const result = await AddressService.getProvince();
    const mapProvince = result.data.map((province: any) => {
      return {
        label: province.name,
        value: province.id,
      };
    });
    return mapProvince;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const getDistrict = createAsyncThunk(
  'Address/getDistrict',
  async (data: number, thunkAPI) => {
    try {
      const result = await AddressService.getDistrict(data);
      const mapDistrict = result.data.map((district: any) => {
        return {
          label: district.name,
          value: district.id,
        };
      });
      return mapDistrict;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const getWard = createAsyncThunk('Address/getWard', async (data: number, thunkAPI) => {
  try {
    const result = await AddressService.getWard(data);
    const mapWard = result.data.map((ward: any) => {
      return {
        label: ward.name,
        value: ward.id,
      };
    });
    return mapWard;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const getAllAddress = createAsyncThunk('Address/getAddress', async (data, thunkAPI) => {
  try {
    const result = await AddressService.getAllAddress();
    return result.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export interface AddressState {
  loading?: boolean;
  error?: {
    title: string;
    message: string;
  } | null;
  addressList: any[];
  province?: any[];
  district?: any[];
  ward?: any[];
}

const initialState: AddressState = {
  loading: false,
  error: null,
  addressList: [],
  province: [],
  district: [],
  ward: [],
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllAddress.pending, state => {
      state.loading = true;
    });
    builder.addCase(getAllAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.addressList = action.payload;
    });
    builder.addCase(getAllAddress.rejected, state => {
      state.loading = false;
    });

    builder.addCase(getProvince.pending, state => {
      state.loading = true;
    });
    builder.addCase(getProvince.fulfilled, (state, action) => {
      state.loading = false;
      state.province = action.payload;
    });
    builder.addCase(getProvince.rejected, state => {
      state.loading = false;
    });

    builder.addCase(getDistrict.pending, state => {
      state.loading = true;
    });
    builder.addCase(getDistrict.fulfilled, (state, action) => {
      state.loading = false;
      state.district = action.payload;
    });
    builder.addCase(getDistrict.rejected, state => {
      state.loading = false;
    });

    builder.addCase(getWard.pending, state => {
      state.loading = true;
    });
    builder.addCase(getWard.fulfilled, (state, action) => {
      state.loading = false;
      state.ward = action.payload;
    });
    builder.addCase(getWard.rejected, state => {
      state.loading = false;
    });
  },
});

export default addressSlice.reducer;
