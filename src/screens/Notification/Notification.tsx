import { AppLayout } from 'layouts';
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import FilterIcon from 'assets/img/boloc.png';
// import NotificationItem from './components/NotificationItem';
import s from 'theme/commonStyles';
import { EmptyData, theme } from 'components';

const Notification = () => {
  return (
    <AppLayout
      scrollEnabled
      title="Thông báo"
      right={<Image source={FilterIcon} />}
      style={{ backgroundColor: theme.palette.backgroundSecondary }}
    >
      <View style={[styles.body, s.paddingVertical]}>
        {/* <NotificationItem
          title="Đây là thông báo Quà gửi từ công ty về cho công nhân"
          image="home"
          time="1 phút trước"
        />
        <NotificationItem
          title="Mừng sinh nhật, LaLaNOW tặng bạn 1 voucher 500K trừ vào hóa đơn"
          image="cart"
          time="1 phút trước"
        /> */}
        <EmptyData />
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: theme.measure.gutter * 1.5,
  },
});

export default Notification;
