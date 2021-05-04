import React from 'react';
import { StyleSheet, ViewStyle, Image, Dimensions } from 'react-native';
import { rgba } from 'polished';
import Touchable from 'components/Touchable';
import Text from 'components/Text';
// import Icon from 'components/Icon';
import * as theme from 'theme';

interface CategoryItemProps {
  style?: ViewStyle;
  label: string;
  isActive?: boolean;
  onPress: any;
  thumbnail?: string;
}

const { width } = Dimensions.get('screen');
const itemGutter = 3;
const itemWidth = (width - theme.measure.gutter * 2 - itemGutter * 4) / 3;

const CategoryItem = ({ style, label, thumbnail, onPress, isActive }: CategoryItemProps) => {
  return (
    <Touchable
      style={[
        styles.touchableOpacity,
        { borderColor: isActive ? rgba(theme.palette.primary, 0.35) : 'transparent' },
        style,
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: thumbnail, width: 30, height: 30 }} resizeMode="contain" />
      {/* <Icon name={icons[categoryNo]} size={30} color={isActive ? '#fff' : theme.palette.primary} /> */}
      <Text size={12} weight="bold" style={styles.text} align="center">
        {label}
      </Text>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    width: itemWidth,
    height: 90,
    borderRadius: 8,
    margin: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: itemGutter,
    backgroundColor: rgba(theme.palette.primary, 0.15),
    padding: 10,
    borderWidth: 1,
  },
  text: {
    marginTop: theme.measure.gutter / 2,
  },
});

export default CategoryItem;
