import { Flex, Text, theme } from 'components';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import s from 'theme/commonStyles';
import { IVoucher } from 'models/voucher';
import moment from 'moment';
import Touchable from 'components/Touchable';
import { useNavigation } from '@react-navigation/native';

interface IVoucherItem {
  data: IVoucher;
}

const VoucherItem: FC<IVoucherItem> = ({ data }) => {
  console.log('abc=====', data);
  const navigation = useNavigation();
  const expireDate = moment(data.expire_at).format('DD/MM/YYYY');

  return (
    <Touchable onPress={() => navigation.navigate('VoucherDetail', { data })}>
      <Flex style={styles.item}>
        <Image
          source={{ uri: data.small_image }}
          style={[styles.discount, s.center]}
          resizeMode="cover"
        />
        <View style={[styles.content, s.flex]}>
          <Text size={15} weight="600" style={[s.flex]}>
            {data.promotion_name}
          </Text>
          <Flex justifyContent="space-between">
            <Text size={13}>HSD: {expireDate}</Text>
            <Touchable onPress={() => navigation.navigate('GoToMarket', { voucher: data })}>
              <Text size={13} weight="600" color="primary">
                Sử dụng
              </Text>
            </Touchable>
          </Flex>
        </View>
      </Flex>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  discount: {
    minWidth: 150,
    height: 150,
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  item: {
    flex: 1,
    backgroundColor: theme.getColor('white'),
    borderRadius: 6,
    marginBottom: 15,
  },
});

export default VoucherItem;
