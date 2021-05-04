import { Icon, Text, theme } from 'components';
import Avatar from 'components/Avatar';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import s from 'theme/commonStyles';
import AvatarImg from 'assets/img/avatar.png';

interface IProps {
  title: string;
  desc?: string;
  image: any;
  onPress?: () => void;
  hasUri?: boolean;
  isSwitchScreen?: boolean;
}

const AccountCard: FC<IProps> = props => {
  const { image, title, desc, onPress, hasUri = false, isSwitchScreen = true } = props;
  console.log('desc', desc);
  return (
    <TouchableOpacity
      style={[
        styles.carts,
        s.paddingHorizontal,
        s.paddingVertical,
        s.row,
        s.spaceBetween,
        s.alignCenter,
        s.marginBottomGutter,
      ]}
      activeOpacity={1}
      onPress={onPress}
    >
      <View style={[s.row, s.alignCenter]}>
        <View style={[styles.avatar, s.marginRightGutter, s.center]}>
          {hasUri ? (
            <Avatar source={image ? { uri: image } : AvatarImg} />
          ) : (
            <Image source={image} />
          )}
        </View>
        <View>
          <Text size={16} weight="600">
            {title}
          </Text>
          <Text size={13} weight="500" color="secondary">
            {desc || ''}
          </Text>
        </View>
      </View>
      {isSwitchScreen && <Icon name="chevron-right" size={18} color={theme.getColor('primary')} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  carts: {
    backgroundColor: theme.getColor('white'),
    borderRadius: 10,
  },
  avatar: {
    borderRadius: 25,
    width: theme.measure.avatar.medium,
    height: theme.measure.avatar.medium,
    overflow: 'hidden',
  },
});

export default AccountCard;
