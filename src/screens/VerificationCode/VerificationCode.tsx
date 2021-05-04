import React, { useState } from 'react';
import { Image, View, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, StackActions } from '@react-navigation/native';
import Button from 'components/Button';
import Touchable from 'components/Touchable';
import Text from 'components/Text';
import CodeInput from 'components/CodeInput';
import AuthLayout from 'layouts/AuthLayout';
import IconPassLock from 'assets/img/icon_pass_lock.png';
import commonStyles from 'theme/commonStyles';
import { verifyOTP, registerNewUser } from 'redux-store/register';
import { DEFAULT_TITLE } from 'variables/response-messages';
import { useSelector } from 'redux-store';

const VerificationCode = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.register?.loading);

  const [code, setCode] = useState<string>('');
  const onChange = (newValue: string) => {
    setCode(newValue);
    if (newValue.length === 4) {
      handleSubmit(null, newValue);
    }
  };
  const handleSubmit = async (e?: any, argCode?: string) => {
    try {
      const result = await dispatch(verifyOTP(argCode || code));
      if (result.payload?.error_code || result.payload?.error_message) {
        Alert.alert(DEFAULT_TITLE, result.payload?.error_message);
        return null;
      }
      await dispatch(registerNewUser());
      navigation.dispatch(StackActions.replace('RegisterPassword'));
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <AuthLayout title="Xác thực OTP" loading={loading}>
      <View style={styles.registerForm}>
        <View style={[commonStyles.marginGutter2x, commonStyles.center]}>
          <Image source={IconPassLock} style={commonStyles.marginBottomGutter2x} />
        </View>
        <CodeInput onChange={onChange} onSubmit={handleSubmit} />
        <Button style={commonStyles.marginBottomGutter2x} onPress={handleSubmit}>
          Tiếp tục
        </Button>
        <View style={[commonStyles.row, commonStyles.alignCenter, commonStyles.justifyCenter]}>
          <Text align="center">Bạn chưa nhận được mã? </Text>
          <Touchable>
            <Text color="primary" weight="500">
              Gửi lại OTP
            </Text>
          </Touchable>
        </View>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  registerForm: {
    padding: 30,
  },
});

export default VerificationCode;
