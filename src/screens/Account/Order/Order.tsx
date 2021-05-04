import React, { FC, useCallback } from 'react';
import { AppLayout } from 'layouts';
import { StyleSheet, View } from 'react-native';
import OrderCardItem from './OrderCardItem';
import { useDispatch } from 'react-redux';
import { RootState, useSelector } from 'redux-store/store';
import { getListOrder } from 'redux-store/order';
import { OrderType } from 'models/order';
import s from 'theme/commonStyles';
import { EmptyData, theme } from 'components';
import { useFocusEffect } from '@react-navigation/native';

interface IOrder {
  route?: any;
  navigation?: any;
}
const Order: FC<IOrder> = ({ route, navigation }) => {
  const { type } = route.params || {};
  const dispatch = useDispatch();
  const { loading, order: ordersList } = useSelector((state: RootState) => state.order);

  useFocusEffect(
    useCallback(() => {
      console.log(navigation.isFocused());
      if (navigation.isFocused()) {
        dispatch(getListOrder(type));
      }
    }, [type])
  );

  return (
    <AppLayout
      title={type === 'BUSINESSORDER' ? 'Quà công ty' : 'Đơn hàng'}
      scrollEnabled
      backgroundColor={theme.getColor('layoutBackground')}
      loading={loading}
    >
      <View style={[styles.order, s.paddingHorizontal, s.paddingVertical]}>
        {ordersList?.length === 0 && <EmptyData />}

        {ordersList.map((order: OrderType) => {
          return <OrderCardItem key={`order-${order.id}`} data={order} />;
        })}
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  order: {},
});

export default Order;
