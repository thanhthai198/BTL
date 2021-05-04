import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as ProductService from 'services/product';
import { RootState } from './store';

export const getItemCategory = createAsyncThunk(
  'Product/getItemCategory',
  async (data, thunkAPI) => {
    try {
      const result = await ProductService.getItemCategory();
      const productByCategory = {};
      result.data.forEach((item: any) => {
        productByCategory[item.id] = {
          page: 0,
          listPage: [],
          data: [],
        };
      });
      return {
        categories: result.data,
        productByCategory,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);
export const getItemPrice = createAsyncThunk(
  'Product/getItemPrice',
  async (data: any, thunkAPI) => {
    try {
      const result = await ProductService.getItemPrice(data);
      return result.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const getRecommendedItems = createAsyncThunk(
  'Product/getRecommendedItems',
  async (data: any, thunkAPI) => {
    try {
      const result = await ProductService.getRecommendedItems(data);
      return result.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const getItemPromotions = createAsyncThunk(
  'Product/getItemPromotions',
  async (data: any, thunkAPI) => {
    try {
      const result = await ProductService.getItemPromotions(data);
      console.log(result);
      return result.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const getTrendingItems = createAsyncThunk(
  'Product/getTrendingItems',
  async (data: any, thunkAPI) => {
    try {
      const result = await ProductService.getTrendingItems(data);

      console.log(result);
      return result.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const getItemByCategory = createAsyncThunk(
  'Product/getItemByCategory',
  async (data: any, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const page = state.product.productByCategory[data.id].page + 1;
      const params = {
        page_size: 10,
        id: data.id,
        page,
      };
      console.log('params', params);
      const result = await ProductService.getItemByCategory(params);
      console.log(result.data);
      return result.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  },
  {
    condition: (data, thunkAPI) => {
      const state = thunkAPI.getState() as RootState;
      console.log('state', state.product);
      if (state.product.loading) {
        console.log('object');
        return false;
      }
      const listPage = state.product.productByCategory[data.id].listPage;
      const page = state.product.productByCategory[data.id].page + 1;
      console.log(listPage, page);
      if (listPage.length > 0 && !listPage.includes(page)) {
        return false;
      }
    },
  }
);

export interface ProductState {
  loading?: boolean;
  loadingCategory?: boolean;
  loadingRecommended?: boolean;
  loadingTrending?: boolean;
  loadingPromotions?: boolean;
  error?: {
    title: string;
    message: string;
  } | null;
  categories: any;
  productByCategory: {
    [key: string]: any;
  };
  newProducts: any;
  recommendedProducts: any;
  trendingProducts: any;
  recentViews: any;
  promotionsProducts: any;
}

const initialState: ProductState = {
  loading: false,
  error: null,
  categories: [],
  productByCategory: {},
  newProducts: [],
  recommendedProducts: [],
  trendingProducts: [],
  recentViews: [],
  promotionsProducts: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    appendRecentViews(state, action) {
      const tmp = [...state.recentViews];
      const matched = tmp.find(item => item.id === action.payload?.id);
      if (matched) {
        const matchedIndex = tmp.findIndex(item => item.id === action.payload?.id);
        tmp.splice(matchedIndex, 1);
      }
      tmp.unshift(action.payload);
      state.recentViews = tmp;
    },
  },
  extraReducers: builder => {
    builder.addCase(getItemCategory.pending, state => {
      state.loadingCategory = true;
    });
    builder.addCase(getItemCategory.fulfilled, (state, action) => {
      state.loadingCategory = false;
      state.categories = action.payload.categories;
      state.productByCategory = action.payload.productByCategory;
    });
    builder.addCase(getItemCategory.rejected, state => {
      state.loadingCategory = false;
    });

    builder.addCase(getItemPrice.pending, state => {
      state.loading = true;
    });
    builder.addCase(getItemPrice.fulfilled, (state, action) => {
      state.loading = false;
      state.newProducts = action.payload;
    });
    builder.addCase(getItemPrice.rejected, state => {
      state.loading = false;
    });

    builder.addCase(getRecommendedItems.pending, state => {
      state.loadingRecommended = true;
    });
    builder.addCase(getRecommendedItems.fulfilled, (state, action) => {
      state.loadingRecommended = false;
      state.recommendedProducts = action.payload.data;
    });
    builder.addCase(getRecommendedItems.rejected, state => {
      state.loadingRecommended = false;
    });

    builder.addCase(getItemPromotions.pending, state => {
      state.loadingPromotions = true;
    });
    builder.addCase(getItemPromotions.fulfilled, (state, action) => {
      state.loadingPromotions = false;
      state.promotionsProducts = action.payload;
    });
    builder.addCase(getItemPromotions.rejected, state => {
      state.loadingPromotions = false;
    });

    builder.addCase(getTrendingItems.pending, state => {
      state.loadingTrending = true;
    });
    builder.addCase(getTrendingItems.fulfilled, (state, action) => {
      state.loadingTrending = false;
      state.trendingProducts = action.payload.data;
    });
    builder.addCase(getTrendingItems.rejected, state => {
      state.loadingTrending = false;
    });

    builder.addCase(getItemByCategory.pending, state => {
      state.loading = true;
    });
    builder.addCase(getItemByCategory.fulfilled, (state, action) => {
      console.log('action', action);
      state.loading = false;
      state.productByCategory = {
        ...state.productByCategory,
        [action.meta.arg.id]: {
          page: parseInt(action.payload.page, 10),
          listPage: action.payload.list_page,
          data: [...state.productByCategory[action.meta.arg.id].data, ...action.payload.data],
        },
      };
    });
    builder.addCase(getItemByCategory.rejected, state => {
      state.loading = false;
    });
  },
});

export const { appendRecentViews } = productSlice.actions;
export default productSlice.reducer;
