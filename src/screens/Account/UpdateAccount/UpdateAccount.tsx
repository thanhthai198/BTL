import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, View } from 'react-native';
import moment from 'moment';
import AppLayout from 'layouts/AppLayout';
import Avatar from 'components/Avatar';
import AvatarImg from 'assets/img/avatar.png';
import { Flex, Text, TextInput, theme } from 'components';
import CheckBox from 'components/CheckBox';
import { Formik } from 'formik';
import { FormValues } from '../components/models';
import * as yup from 'yup';
import { RootState, useSelector } from 'redux-store/store';
import s from 'theme/commonStyles';
import { DEFAULT_TITLE, UPLOAD_AVATAR } from 'variables/response-messages';
import * as UserService from 'services/users';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from 'redux-store/auth';
import { useNavigation } from '@react-navigation/native';
import Touchable from 'components/Touchable';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'components/PickAvatar/ActionSheet';
import axios from 'axios';
import { getUserToken } from 'utils/storage-helper';
import { API_BASE_URL } from 'variables/api-endpoints';
import { DATE_FORMAT } from 'variables';
import MIcon from 'react-native-vector-icons/MaterialIcons';

const options = {
  cropping: true,
  height: 500,
  includeBase64: true,
  width: 500,
};

const UpdateAccount = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [avatar, setAvatar] = useState('');
  const actionSheet = useRef<any>(null);

  const initialFormValues: FormValues = {
    fullName: user.contact_name || '--',
    phone: user.contact_phone,
    email: user.contact_email || '--',
    birthday:
      user.birthday && moment(user.birthday, DATE_FORMAT.vi).isValid()
        ? moment(user.birthday, DATE_FORMAT.vi).format(DATE_FORMAT.vi)
        : '--',
    job: user.job,
    sex: user.contact_gender,
    address: user.contact_address,
    company: user.workplace,
  };

  const formSchema = yup.object({
    fullName: yup.string().required('Tên không được để trống'),
    phone: yup.string().required('Số điện thoại không được để trống'),
    email: yup.string().required('Email không được để trống').email('Email không hợp lệ'),
  });

  const onSubmit = async (values: FormValues) => {
    const data = {
      fullname: values.fullName || user.contact_name,
      email: values.email || '',
      gender: values.sex || '',
      address: values.address || '',
      job: values.job || '',
      workplace: values.company || '',
    };
    try {
      setSubmiting(true);
      const res = await UserService.updateUser(data);
      if (res.status === 200) {
        const resUser = await UserService.getUserInfo();
        console.log('UpdateAccount -> resUser', resUser);
        dispatch(setCurrentUser({ ...user, ...resUser.data }));
        navigation.goBack();
        setSubmiting(false);
      }
      setSubmiting(false);
    } catch (error) {
      Alert.alert(DEFAULT_TITLE, '');
      setSubmiting(false);
    }
  };

  const base64 = (image: any) => `data:${image.mime};base64,${image.data}`;

  const uploadAvatar = async (image: any) => {
    setLoading(true);
    const token = await getUserToken();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-APP-KEY': 'app_d2ce6e48-de9c-40f6-81bc-a8b28e7a7acc',
        'X-USER-TOKEN': token,
      },
    };
    const data = new FormData();
    const pathParts = image.path.split('/');
    data.append('file', {
      width: image.width,
      height: image.height,
      type: image.mime,
      uri: image.path,
      name: Platform.OS === 'android' ? pathParts[pathParts.length - 1] : image.filename,
    });
    axios
      .post(`${API_BASE_URL}/user/upload_image`, data, config)
      .then(resp => {
        setLoading(false);
        if (resp.status === 200) {
          getUserInfo();
          Alert.alert(UPLOAD_AVATAR.title, UPLOAD_AVATAR.message);
        }
      })
      .catch(error => {
        console.log('UpdateAccount -> error', error);
        Alert.alert('Thông báo', DEFAULT_TITLE);
      });
  };

  const getUserInfo = async () => {
    const res = await UserService.getUserInfo();
    dispatch(setCurrentUser({ ...user, ...res.data }));
  };

  const handler = (index: any) => {
    switch (index) {
      // case 0:
      //   ImagePicker.openCamera({ ...options })
      //     .then(image => {
      //       setAvatar(base64(image));
      //       uploadAvatar(image);
      //     })
      //     .catch(e => console.log(e));
      //   return null;
      // case 1:
      //   ImagePicker.openPicker({ ...options })
      //     .then(image => {
      //       setAvatar(base64(image));
      //       uploadAvatar(image);
      //     })
      //     .catch(e => console.log(e));
      //   return null;
      case 0:
        ImagePicker.openPicker({ ...options })
          .then(image => {
            setAvatar(base64(image));
            uploadAvatar(image);
          })
          .catch(e => console.log(e));
        return null;
    }
  };

  const handleClickAvatar = () => {
    if (actionSheet.current) {
      actionSheet.current.show();
    }
  };

  return (
    <Formik initialValues={initialFormValues} onSubmit={onSubmit} validationSchema={formSchema}>
      {({ setFieldValue, setFieldTouched, errors, touched, values, handleSubmit }) => {
        return (
          <>
            <AppLayout
              title="Cập nhật tài khoản"
              right="Lưu"
              onPressRight={handleSubmit}
              loading={submiting}
              haveTextInput
            >
              <View style={[s.paddingHorizontal2x]}>
                <Flex justifyContent="center">
                  <Touchable style={[s.paddingVertical, styles.avatar]} onPress={handleClickAvatar}>
                    <View style={styles.iconCamera}>
                      <MIcon name="camera-alt" size={22} color={theme.palette.text.gray} />
                    </View>
                    {loading ? (
                      <ActivityIndicator animating size="small" />
                    ) : (
                      <Avatar
                        source={
                          avatar || user?.contact_profile_pic
                            ? { uri: avatar || user?.contact_profile_pic }
                            : AvatarImg
                        }
                        size="large"
                      />
                    )}

                    <ActionSheet
                      ref={actionSheet}
                      // options={['Take photo', 'Choose from gallery']}
                      options={['Choose from gallery']}
                      handler={handler}
                    />
                  </Touchable>
                </Flex>

                <View style={[styles.form, s.marginTopGutter]}>
                  <View style={styles.formInput}>
                    <Text size={14} weight="500" color="primary">
                      Số điện thoại
                    </Text>
                    <TextInput
                      editable={false}
                      textContentType="telephoneNumber"
                      value={values.phone}
                      inputStyle={styles.input}
                      touched={touched.phone}
                      error={errors.phone}
                      onChangeText={text => setFieldValue('phone', text)}
                      onBlur={() => setFieldTouched('phone')}
                    />
                  </View>
                  <View style={styles.formInput}>
                    <Text size={14} weight="500" color="gray">
                      Họ tên
                    </Text>
                    <TextInput
                      value={values.fullName}
                      inputStyle={styles.input}
                      touched={touched.fullName}
                      error={errors.fullName}
                      onChangeText={text => setFieldValue('fullName', text)}
                      onBlur={() => setFieldTouched('fullName')}
                    />
                  </View>
                  <View style={styles.formInput}>
                    <Text size={14} weight="500" color="gray">
                      Email
                    </Text>
                    <TextInput
                      textContentType="emailAddress"
                      value={values.email}
                      inputStyle={styles.input}
                      touched={touched.email}
                      error={errors.email}
                      onChangeText={text => setFieldValue('email', text)}
                      onBlur={() => setFieldTouched('email')}
                    />
                  </View>
                  <View style={styles.formInput}>
                    <Text size={14} weight="500" color="gray">
                      Ngày sinh
                    </Text>
                    <TextInput editable={false} value={values.birthday} inputStyle={styles.input} />
                  </View>
                  <View style={styles.formInput}>
                    <Text size={14} weight="500" color="gray">
                      Nghề nghiệp
                    </Text>
                    <TextInput
                      value={values.job}
                      inputStyle={styles.input}
                      touched={touched.job}
                      error={errors.job}
                      onChangeText={text => setFieldValue('job', text)}
                      onBlur={() => setFieldTouched('job')}
                    />
                  </View>
                  <View style={styles.formInput}>
                    <Text size={14} weight="500" color="gray">
                      Công ty đang làm việc
                    </Text>
                    <TextInput
                      value={values.company}
                      inputStyle={styles.input}
                      touched={touched.company}
                      error={errors.company}
                      onChangeText={text => setFieldValue('company', text)}
                      onBlur={() => setFieldTouched('company')}
                    />
                  </View>
                  <View style={styles.formInput}>
                    <Text size={14} weight="500" color="gray">
                      Giới tính
                    </Text>
                    <Flex justifyContent="space-between">
                      <CheckBox
                        label="Nam"
                        value={values.sex === 'male'}
                        onChange={value => setFieldValue('sex', value ? 'male' : null)}
                      />
                      <CheckBox
                        label="Nữ"
                        value={values.sex === 'female'}
                        onChange={value => setFieldValue('sex', value ? 'female' : null)}
                      />
                      <CheckBox
                        label="Khác"
                        value={values.sex === 'other'}
                        onChange={value => setFieldValue('sex', value ? 'other' : null)}
                      />
                    </Flex>
                  </View>
                  <View style={styles.formInput}>
                    <Text size={14} weight="500" color="gray">
                      Địa chỉ nhà
                    </Text>
                    <TextInput
                      value={values.address}
                      inputStyle={styles.input}
                      touched={touched.address}
                      error={errors.address}
                      onChangeText={text => setFieldValue('address', text)}
                      onBlur={() => setFieldTouched('address')}
                    />
                  </View>
                </View>
              </View>
            </AppLayout>
          </>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  form: {
    backgroundColor: theme.getColor('white'),
    borderRadius: 10,
  },
  formInput: {
    borderBottomColor: theme.palette.borderSecondary,
    borderBottomWidth: 1,
    paddingHorizontal: 17,
    paddingVertical: 10,
  },
  input: {
    textAlign: 'left',
    backgroundColor: theme.getColor('white'),
    paddingHorizontal: 0,
    height: 'auto',
  },
  avatar: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCamera: {
    position: 'absolute',
    right: 3,
    bottom: 3,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.palette.background,
  },
});

export default UpdateAccount;
