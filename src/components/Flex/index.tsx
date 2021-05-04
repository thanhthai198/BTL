import React, { ReactNode } from 'react';
import { View } from 'react-native';
import s from 'theme/commonStyles';

interface IProps {
  reverse?: boolean;
  flexDirection?: 'row' | 'column';
  justifyContent?: 'center' | 'space-between' | 'space-around' | 'flex-end' | 'flex-start';
  alignItems?: 'center' | 'flex-end' | 'flex-start' | 'space-between' | 'space-around';
  flex?: any;
  style?: any;
  children: ReactNode;
}

const Flex = ({
  reverse,
  flexDirection = 'row',
  justifyContent = 'flex-start',
  alignItems = 'center',
  children,
  style,
  flex,
  ...other
}: IProps) => {
  return (
    <View
      style={[
        {
          flexDirection,
          justifyContent,
          alignItems,
          flex,
        },

        reverse ? s.rowReverse : s.row,
        style,
      ]}
      {...other}
    >
      {children}
    </View>
  );
};

export default Flex;
