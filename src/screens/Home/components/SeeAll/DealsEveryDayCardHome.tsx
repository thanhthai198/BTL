import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, theme } from 'components';
import Touchable from 'components/Touchable';

const ImgProduct = 'https://static.lalanow.com.vn/default_product.png';

interface Props {
  data?: any;
  onPress?: (data: any) => void;
}
function DealsEveryDayCardHome(props: Props) {
  const { onPress, data } = props;

  return (
    <Touchable style={styles.data} onPress={onPress}>
      <Image
        style={{
          width: '100%',
          height: 108,
          resizeMode: 'cover',
        }}
        source={{
          uri: data.image || ImgProduct,
        }}
      />
      <View style={{ marginTop: 3, marginHorizontal: 3 }}>
        <Text size={13} weight="500" numberOfLines={3}>
          {data.promotion_name}
        </Text>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  data: {
    backgroundColor: theme.palette.background,
    width: 192,
    height: 148,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});

export default DealsEveryDayCardHome;
