import React, { FC, useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { rgba } from 'polished';
import * as theme from 'theme';
import Text from '../Text';

interface CodeInputProps {
  style?: any;
  inputStyle?: any;
  inputContainerStyle?: any;
  touched?: boolean;
  error?: string;
  onSubmit: () => void;
  onChange: (newValue: string) => void;
}

const CodeInput: FC<CodeInputProps> = ({ onSubmit, onChange }) => {
  const [code, setCode] = useState('');
  const input = useRef<any>(null);
  const onInputChange = (newValue: string) => {
    setCode(newValue);
    onChange && onChange(newValue);
  };
  const onTouchablePress = () => {
    input.current.blur();
    input.current.focus();
  };
  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={onTouchablePress}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={input}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            style={styles.inputHidden}
            onChangeText={onInputChange}
            maxLength={4}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            autoFocus
          />
          <View style={[styles.inputWrapper, styles.inputCodeContainer]}>
            {[0, 1, 2, 3].map(number => {
              const value = code[number];
              const active = number === code.length || (code.length === 4 && number === 3);
              return (
                <View
                  style={[styles.inputCode, active ? styles.activeInput : {}]}
                  key={`input-code-${number}`}
                >
                  <Text size={24} color={value ? 'black' : 'gray'}>
                    {value || ''}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.measure.gutter2x,
  },
  activeInput: {
    borderColor: theme.palette.primary,
  },
  inputHidden: {
    position: 'absolute',
    left: '40%',
    zIndex: -1,
  },
  inputCodeContainer: {
    backgroundColor: '#ffffff',
  },
  inputCode: {
    alignItems: 'center',
    height: theme.measure.inputHeight,
    justifyContent: 'center',
    width: theme.measure.inputHeight,
    borderRadius: theme.measure.inputRadius,
    backgroundColor: rgba(theme.palette.black, 0.12),
    borderColor: rgba(theme.palette.black, 0.12),
    borderWidth: 1,
  },
  inputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.measure.gutter,
    paddingHorizontal: theme.measure.gutter2x,
    width: '100%',
  },
});

export default CodeInput;
