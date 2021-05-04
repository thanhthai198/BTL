import { Icon, Text, theme, Flex, NumberFormatter } from 'components';
import React, { FC } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import s from 'theme/commonStyles';
import DeliveryImg from 'assets/img/delivery.png';
import { OrderType } from 'models/order';
import Touchable from 'components/Touchable';
import { useNavigation } from '@react-navigation/native';
import * as OrderService from 'services/order';
import { getOrderDetail } from 'redux-store/order';
import { useDispatch } from 'react-redux';
import moment from 'moment';

interface IProps {
  data: OrderType;
}
const OrderCardItem: FC<IProps> = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { data } = props;
  const {
    _id,
    amount,
    salesorder_status,
    salesorder_source,
    salesorder_no,
    order_datetime,
    order_hour,
    order_minute,
  } = data;

  function renderItems() {
    return <View />;
  }

  const handleOrderDetail = (id: string) => async () => {
    dispatch(getOrderDetail(id));
    const res = await OrderService.getOrderOnlineDetail(id);
    if (res.status === 200) {
      navigation.navigate('OrderDetail');
    }
  };

  return (
    <Touchable
      style={[styles.item, s.shadowItem, s.marginBottomGutter]}
      onPress={handleOrderDetail(_id)}
    >
      <Flex justifyContent="flex-start">
        {salesorder_source === 'APPMOBILE' && <Image source={DeliveryImg} resizeMode="cover" />}
        <View style={[s.flex, s.marginLeftGutter]}>
          <Flex justifyContent="space-between" style={[s.marginBottomGutter2x]}>
            <Flex alignItems="center">
              {salesorder_source === 'BUSINESSORDER' && (
                <Icon
                  name="qua-cty"
                  color={theme.getColor('primary')}
                  size={20}
                  style={[s.marginRightGutter]}
                />
              )}
              <Text size={14} weight="500" color="primary">
                {salesorder_source === 'BUSINESSORDER'
                  ? 'Quà từ công ty'
                  : salesorder_no?.toUpperCase()}
              </Text>
            </Flex>
            {salesorder_status === 'delivery' && (
              <Text size={14} weight="500" color="#3173BF">
                Đang giao hàng
              </Text>
            )}
            {salesorder_status === 'accept' && (
              <Text size={14} weight="500" color="#FB9804">
                Chờ xác nhận
              </Text>
            )}
            {salesorder_status === 'completed' && (
              <Text size={14} weight="500" color="#AAAAAA">
                Đã giao
              </Text>
            )}
            {salesorder_status === 'confirm' && (
              <Text size={14} weight="500" color="primary">
                Đã xác nhận
              </Text>
            )}
            {salesorder_status === 'cancel' && (
              <Text size={14} weight="500" color="red">
                Đã hủy
              </Text>
            )}
          </Flex>

          <Flex justifyContent="space-between" alignItems="flex-end">
            {salesorder_source === 'APPMOBILE' ? (
              <Text size={13} weight="500" color="secondary">
                {moment(order_datetime)
                  .hour(order_hour || 0)
                  .minute(order_minute || 0)
                  .format('DD-MM-YYYY HH:mm')}
              </Text>
            ) : (
              renderItems()
            )}
            <Text size={14} weight="500">
              Tổng tiền: {''}
              <NumberFormatter value={+amount} size={13} suffix="đ" color="primary" />
            </Text>
          </Flex>
        </View>
      </Flex>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: theme.palette.background,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
export default OrderCardItem;
