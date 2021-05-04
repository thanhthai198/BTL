import React from 'react';
import AuthLayout from 'layouts/AuthLayout';
import { Button, TextInput } from 'components';
import { Alert, StyleSheet, View } from 'react-native';
import commonStyles from 'theme/commonStyles';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_TITLE } from 'variables/response-messages';
import { forgotPassword } from 'redux-store/forgotPassword';
import { RootState } from 'redux-store/store';

interface FormValue {
  password: string;
  rePassword: string;
}

const formSchema = yup.object({
  password: yup
    .string()
    .min(6, 'Mật khẩu ít nhất 6 kí tự')
    .required('Mật khẩu không được để trống'),
  rePassword: yup
    .string()
    .min(6, 'Mật khẩu ít nhất 6 kí tự')
    .required('Mật khẩu không được để trống')
    .equals([yup.ref('password')], 'Mật khẩu không trùng khớp'),
});

function NewPassword({ route }: any) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.forgotPassword.loading);

  const initialValues: FormValue = {
    password: '',
    rePassword: '',
  };
  const onSubmit = async (values: FormValue) => {
    try {
      const { password } = values;
      const result = await dispatch(
        forgotPassword({ password, sms_token: route.params.sms_token })
      );
      console.log('NewPassword -> result', result);
      if (result.payload?.error_code || result.payload?.error_message) {
        return Alert.alert(DEFAULT_TITLE, result.payload?.error_message || '');
      }

      navigation.navigate('EnterPhoneNumber');
    } catch (error) {}
  };

  return (
    <AuthLayout title="Thiết lập mật khẩu mới cho tài khoản" loading={loading}>
      <View style={[styles.root, commonStyles.flex]}>
        <Formik initialValues={initialValues} validationSchema={formSchema} onSubmit={onSubmit}>
          {({ handleSubmit, values, setFieldValue, touched, setFieldTouched, errors }) => (
            <>
              <View style={commonStyles.marginBottomGutter}>
                <TextInput
                  placeholder="Đặt mật khẩu mới"
                  value={values.password}
                  onChangeText={password => setFieldValue('password', password)}
                  touched={touched.password}
                  error={errors.password}
                  onBlur={() => setFieldTouched('password')}
                  secureTextEntry
                />
                <TextInput
                  placeholder="Nhập lại mật khẩu mới"
                  value={values.rePassword}
                  onChangeText={password => setFieldValue('rePassword', password)}
                  touched={touched.rePassword}
                  error={errors.rePassword}
                  onBlur={() => setFieldTouched('rePassword')}
                  secureTextEntry
                />
              </View>
              <Button onPress={handleSubmit}>Đăng nhập</Button>
            </>
          )}
        </Formik>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 33,
    paddingTop: 60,
  },
});

export default NewPassword;
