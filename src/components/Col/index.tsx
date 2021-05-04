import React from 'react';
import { View } from 'react-native';
import * as theme from 'theme';

const Col = ({ col, ...other }: any) => (
  <View
    style={{
      flexBasis: `${100 / (12 / col)}%`,
      paddingLeft: theme.measure.gutter / 2,
      paddingRight: theme.measure.gutter / 2,
    }}
    {...other}
  />
);

export default Col;
