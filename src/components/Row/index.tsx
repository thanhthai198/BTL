import React from 'react';
import { View } from 'react-native';
import * as theme from 'theme';

const Row = ({ reverse, justifyContent, style, ...other }: any) => (
  <View
    style={[
      // eslint-disable-next-line react-native/no-inline-styles
      {
        flexDirection: reverse ? 'row-reverse' : 'row',
        justifyContent: justifyContent,
        marginLeft: -theme.measure.gutter / 2,
        marginRight: -theme.measure.gutter / 2,
      },
      style,
    ]}
    {...other}
  />
);

export default Row;
