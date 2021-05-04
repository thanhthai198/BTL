import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../Text';
import * as theme from 'theme';
import commonStyles from 'theme/commonStyles';

interface CheckBoxProps {
  label?: string;
  touched?: boolean;
  error?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const CheckBox = ({ label, touched, error, value, onChange: onChangeProp }: CheckBoxProps) => {
  const checked = !!value;
  const onChange = () => onChangeProp(!checked);
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.root} onPress={onChange}>
      <View style={styles.inputWrapper}>
        <Icon
          name={checked ? 'check-box' : 'check-box-outline-blank'}
          size={theme.measure.icon.medium}
          color={checked ? theme.palette.primary : theme.palette.black}
          style={commonStyles.marginRightGutter}
        />
        {!!label && <Text>{label}</Text>}
      </View>
      <View style={styles.helperTextWrapper}>
        {touched && error && (
          <Text align="right" style={styles.helperText} color="red">
            {error}
          </Text>
        )}
      </View>
    </TouchableOpacity>
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
  inputWrapper: {
    alignItems: 'center',
    // backgroundColor: '#eee',
    flexDirection: 'row',
    width: '100%',
  },

  root: {
    position: 'relative',
  },
});

export default CheckBox;
