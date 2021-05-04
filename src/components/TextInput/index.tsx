import React, { FC } from 'react';
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { rgba } from 'polished';
import * as theme from 'theme';
import Text from '../Text';

interface TextInputProps extends RNTextInputProps {
  style?: any;
  inputStyle?: any;
  inputContainerStyle?: any;
  touched?: boolean;
  error?: string;
}

const TextInput: FC<TextInputProps> = ({
  keyboardType,
  secureTextEntry,
  placeholder,
  placeholderTextColor,
  blurOnSubmit = true,
  onSubmitEditing,
  style,
  inputStyle,
  inputContainerStyle,
  touched,
  error,
  ...others
}) => {
  return (
    <View style={[styles.root, style]}>
      <View
        style={[
          styles.inputWrapper,
          touched && error ? styles.inputError : {},
          inputContainerStyle,
        ]}
      >
        <RNTextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={placeholderTextColor || rgba(theme.palette.text.black, 0.5)}
          placeholder={placeholder}
          keyboardType={keyboardType}
          onSubmitEditing={onSubmitEditing}
          secureTextEntry={secureTextEntry}
          blurOnSubmit={blurOnSubmit}
          {...others}
        />
      </View>

      {touched && error && (
        <View style={styles.helperTextWrapper}>
          <Text align="right" style={styles.helperText} color="red">
            {error}
          </Text>
        </View>
      )}
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
  },
  inputError: {},
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

export default TextInput;
