import request from 'utils/request';
import {
  ENDPOINT_FILTER_PRODUCT,
  ENDPOINT_ITEM_CATEGORY,
  ENDPOINT_ITEM_PRICE,
  ENDPOINT_ITEM_BY_CATEGORY,
  ENDPOINT_RECOMMENDED_ITEMS,
  ENDPOINT_TRENDING_ITEMS,
  ENDPOINT_ITEM_PROMOTIONS,
} from 'variables/api-endpoints';

export const getRecommendedItems = (params?: any) =>
  request.get(ENDPOINT_RECOMMENDED_ITEMS, { params });
export const getTrendingItems = (params?: any) => request.get(ENDPOINT_TRENDING_ITEMS, { params });
export const getItemCategory = (params?: any) => request.get(ENDPOINT_ITEM_CATEGORY, { params });
export const getItemPrice = (params?: any) => request.get(ENDPOINT_ITEM_PRICE, { params });
export const getItemByCategory = (params?: any) =>
  request.get(ENDPOINT_ITEM_BY_CATEGORY, { params });
export const filterItem = (params: any) => request.get(`${ENDPOINT_FILTER_PRODUCT}`, { params });
export const getItemPromotions = (params?: any) =>
  request.get(ENDPOINT_ITEM_PROMOTIONS, { params });
