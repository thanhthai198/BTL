import { Button, Text, theme } from 'components';
import { AppLayout } from 'layouts';
import moment from 'moment';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import s from 'theme/commonStyles';
import QRImage from 'assets/img/QR.png';
import { rgba } from 'polished';

interface IVoucherItem {
  route?: any;
  navigation?: any;
}

const VoucherDetail: FC<IVoucherItem> = ({ route, navigation }) => {
  const { data } = route.params;
  const expireDate = moment(data.expire_at).format('DD/MM/YYYY');

  return (
    <AppLayout title="Thông tin voucher" scrollEnabled backgroundColor={theme.getColor('primary')}>
      <View style={[styles.detail, s.center]}>
        <Text size={18} weight="600" color="white" align="center">
          {data.promotion_name}
        </Text>
        <Text size={13} weight="500" color="white" align="center" style={[styles.expireDate]}>
          Hạn sử dụng: {expireDate}
        </Text>
        <View style={[s.center, s.marginBottomGutter2x]}>
          <Image source={QRImage} />
        </View>
        <Text align="center" size={36} weight="500" color="white">
          {data.promotion_no}
        </Text>

        {data.description && (
          <View style={styles.voucherInfo}>
            <Text color="white" weight="600" size={15} align="left" style={[s.marginBottomGutter]}>
              THÔNG TIN VOUCHER
            </Text>
            <Text color="white" size={13} weight="500">
              {data.description}
            </Text>
          </View>
        )}
        <Button
          textProps={{ color: 'primary' }}
          color="white"
          style={[styles.submit]}
          onPress={() => navigation.navigate('GoToMarket', { voucher: data })}
        >
          Sử dụng ngay
        </Button>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  detail: {
    paddingHorizontal: theme.measure.gutter3x,
    paddingVertical: theme.measure.gutter3x,
  },
  expireDate: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: rgba(theme.getColor('white'), 0.12),
    borderRadius: 4,
    marginTop: 25,
    marginBottom: 30,
    width: 'auto',
    zIndex: 99,
    overflow: 'hidden',
  },
  submit: {
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 40,
  },
  voucherInfo: {
    width: '100%',
    marginTop: theme.measure.gutter4x,
  },
});

export default VoucherDetail;
