import React from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import AuthLayout from 'layouts/AuthLayout';
import { Button, Text, TextInput, theme } from 'components';
import commonStyles from 'theme/commonStyles';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import IconPassLock from 'assets/img/icon_pass_lock.png';
import { USER_NOT_FOUND } from 'variables/api-errors';
import { DEFAULT_TITLE } from 'variables/response-messages';
import { checkUserExist, generateOTP } from 'redux-store/forgotPassword';

interface FormValues {
  phone: string;
}

const EnterPhoneNumber = ({ route }: any) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const initialValues: FormValues = {
    phone: route.params?.phone || '',
  };

  const formSchema = yup.object({
    phone: yup.string().required('Số điện thoại không được để trống'),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await dispatch(checkUserExist(values.phone));
      if (result.payload.error_code === USER_NOT_FOUND) {
        return Alert.alert(DEFAULT_TITLE, result.payload.error_message);
      }
      const otpResult = await dispatch(generateOTP(values.phone));
      if (otpResult.payload?.error_code || otpResult.payload?.error_message) {
        return Alert.alert(DEFAULT_TITLE, otpResult.payload?.error_message || '');
      }

      navigation.navigate('VerificationForgot');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthLayout showAppVersion title="Quên mật khẩu">
      <View style={[commonStyles.flex, commonStyles.alignCenter]}>
        <Image source={IconPassLock} />

        <View style={[commonStyles.flex, commonStyles.marginTopGutter2x, styles.body]}>
          <Text color={theme.getColor('primary')} weight="500" align="center" size={16}>
            Nhập số của bạn và hệ thống sẽ gửi một mã số OTP gồm 4 kí tự về tin nhắn
          </Text>
          <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={formSchema}>
            {({ values, setFieldValue, setFieldTouched, touched, errors, handleSubmit }) => (
              <View style={styles.form}>
                <TextInput
                  placeholder="Số điện thoại của bạn"
                  textContentType="telephoneNumber"
                  touched={touched.phone}
                  error={errors.phone}
                  value={values.phone}
                  onChangeText={text => setFieldValue('phone', text)}
                  onBlur={() => setFieldTouched('phone')}
                  style={commonStyles.marginBottomGutter2x}
                />
                <Button fullWidth onPress={handleSubmit}>
                  <Text color={theme.palette.text.white} size={17} weight={'600'}>
                    Đăng nhập
                  </Text>
                </Button>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 33,
  },
  form: {
    marginTop: theme.measure.gutter4x,
  },
});

export default EnterPhoneNumber;
