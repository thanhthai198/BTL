import React, { useCallback, useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Container from 'components/Container';
import { setToken, setCurrentUser } from 'redux-store/auth';
import StorageHelper from 'utils/storage-helper';
import * as UserService from 'services/users';

const Authentication = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    try {
      const user = await StorageHelper.getCurrentUser();
      const token = await StorageHelper.getUserToken();

      if (!user || !token) {
        StorageHelper.removeSession();
        // navigation.reset({ routes: [{ name: 'EnterPhoneNumber' }] });
        dispatch(setToken(''));
        dispatch(setCurrentUser(null));
        return null;
      }
      const getUserInfo = await UserService.getUserInfo();
      dispatch(setToken(token as string));
      dispatch(setCurrentUser({ ...user, ...getUserInfo.data }));
      // navigation.reset({ routes: [{ name: 'Home' }] });
    } catch (e) {
      StorageHelper.removeSession();
      // navigation.reset({ routes: [{ name: 'EnterPhoneNumber' }] });
    }
  }, []);

  useEffect(() => {
    getData().finally(() => {
      RNBootSplash.hide({ duration: 250 });
      navigation.reset({ routes: [{ name: 'App' }] });
    });
  }, []);

  return <Container />;
};

export default Authentication;
