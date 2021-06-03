export const API_BASE_URL = 'http://appdev.gonapp.net/app/api/v1';
export const API_PAYMENT_BASE_URL = 'http://appdev.gonapp.net/payment_gateway';


export const ENDPOINT_CHECK_USER = `${API_BASE_URL}/check_user`;
export const ENDPOINT_GENERATE_OTP = `${API_BASE_URL}/generate_sms_otp`;
export const ENDPOINT_CREATE_USER = `${API_BASE_URL}/create_user`;
export const ENDPOINT_VERIFY_SMS_OTP = `${API_BASE_URL}/verify_sms_otp`;
export const ENDPOINT_UPDATE_PASSWORD = `${API_BASE_URL}/set_password`;
export const ENDPOINT_FORGOT_PASSWORD = `${API_BASE_URL}/forgot_password`;
export const ENDPOINT_UPDATE_USER = `${API_BASE_URL}/update_user`;
export const ENDPOINT_LOGIN = `${API_BASE_URL}/login_password`;
export const ENDPOINT_LOGOUT = `${API_BASE_URL}/logout`;

export const ENDPOINT_ITEM_CATEGORY = `${API_BASE_URL}/categories`;
export const ENDPOINT_ITEM_PROMOTIONS = `${API_BASE_URL}/promotions`;
export const ENDPOINT_ITEM_PRICE = `${API_BASE_URL}/item_price`;
export const ENDPOINT_ITEM_BY_CATEGORY = `${API_BASE_URL}/items_by_categories`;
export const ENDPOINT_RECOMMENDED_ITEMS = `${API_BASE_URL}/my_items`;
export const ENDPOINT_TRENDING_ITEMS = `${API_BASE_URL}/item_purchase_a_lot`;
export const ENDPOINT_CHECK_ORDER = `${API_BASE_URL}/check_order`;
export const ENDPOINT_ORDER_ONLINE = `${API_BASE_URL}/order_online`;
export const ENDPOINT_USER_INFO = `${API_BASE_URL}/user_profile`;
export const ENDPOINT_PAYMENT_METHOD = `${API_BASE_URL}/payment_method`;
export const ENDPOINT_STORE = `${API_BASE_URL}/store`;
export const ENDPOINT_VOUCHER = `${API_BASE_URL}/voucher`;
export const ENDPOINT_SHIPPING_ADDRESS = `${API_BASE_URL}/user_address`;
export const ENDPOINT_PROVINCE = `${API_BASE_URL}/address/province`;
export const ENDPOINT_DISTRICT = `${API_BASE_URL}/address/district`;
export const ENDPOINT_WARD = `${API_BASE_URL}/address/wards`;
export const ENDPOINT_GET_ADDRESS = `${API_BASE_URL}/user_address`;
export const ENDPOINT_GET_VOUCHER = `${API_BASE_URL}/voucher`;
export const ENDPOINT_FILTER_PRODUCT = `${API_BASE_URL}/filter_item`;
export const ENDPOINT_SHIPPING_PACKAGE = `${API_BASE_URL}/estimated_shipping_package`;
export const ENDPOINT_UPLOAD_IMAGE = `${API_BASE_URL}/user/upload_image`;
export const ENDPOINT_GET_TOTAL_ORDER = `${API_BASE_URL}/order/total_success`;

export const ENDPOINT_MOMO = `${API_PAYMENT_BASE_URL}/momo/api/pay/app`;
export const ENDPOINT_MOMO_MERCHANT = `${API_PAYMENT_BASE_URL}/momo/api/merchant_code_app`;
