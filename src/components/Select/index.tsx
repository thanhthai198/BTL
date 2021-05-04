import { Icon, theme } from 'components';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';
import Text from '../Text';

interface SelectProps extends PickerSelectProps {
  touched?: boolean;
  error?: string;
  placeholder?: string;
}

const Select: FC<SelectProps> = ({ touched, error, placeholder, ...others }) => {
  return (
    <View style={styles.root}>
      <RNPickerSelect
        useNativeAndroidPickerStyle={false}
        Icon={() => <Icon name="chevron-right" color={theme.getColor('gray')} />}
        placeholder={{
          label: `${placeholder}`,
          color: theme.getColor('gray'),
          fontSize: 15,
          fontWeight: 500,
        }}
        style={{
          viewContainer: {
            backgroundColor: theme.palette.layoutBackground,
            borderColor: '#DCDCDC',
            borderWidth: 1,
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 12,
          },
          iconContainer: {
            top: '50%',
            transform: [{ translateY: -5 }],
          },
          // inputIOS: styles.input,
          // inputAndroid: styles.input,
          // inputAndroidContainer: [styles.inputWrapper, touched && error ? styles.inputError : {}],
          // inputIOSContainer: [styles.inputWrapper, touched && error ? styles.inputError : {}],
        }}
        {...others}
      />
      <View style={styles.helperTextWrapper}>
        {touched && !!error && (
          <Text align="right" style={styles.helperText} color="red">
            {error}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  helperText: {
    fontSize: 13,
  },
  helperTextWrapper: {
    justifyContent: 'center',
    minHeight: 20,
  },
  // input: {
  //   color: theme.palette.text.black,
  //   fontSize: theme.getFontSize('normal'),
  //   height: theme.measure.inputHeight,
  //   fontFamily: theme.getFontFamily({
  //     fontStyle: 'normal',
  //     fontWeight: '400',
  //   }),
  //   width: '100%',
  //   paddingVertical: 5,
  //   paddingHorizontal: 0,
  // },
  // inputError: {},
  // inputWrapper: {
  //   alignItems: 'flex-start',
  //   backgroundColor: '#fff',
  //   flexDirection: 'row',
  //   width: '100%',
  // },
  root: {
    position: 'relative',
  },
});

export default Select;
