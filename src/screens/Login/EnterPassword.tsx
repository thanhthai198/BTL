import React, { FC, useState } from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import Button from 'components/Button';
import { useDispatch } from 'react-redux';
import { Text, TextInput } from 'components';
import * as UserService from 'services/users';
import AuthLayout from 'layouts/AuthLayout';
import { login } from 'services/auth';
import { setToken, setCurrentUser } from 'redux-store/auth';
import { saveUserToken, saveUserInfo } from 'utils/storage-helper';
import { DEFAULT_MESSAGE, DEFAULT_TITLE } from 'variables/response-messages';
import { USER_NOT_FOUND } from 'variables/api-errors';
import { getTotalOrderByUser } from 'services/order';

interface EnterPasswordProps {
  route?: any;
  navigation?: any;
}

const EnterPassword: FC<EnterPasswordProps> = props => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const { route, navigation } = props;

  async function getUserInfo() {
    const resTotalOrder = await getTotalOrderByUser();
    const resInfo = await UserService.getUserInfo();
    const userInfo = {
      ...resInfo.data,
      totalOrder: resTotalOrder?.data.data || 0,
    };
    await saveUserInfo(userInfo);
    dispatch(setCurrentUser(userInfo));
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const params = {
        data: route.params.phone,
        password,
      };
      const res = await login(params);
      const { token } = res.data;

      await saveUserToken(token);
      dispatch(setToken(token as string));
      await getUserInfo();
      setLoading(false);
      navigation.reset({ routes: [{ name: 'App' }] });
    } catch (error) {
      const { error_message: message, error_code: code } = error;
      console.log('error', error);
      setLoading(false);

      if (code === USER_NOT_FOUND) {
        return Alert.alert(DEFAULT_TITLE, 'Sai tên đăng nhập hoặc mật khẩu');
      }
      if (!message) {
        return Alert.alert(DEFAULT_TITLE, message || DEFAULT_MESSAGE);
      }
      Alert.alert(DEFAULT_TITLE, DEFAULT_MESSAGE);
    }
  };
  return (
    <AuthLayout showAppVersion loading={loading}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Image source={require('assets/img/logo.png')} />
        </View>
        <Text color="primary" weight="600" size={17}>
          Đăng nhập hệ thống cửa hàng trợ giá
        </Text>
        <Text color="primary" weight="600" size={17}>
          LALANOW
        </Text>
      </View>

      <View style={styles.body}>
        <View>
          <TextInput
            value={password}
            onChangeText={value => setPassword(value)}
            placeholder="Nhập mật khẩu"
            secureTextEntry
          />
        </View>
        <Button style={styles.submit} onPress={handleSubmit}>
          Đăng nhập
        </Button>
        <Text
          size={16}
          color="primary"
          weight={'500'}
          onPress={() =>
            navigation.navigate('EnterPhoneNumberForgot', { phone: route.params.phone })
          }
        >
          Quên mật khẩu?
        </Text>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginBottom: 17,
  },
  header: {
    flex: 3,
    alignItems: 'center',
    marginBottom: 30,
  },
  body: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: 33,
  },
  submit: {
    marginBottom: 40,
  },
});

export default EnterPassword;
