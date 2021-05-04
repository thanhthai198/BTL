import React, { FC } from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { rgba } from 'polished';
import Text, { TextProps } from '../Text';
import * as theme from 'theme';

interface ButtonProps extends TouchableOpacityProps {
  color?: theme.ColorKeyType;
  variant?: string;
  outline?: boolean;
  fullWidth?: boolean;
  textProps?: TextProps;
  style?: any;
  width?: number;
  small?: boolean;
  medium?: boolean;
}

const Button: FC<ButtonProps> = ({
  color = 'primary',
  variant,
  fullWidth = true,
  children,
  textProps: externalTextProps,
  style,
  width,
  small,
  medium,
  ...other
}) => {
  const buttonStyles = [styles.button, small ? styles.small : {}, medium ? styles.medium : {}];
  const textProps = {
    color: 'white',
    size: small || medium ? 'tiny' : 'medium',
    weight: '600',
  } as TextProps;

  if (fullWidth) {
    buttonStyles.push(styles.fullWidth);
  }

  const themeColor = theme.getColor(color || 'primary');
  switch (variant) {
    case 'outline':
      buttonStyles.push(styles.outline);
      buttonStyles.push({
        borderColor: themeColor,
        borderWidth: theme.measure.borderWidth,
      });
      textProps.color = themeColor;
      break;
    case 'clear':
      buttonStyles.push(styles.clear);
      textProps.color = themeColor;
      break;
    case 'opacity-bg':
      buttonStyles.push({
        backgroundColor: rgba(themeColor, 0.1),
      });
      textProps.color = themeColor;
      break;
    case 'text':
      buttonStyles.push(styles.textButton);
      textProps.color = theme.getTextColor(color);
      // textProps.style = styles.textButtonLabel;
      break;
    default:
      buttonStyles.push(styles.solid);
      buttonStyles.push({
        backgroundColor: themeColor,
      });
  }

  return (
    <TouchableOpacity
      style={[buttonStyles, width ? { flex: 0, width } : {}, style]}
      activeOpacity={0.8}
      {...other}
    >
      {typeof children === 'string' ? (
        <Text {...textProps} {...externalTextProps}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: theme.measure.buttonHeight.large / 2,
    flexDirection: 'row',
    height: theme.measure.buttonHeight.large,
    justifyContent: 'center',
  },
  outline: {},
  clear: {},
  solid: {},
  textButton: { padding: 0, height: 'auto', width: 'auto' },
  // textButtonLabel: {},
  fullWidth: {
    width: '100%',
  },
  small: {
    borderRadius: theme.measure.buttonHeight.small / 2,
    height: theme.measure.buttonHeight.small,
    paddingHorizontal: theme.measure.gutter2x,
  },
  medium: {
    borderRadius: theme.measure.buttonHeight.medium / 2,
    height: theme.measure.buttonHeight.medium,
    paddingHorizontal: theme.measure.gutter2x,
  },
});

export default Button;
