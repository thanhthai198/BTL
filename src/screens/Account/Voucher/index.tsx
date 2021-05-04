import { EmptyData, theme } from 'components';
import { AppLayout } from 'layouts';
import { IVoucher } from 'models/voucher';
import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { useSelector } from 'redux-store/store';
import { getAllVoucher } from 'redux-store/voucher';
import VoucherItem from './VoucherItem';
import s from 'theme/commonStyles';

const Voucher = () => {
  const dispatch = useDispatch();
  const { voucherList, loading } = useSelector(state => state.voucher);

  useEffect(() => {
    dispatch(getAllVoucher());
  }, []);
  return (
    <AppLayout
      title="Ưu đãi của bạn"
      scrollEnabled
      style={[{ backgroundColor: theme.palette.layoutBackground }]}
    >
      <View style={styles.voucher}>
        {voucherList.filter((item: any) => item.status === 'active').length === 0 && <EmptyData />}
        {!!loading && <ActivityIndicator color={theme.palette.gray} style={[s.paddingVertical]} />}
        {voucherList
          .filter((item: any) => item.status === 'active')
          .map((voucher: IVoucher) => (
            <VoucherItem key={voucher.id} data={voucher} />
          ))}
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  voucher: {
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
});
export default Voucher;
