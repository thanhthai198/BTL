import React, { FC } from 'react';
import { Text, theme, Icon } from 'components';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import { NotificationItemProps } from './models';
import s from 'theme/commonStyles';

const NotificationItem: FC<NotificationItemProps> = props => {
  const { title, image, time } = props;
  return (
    <View style={[styles.item, s.row, s.alignCenter, s.marginBottomGutter, s.shadowItem]}>
      {typeof image === 'string' ? (
        <Icon name={image} size={46} color={theme.getColor('primary')} />
      ) : (
        <View>{image}</View>
      )}
      <View style={[s.marginLeftGutter2x, s.flex]}>
        <Text size={15} weight="600" style={[s.marginBottomGutter]}>
          {title}
        </Text>
        <Text size={13} weight="normal" color="gray">
          {time}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    backgroundColor: theme.getColor('white'),
    borderRadius: 10,
    padding: 14,
  },
});

export default NotificationItem;
