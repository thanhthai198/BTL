import React from 'react';
import { Text as RNText, StyleSheet, TextProps as RNTextProps, TextStyle } from 'react-native';
import * as theme from 'theme';

export interface TextProps extends RNTextProps {
  align?: TextStyle['textAlign'];
  color?: theme.TextColorKeyType | string;
  italic?: boolean;
  size?: number;
  variant?: string;
  weight?: TextStyle['fontWeight'];
  textDecorationLine?: TextStyle['textDecorationLine'];
}

const Text = ({ align, color, italic, size, style, weight, textDecorationLine, ...other }: any) => {
  return (
    <RNText
      allowFontScaling={false}
      style={[
        styles.textBaseStyles,
        {
          color: theme.getTextColor(color || 'black'),
          fontSize: theme.getFontSize(size),
          fontFamily: theme.getFontFamily({
            fontStyle: italic ? 'italic' : 'normal',
            fontWeight: weight,
          }),
          fontWeight: weight,
          lineHeight: theme.getLineHeight(size),
          textAlign: align,
          textDecorationLine,
        },
        style,
      ]}
      {...other}
    />
  );
};

const styles = StyleSheet.create({
  textBaseStyles: {
    color: theme.getTextColor('black'),
    fontSize: theme.getFontSize('normal'),
    fontFamily: theme.getFontFamily({
      fontStyle: 'normal',
      fontWeight: '400',
    }),
  },
});

export default Text;
