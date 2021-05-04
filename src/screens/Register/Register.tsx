import React from 'react';
import { Image, View, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'redux-store';
import { Formik } from 'formik';
import * as yup from 'yup';
import Button from 'components/Button';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import AuthLayout from 'layouts/AuthLayout';
import IconPassLock from 'assets/img/icon_pass_lock.png';
import commonStyles from 'theme/commonStyles';
import { USER_NOT_FOUND } from 'variables/api-errors';
import { DEFAULT_TITLE, USER_EXISTED } from 'variables/response-messages';
import { checkUserExist, generateOTP } from 'redux-store/register';

interface FormValue {
  phone: string;
}

const formSchema = yup.object({
  phone: yup.string().required('Số điện thoại không được để trống'),
});

const Register = ({ route }: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const loading = useSelector(state => state.register?.loading);

  const initialValues: FormValue = {
    phone: route?.params?.phone || '',
  };

  const onSubmit = async (values: FormValue) => {
    try {
      const result = await dispatch(checkUserExist(values.phone));
      if (result.payload?.error_code === USER_NOT_FOUND) {
        const otpResult = await dispatch(generateOTP(values.phone));
        if (otpResult.payload?.error_code || otpResult.payload?.error_message) {
          return Alert.alert(DEFAULT_TITLE, otpResult.payload?.error_message || '');
        }
        navigation.navigate('VerificationCode');
        return null;
      }
      if (result.payload?.phone_number) {
        return Alert.alert(USER_EXISTED.title, USER_EXISTED.message);
      }

      return (
        !!result.payload?.error_message &&
        Alert.alert(DEFAULT_TITLE, result.payload?.error_message || '')
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthLayout title="Đăng ký tài khoản" loading={loading} showAppVersion>
      <View style={styles.registerForm}>
        <View style={[commonStyles.marginGutter2x, commonStyles.center]}>
          <Image source={IconPassLock} style={commonStyles.marginBottomGutter2x} />
          <Text align="center" color="primary">
            Nhập số của bạn và hệ thống sẽ gửi một mã số OTP gồm 4 kí tự về tin nhắn
          </Text>
        </View>
        <Formik initialValues={initialValues} validationSchema={formSchema} onSubmit={onSubmit}>
          {({ handleSubmit, values, setFieldValue, touched, setFieldTouched, errors }) => (
            <>
              <TextInput
                placeholder="Số điện thoại của bạn"
                value={values.phone}
                onChangeText={phone => setFieldValue('phone', phone)}
                touched={touched.phone}
                error={errors.phone}
                onBlur={() => setFieldTouched('phone')}
                inputContainerStyle={{ backgroundColor: 'transparent' }}
              />
              <Button style={commonStyles.marginTopGutter} onPress={handleSubmit}>
                Tiếp tục
              </Button>
            </>
          )}
        </Formik>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  registerForm: {
    padding: 30,
  },
});

export default Register;
