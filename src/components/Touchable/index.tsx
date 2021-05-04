import React, { FC } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

const Touchable: FC<TouchableOpacityProps> = props => {
  return <TouchableOpacity activeOpacity={0.8} {...props} />;
};

export default Touchable;
