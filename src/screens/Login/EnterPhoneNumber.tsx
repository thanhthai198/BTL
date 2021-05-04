import React, { FC, useState } from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { Text, TextInput, Button } from 'components';
import { checkPhone } from 'services/auth';
import AuthLayout from 'layouts/AuthLayout';
import { USER_NOT_FOUND } from 'variables/api-errors';
import commonStyles from 'theme/commonStyles';
import { DEFAULT_MESSAGE, DEFAULT_TITLE } from 'variables/response-messages';

interface LoginProps {
  navigation?: any;
}

const EnterPhoneNumber: FC<LoginProps> = props => {
  const [phone, setPhone] = useState('');
  const [errorPhone, setErrorPhone] = useState('');

  const handleCheckPhone = async () => {
    try {
      if (!phone) {
        setErrorPhone('Vui lòng nhập số điện thoại');
        return null;
      }
      const data = {
        data: phone,
      };
      await checkPhone(data);
      props.navigation.navigate('EnterPassword', { phone });
    } catch (e) {
      const { error_message: message, error_code: errorCode } = e;
      if (errorCode === USER_NOT_FOUND) {
        return Alert.alert(DEFAULT_TITLE, message);
      }
      if (errorCode) {
        return Alert.alert(DEFAULT_TITLE, DEFAULT_MESSAGE);
      }
      props.navigation.navigate('Register', { phone });
    }
  };

  return (
    <AuthLayout showAppVersion>
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
        <TextInput
          placeholder="Số điện thoại của bạn"
          keyboardType="number-pad"
          value={phone}
          onChangeText={value => setPhone(value)}
          touched={!!errorPhone}
          error={errorPhone}
        />
        <Button style={styles.submit} onPress={handleCheckPhone}>
          Tiếp tục
        </Button>
        <View style={[commonStyles.row, commonStyles.alignCenter]}>
          <Text size={16} color="gray" weight="500">
            Bạn chưa có tài khoản?
          </Text>
          <Button
            width="auto"
            variant="clear"
            onPress={() => props.navigation.navigate('Register')}
          >
            <Text color="primary" size={16}>
              {' '}
              Đăng ký
            </Text>
          </Button>
        </View>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginBottom: 17,
  },
  header: {
    flex: 3 / 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  body: {
    flex: 2 / 5,
    paddingHorizontal: 33,
    alignItems: 'center',
  },
  submit: {
    marginBottom: 40,
  },
});

export default EnterPhoneNumber;
