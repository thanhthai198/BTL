import React from 'react';
import { View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import AuthLayout from 'layouts/AuthLayout';
import commonStyles from 'theme/commonStyles';
import { updatePassword } from 'redux-store/register';
import { DEFAULT_TITLE } from 'variables/response-messages';
import { useSelector } from 'redux-store';

interface FormValues {
  password: string;
  confirmPassword?: string;
}

const formSchema = yup.object({
  password: yup
    .string()
    .min(6, 'Mật khẩu ít nhất 6 kí tự')
    .required('Mật khẩu không được để trống'),
  confirmPassword: yup
    .string()
    .required('Xác nhận mật khẩu không được để trống')
    .equals([yup.ref('password')], 'Mật khẩu không trùng khớp'),
});

const RegisterPassword = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.register.loading);

  const onSubmit = async (values: FormValues) => {
    try {
      const { password } = values;
      const result = await dispatch(updatePassword({ password, old_password: null }));
      if (result.payload?.error_code || result.payload?.error_message) {
        return Alert.alert(DEFAULT_TITLE, result.payload?.error_message || '');
      }
      navigation.navigate('RegisterUserInfo');
    } catch (e) {
      console.log(e);
    }
  };

  const initialFormValues: FormValues = {
    password: '',
    confirmPassword: '',
  };

  return (
    <AuthLayout loading={loading} title="Tạo mật khẩu">
      <Formik initialValues={initialFormValues} onSubmit={onSubmit} validationSchema={formSchema}>
        {({ setFieldValue, setFieldTouched, errors, touched, values, handleSubmit }) => (
          <View style={commonStyles.marginGutter2x}>
            <TextInput
              placeholder="Nhập mật khẩu"
              secureTextEntry
              touched={touched.password}
              error={errors.password}
              onChangeText={text => setFieldValue('password', text)}
              value={values.password}
              onBlur={() => setFieldTouched('password')}
            />
            <TextInput
              placeholder="Nhập lại mật khẩu"
              secureTextEntry
              touched={touched.confirmPassword}
              error={errors.confirmPassword}
              onChangeText={text => setFieldValue('confirmPassword', text)}
              value={values.confirmPassword}
              onBlur={() => setFieldTouched('confirmPassword')}
            />
            <Button style={commonStyles.marginTopGutter} onPress={handleSubmit}>
              Tiếp tục
            </Button>
          </View>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default RegisterPassword;
