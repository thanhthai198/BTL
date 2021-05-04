import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment, { getDate, getDateForApi } from 'utils/datetime';
import { rgba } from 'polished';
import * as theme from 'theme';
import Text from '../Text';

const DatePicker = ({ value, touched, error, onChange, placeholder, onBlur }: any) => {
  // const [focused, setFocused] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    // setFocused(true);
    // onFocus(restInput.value);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    // setFocused(false);
    onChange(getDateForApi(date));
    onBlur && onBlur();
    // onBlur(getDateForApi(date));
    hideDatePicker();
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity activeOpacity={1} style={styles.inputWrapper} onPress={showDatePicker}>
        <View style={styles.input}>
          {value ? (
            <Text>{getDate(value)}</Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
        </View>
      </TouchableOpacity>
      {console.log(touched, error)}
      <View style={styles.helperTextWrapper}>
        {touched && error && (
          <Text align="right" style={styles.helperText} color="red">
            {error}
          </Text>
        )}
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={moment().toDate()}
        date={moment(value).toDate()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  helperText: {
    fontSize: 13,
  },
  helperTextWrapper: {
    justifyContent: 'center',
  },
  placeholder: {
    color: rgba(theme.palette.text.black, 0.5),
  },
  input: {
    color: theme.palette.text.black,
    fontSize: theme.getFontSize('medium'),
    fontFamily: theme.getFontFamily({ fontWeight: '600' }),
    width: '100%',
    height: theme.measure.inputHeight,
    borderRadius: theme.measure.inputHeight / 2,
    backgroundColor: rgba(theme.palette.black, 0.12),
    paddingVertical: 5,
    paddingHorizontal: 15,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: '100%',
  },
  root: {
    position: 'relative',
    marginBottom: theme.measure.gutter,
  },
});

export default DatePicker;
