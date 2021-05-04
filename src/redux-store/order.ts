import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as ProductService from 'services/product';
import * as OrderService from 'services/order';

export const getItemCategory = createAsyncThunk(
  'Product/getItemCategory',
  async (data, thunkAPI) => {
    try {
      const result = await ProductService.getItemCategory();
      return result.data.map((category: any) => {
        return {
          ...category,
          items: category.items?.map((item: any) => ({
            ...item,
            list_price: item.list_price || 30000,
          })),
        };
      });
    } catch (e) {
      return thunkAPI.rejectWithValue(new Error('Đã xảy ra lỗi'));
    }
  }
);

export const getItemPrice = createAsyncThunk('Product/getItemPrice', async (data, thunkAPI) => {
  try {
    const result = await ProductService.getItemPrice();
    return result.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(new Error('Đã xảy ra lỗi'));
  }
});

export const getItemByCategory = createAsyncThunk(
  'Product/getItemByCategory',
  async (data, thunkAPI) => {
    try {
      const result = await ProductService.getItemByCategory();
      return result.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(new Error('Đã xảy ra lỗi'));
    }
  }
);

export const getListOrder = createAsyncThunk(
  'Order/getListOrder',
  async (data: string, thunkAPI) => {
    try {
      const result = await OrderService.getOrderOnline(data);
      console.log('result', result);
      return result.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(new Error('Đã xảy ra lỗi'));
    }
  }
);

export const getOrderDetail = createAsyncThunk(
  'Order/getOrderDetail',
  async (id: string, thunkAPI) => {
    try {
      const result = await OrderService.getOrderOnlineDetail(id);

      return result.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export interface OrderState {
  loading?: boolean;
  error?: {
    title: string;
    message: string;
  } | null;
  cartItems: any;
  order: any[];
  orderDetail: any;
}

const initialState: OrderState = {
  loading: false,
  error: null,
  cartItems: [],
  order: [],
  orderDetail: {},
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addCartItems(state, action: PayloadAction<any>) {
      state.cartItems = action.payload;
    },
    updateQuantityItem(state, action: PayloadAction<any>) {
      const tmp = [...state.cartItems];
      if (tmp[action.payload.index]) {
        if (action.payload.quantity === 0) {
          tmp.splice(action.payload.index, 1);
        } else {
          tmp[action.payload.index].quantity = action.payload.quantity;
        }
        state.cartItems = tmp;
      }
    },
    resetCart(state) {
      state.cartItems = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(getListOrder.pending, state => {
      state.loading = true;
    });
    builder.addCase(getListOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(getListOrder.rejected, state => {
      state.loading = false;
    });

    builder.addCase(getOrderDetail.pending, state => {
      state.loading = true;
    });
    builder.addCase(getOrderDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.orderDetail = action.payload;
    });
    builder.addCase(getOrderDetail.rejected, state => {
      state.loading = false;
    });
  },
});

export const { addCartItems, resetCart, updateQuantityItem } = productSlice.actions;
export default productSlice.reducer;
