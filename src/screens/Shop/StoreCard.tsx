import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Flex, Icon, Text, theme } from 'components';
import Touchable from 'components/Touchable';
import s from 'theme/commonStyles';

interface Props {
  data?: any;
  onPress?: (data: any) => void;
}

function StoreCard(props: Props) {
  const { onPress, data } = props;
  return (
    <Touchable style={[s.marginBottomGutter]} onPress={onPress}>
      <View style={[s.flex, styles.root]}>
        <ImageBackground
          source={{ uri: 'https://static.lalanow.com.vn/lalanowYenPhong.jpg' }}
          resizeMode="cover"
          style={styles.bgStore}
        >
          <Text color="white" size={14} weight="500" style={[s.absolute, styles.timeOpen]}>
            08:00 - 23:00 (Đang mở cửa)
          </Text>
        </ImageBackground>
        <View style={[s.row, s.spaceBetween, s.paddingHorizontal, s.paddingVertical]}>
          <View>
            <Text size={15} weight="600" style={s.marginBottomGutter}>
              {data.store_name}
            </Text>
          </View>
          {/* <Text color="primary" size={13} weight="500">
            Cách bạn (1.5km)
          </Text> */}
        </View>
        <View style={[s.paddingHorizontal, { paddingBottom: theme.measure.gutter }]}>
          <Flex flexDirection="row" style={[s.flex]}>
            <Icon name="marker" size={14} color="gray" style={[s.marginRightGutter]} />
            <Flex style={[s.flex]}>
              <Text color="gray" size={14} weight="500">
                {data.address}
              </Text>
            </Flex>
          </Flex>
          {data.tenant.phone && (
            <Flex style={[s.marginTopGutter]}>
              <Icon name="phone" color="gray" style={[s.marginRightGutter]} />
              <Text color="gray" size={14} weight="500">
                {data.tenant.phone}
              </Text>
            </Flex>
          )}
        </View>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: theme.measure.gutter,
    backgroundColor: theme.getColor('white'),
    overflow: 'hidden',
  },
  bgStore: {
    minHeight: 200,
  },
  timeOpen: {
    bottom: theme.measure.gutter,
    left: theme.measure.gutter * 1.5,
  },
});

export default StoreCard;
