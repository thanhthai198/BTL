import React from 'react';
import { View, Image } from 'react-native';
import s from 'theme/commonStyles';
import Text from '../Text';

export const EmptyData = () => (
  <View style={[s.alignCenter, s.justifyCenter]}>
    <Image
      source={require('assets/img/empty.png')}
      style={{ width: 150, height: 150 }}
      resizeMode="contain"
    />
    <Text>Chưa có dữ liệu</Text>
  </View>
);
