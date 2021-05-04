import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import * as theme from 'theme';
import commonStyles from 'theme/commonStyles';

interface AvatarProps {
  size?: 'large' | 'medium' | 'small';
  style?: any;
  source: ImageSourcePropType;
}

const Avatar = ({ source, size = 'medium', style: cusStyle }: AvatarProps) => {
  return (
    <View
      style={[
        commonStyles.center,
        {
          backgroundColor: theme.palette.gray,
          borderRadius: theme.measure.avatar[size] / 2,
          height: theme.measure.avatar[size],
          width: theme.measure.avatar[size],
        },
        cusStyle,
      ]}
    >
      <Image
        resizeMode="cover"
        source={source}
        style={[styles.avatar, { borderRadius: theme.measure.avatar[size] / 2 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: '100%',
    width: '100%',
  },
});

export default Avatar;
