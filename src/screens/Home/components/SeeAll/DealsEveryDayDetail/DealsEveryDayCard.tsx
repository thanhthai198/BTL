import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, theme } from 'components';
import Touchable from 'components/Touchable';

const ImgProduct = 'https://static.lalanow.com.vn/default_product.png';

interface Props {
  data?: any;
  onPress?: (data: any) => void;
}
function DealsEveryDayCard(props: Props) {
  const { onPress, data } = props;

  return (
    <Touchable style={styles.data} onPress={onPress}>
      <Image
        style={{
          width: '100%',
          height: 180,
          resizeMode: 'cover',
        }}
        source={{
          uri: data.image || ImgProduct,
        }}
      />
      <View style={{ marginTop: 11, marginHorizontal: 14 }}>
        <Text size={15} weight="600" numberOfLines={3}>
          {data.promotion_name}
        </Text>
        <Text color="#039477" size={14} weight="600">
          Xem chi tiết
        </Text>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  data: {
    backgroundColor: theme.palette.background,
    width: 350,
    height: 271,
    marginVertical: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
  },
});

export default DealsEveryDayCard;
