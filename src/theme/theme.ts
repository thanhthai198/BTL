import { Platform, StatusBar, StyleSheet } from 'react-native';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper';

const isIOS = Platform.OS === 'ios';
const bottomGutter = isIOS ? getBottomSpace() : 20;
const topGutter = !isIOS ? StatusBar.currentHeight : getStatusBarHeight(true);

export interface MeasureObject {
  [key: string]: number;
}
export type Measure = {
  avatar: MeasureObject;
  appIcon: MeasureObject;
  borderRadius: number;
  borderWidth: number;
  hairlineWidth: number;
  buttonHeight: MeasureObject;
  buttonRadius: number;
  buttonIcon: MeasureObject;
  cover: MeasureObject;
  accountTypeItem: MeasureObject;
  font: MeasureObject;
  gutter: number;
  gutter2x: number;
  gutter3x: number;
  gutter4x: number;
  icon: MeasureObject;
  inputHeight: number;
  inputRadius: number;
  tabBarHeight: number;
  tabBarRadius: number;
  tabHeight: number;
  statusBarHeight: number;
  bottomGutter: number;
  headerBarHeight: number;
};

export interface Palette {
  background: string;
  backgroundSecondary: string;
  layoutBackground?: string;
  black: string;
  primary: string;
  tabBackground: string;
  tabbarInactiveIcon: string;
  orange: string;
  red: string;
  white: string;
  gray: string;
  border: string;
  borderSecondary: string;
  text: {
    primary: string;
    secondary: string;
    black: string;
    white: string;
    orange: string;
    red: string;
    gray: string;
  };
}

const fontFamily = 'System';

export type ColorKeyType =
  | 'background'
  | 'black'
  | 'primary'
  | 'tabBackground'
  | 'tabbarInactiveIcon'
  | 'orange'
  | 'red'
  | 'white'
  | 'gray';
export type TextColorKeyType = 'white' | 'black' | 'primary' | 'red' | 'orange' | 'gray';

export const palette: Palette = {
  background: '#fff',
  backgroundSecondary: '#e7e7e7',
  layoutBackground: '#F5F5F5',
  black: '#363636',
  primary: '#039447',
  tabBackground: 'rgba(248, 248, 248, 0.92)',
  tabbarInactiveIcon: '#A3A3A3',
  orange: '#F8B019',
  red: '#CF2F2F',
  white: '#ffffff',
  gray: '#808080',
  border: '#E9E9E9',
  borderSecondary: '#E4E4E4',
  text: {
    primary: '#039447',
    secondary: '#AAAAAA',
    black: '#363636',
    orange: '#F8B019',
    red: '#CF2F2F',
    white: '#ffffff',
    gray: '#808080',
  },
};

export const measure: Measure = {
  avatar: {
    large: 90,
    semiLarge: 70,
    medium: 48,
    small: 27,
  },

  appIcon: {
    small: 20,
    medium: 35,
  },

  borderRadius: 8,
  borderWidth: 1,
  hairlineWidth: StyleSheet.hairlineWidth,

  buttonHeight: {
    large: 50,
    medium: 34,
    small: 26,
  },
  buttonRadius: 4,
  buttonIcon: {
    normal: 30,
    small: 24,
  },

  cover: {
    width: 900,
    height: 300,
  },

  accountTypeItem: {
    width: 122,
    height: 122,
  },

  font: {
    max: 28,
    large: 24,
    medium: 16,
    size18: 18,
    size20: 20,
    normal: 14,
    tips: 13,
    tiny: 12,
    minimum: 10,
  },

  gutter: 10,
  gutter2x: 20,
  gutter3x: 30,
  gutter4x: 40,

  icon: {
    large: 30,
    semiLarge: 27,
    medium: 24,
    normal: 20,
    small: 15,
    tiny: 12,
  },

  inputHeight: 46,
  inputRadius: 10,
  tabBarHeight: 40 + bottomGutter,
  tabBarRadius: 12,
  tabHeight: 38,
  headerBarHeight: 60,
  statusBarHeight: topGutter as number,
  bottomGutter,
};

export const getColor = (color: ColorKeyType | string) => palette[color as ColorKeyType] || color;

export const getTextColor = (color: TextColorKeyType | string) =>
  palette.text[color as TextColorKeyType] || color;

export const getFontFamily = ({ fontStyle = 'normal', fontWeight = '400' }) => {
  if (isIOS) {
    return fontFamily;
  }

  const fontStyleName = fontStyle === 'italic' ? 'Italic' : '';
  let fontWeightName = 'Regular';
  switch (fontWeight) {
    case '100':
      fontWeightName = 'Thin';
      break;
    case '200':
      fontWeightName = 'ExtraLight';
      break;
    case '300':
      fontWeightName = 'Light';
      break;
    case '400':
      fontWeightName = 'Regular';
      break;
    case '500':
      fontWeightName = 'Medium';
      break;
    case '600':
      fontWeightName = 'SemiBold';
      break;
    case '700':
      fontWeightName = 'Bold';
      break;
    case '800':
      fontWeightName = 'Black';
      break;
    case '900':
      fontWeightName = 'Black';
      break;
    default:
      fontWeightName = 'Regular';
      break;
  }
  return `${fontFamily} ${fontWeightName} ${fontStyleName}`.trim();
};

export const getFontSize: (size: string | number) => number = (size = 'normal') => {
  if (typeof size === 'string') {
    return measure.font[size];
  }
  if (typeof size === 'number') {
    return size;
  }

  return measure.font.normal;
};

export const getLineHeight = (size = 'normal') => {
  if (typeof size === 'string') {
    return measure.font[size] * 1.5;
  }
  if (typeof size === 'number') {
    return size * 1.5;
  }

  return measure.font.normal * 1.5;
};

const theme = {
  getColor,
  getFontFamily,
  getFontSize,
  getLineHeight,
  getTextColor,
  measure,
  palette,
};

export default theme;
