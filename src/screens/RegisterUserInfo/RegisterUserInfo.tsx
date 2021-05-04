import React from 'react';
import { View, Alert } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useSelector } from 'redux-store';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import DatePicker from 'components/DatePicker';
import AuthLayout from 'layouts/AuthLayout';
import commonStyles from 'theme/commonStyles';
import { updateUser } from 'redux-store/register';
import { DEFAULT_TITLE } from 'variables/response-messages';

interface FormValues {
  fullname: string;
  email: string;
  address: string;
  birthday?: string;
  gender: string;
}

const formSchema = yup.object({
  fullname: yup.string().required('Họ tên không được để trống'),
  birthday: yup.string().required('Ngày sinh không được để trống'),
  // email: yup.string().required('Email không được để trống').email('Email không hợp lệ'),
  // address: yup.string().required('Địa chỉ không được để trống'),
});

const RegisterUserInfo = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.register.loading);

  const initialValues: FormValues = {
    fullname: '',
    email: '',
    address: '',
    birthday: '',
    gender: '',
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await dispatch(updateUser(values));
      if (result.payload?.error_code || result.payload?.error_message) {
        return Alert.alert(DEFAULT_TITLE, result.payload?.error_message || '');
      }
      navigation.reset({ routes: [{ name: 'App' }] });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthLayout hideBackButton title="Bổ sung thông tin tài khoản" loading={loading}>
      <Formik initialValues={initialValues} validationSchema={formSchema} onSubmit={onSubmit}>
        {({ values, setFieldValue, setFieldTouched, touched, errors, handleSubmit }) => (
          <View style={commonStyles.marginGutter2x}>
            <TextInput
              placeholder="Họ và tên"
              textContentType="name"
              value={values.fullname}
              touched={touched.fullname}
              error={errors.fullname}
              onChangeText={text => setFieldValue('fullname', text)}
              onBlur={() => setFieldTouched('fullname')}
            />
            <DatePicker
              placeholder="Ngày sinh"
              onChange={(value: string) => setFieldValue('birthday', value)}
              value={values.birthday}
              onBlur={() => setFieldTouched('birthday')}
              touched={touched.birthday}
              error={errors.birthday}
            />
            <TextInput
              placeholder="Email"
              textContentType="emailAddress"
              value={values.email}
              touched={touched.email}
              error={errors.email}
              onChangeText={text => setFieldValue('email', text)}
              onBlur={() => setFieldTouched('email')}
            />
            <TextInput
              placeholder="Địa chỉ"
              value={values.address}
              touched={touched.address}
              error={errors.address}
              onChangeText={text => setFieldValue('address', text)}
              onBlur={() => setFieldTouched('address')}
            />
            <Button
              style={[commonStyles.marginTopGutter, commonStyles.marginBottomGutter]}
              onPress={handleSubmit}
            >
              Tiếp tục
            </Button>
            {/* <Button variant="clear" onPress={skip}>
              Bỏ qua
            </Button> */}
          </View>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default RegisterUserInfo;
