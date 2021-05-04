import { Button, TextInput, theme } from 'components';
import { Formik } from 'formik';
import { AppLayout } from 'layouts';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useSelector } from 'redux-store/store';
import s from 'theme/commonStyles';
import * as yup from 'yup';
import { addAddress } from 'services/address';
import { GOOGLE_API_KEY } from 'variables';

interface FormValue {
  address: string;
  addressName: string;
  lat: string;
  lng: string;
}

const formSchema = yup.object({
  // addressName: yup.string().required('Tên địa chỉ không được để trống'),
  address: yup.string().required('Địa chỉ không được để trống'),
  lat: yup.string().required('Địa chỉ không hợp lệ'),
  lng: yup.string().required('Địa chỉ không hợp lệ'),
});

const AddAddress = ({ navigation, route }: any) => {
  const onAddDone = route?.params?.onAddDone;
  const user = useSelector(state => state.auth.user);

  const initialValues: FormValue = {
    address: '',
    addressName: '',
    lat: '',
    lng: '',
  };

  const onSubmit = async (values: FormValue) => {
    try {
      const data = {
        lat: values.lat,
        lng: values.lng,
        address: values.address,
        address_name: values.addressName,
        user_phone: user?.contact_phone,
        user_name: user?.contact_name,
      };

      const res = await addAddress(data);
      console.log(res.data);
      if (onAddDone) {
        onAddDone(res.data);
      } else {
        navigation.goBack();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={formSchema} onSubmit={onSubmit}>
      {({ handleSubmit, values, setFieldValue, touched, setFieldTouched, errors }) => (
        <>
          <AppLayout
            title="Thêm địa chỉ"
            style={{ backgroundColor: theme.palette.layoutBackground }}
          >
            <View style={[styles.form, styles.padding, s.fullScreenHeight]}>
              <TextInput
                placeholder="Tên địa chỉ"
                inputStyle={styles.input}
                inputContainerStyle={styles.inputContainer}
                value={values.addressName}
                onChangeText={addressName => setFieldValue('addressName', addressName)}
                touched={touched.addressName}
                error={errors.addressName}
                onBlur={() => setFieldTouched('addressName')}
              />
              <GooglePlacesAutocomplete
                placeholder="Search"
                onNotFound={console.log}
                onTimeout={console.log}
                onFail={console.log}
                fetchDetails
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  setFieldValue('address', data.description);
                  setFieldValue('lat', details?.geometry?.location?.lat);
                  setFieldValue('lng', details?.geometry?.location?.lng);
                }}
                query={{
                  key: GOOGLE_API_KEY,
                  language: 'vi',
                  components: 'country:vn',
                }}
                textInputProps={{
                  InputComp: TextInput,
                  placeholder: 'Địa chỉ',
                  inputStyle: styles.input,
                  inputContainerStyle: styles.inputContainer,
                }}
                styles={{
                  textInputContainer: {
                    backgroundColor: 'transparent',
                    padding: 0,
                    borderWidth: 0,
                    paddingHorizontal: 0,
                  },
                  textInput: {
                    backgroundColor: 'transparent',
                    padding: 0,
                    borderWidth: 0,
                    paddingHorizontal: 0,
                  },
                }}
              />
            </View>
          </AppLayout>
          <View style={styles.button}>
            <Button onPress={handleSubmit}>Lưu địa chỉ</Button>
          </View>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingTop: 20,
  },
  padding: {
    paddingHorizontal: theme.measure.gutter * 1.5,
  },
  inputContainer: {
    backgroundColor: theme.palette.layoutBackground,
  },
  input: {
    backgroundColor: theme.palette.layoutBackground,
    borderRadius: 10,
    borderWidth: 0.6,
    borderColor: '#DCDCDC',
  },
  button: {
    backgroundColor: theme.getColor('white'),
    marginHorizontal: -15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default AddAddress;
