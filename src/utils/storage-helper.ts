import AsyncStorage from '@react-native-community/async-storage';

const keys = {
  currentUser: '@LaLaNow/User',
  userToken: '@LaLaNow/UserToken',
};

export const saveUserInfo = async (user: any) => {
  try {
    await AsyncStorage.setItem(keys.currentUser, JSON.stringify(user));
  } catch (e) {
    throw new Error('can_not_save_user_info');
  }
};

export const saveUserToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(keys.userToken, token);
  } catch (e) {
    throw new Error('can_not_save_user_token');
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem(keys.currentUser);
    return user ? JSON.parse(user) : null;
  } catch (e) {
    throw new Error('can_not_get_current_user');
  }
};

export const getUserToken = async () => {
  try {
    const token = await AsyncStorage.getItem(keys.userToken);
    return token;
  } catch (e) {
    throw new Error('can_not_get_user_token');
  }
};

export const hasCurrentUser = async () => {
  try {
    const userToken = await AsyncStorage.getItem(keys.userToken);

    return !!userToken;
  } catch (e) {
    throw new Error('can_not_get_login_info');
  }
};

export const removeSession = async () => {
  try {
    await AsyncStorage.removeItem(keys.currentUser);
    await AsyncStorage.removeItem(keys.userToken);
  } catch (e) {
    throw new Error('can_not_remove_session');
  }
};

export const updateUserInfo = async (data: any) => {
  try {
    let user = await AsyncStorage.getItem(keys.currentUser);
    user = user ? JSON.parse(user) : null;
    const newUser = JSON.stringify(Object.assign({}, user, data));
    await AsyncStorage.setItem(keys.currentUser, newUser);
  } catch (e) {
    throw new Error('can_not_update_user_info');
  }
};

export default {
  getCurrentUser,
  getUserToken,
  hasCurrentUser,
  removeSession,
  saveUserInfo,
  saveUserToken,
  updateUserInfo,
};
