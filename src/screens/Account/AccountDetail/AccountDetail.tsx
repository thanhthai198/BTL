import { useNavigation } from '@react-navigation/native';
import React from 'react';
import moment from 'moment';
import { View, StyleSheet, Image } from 'react-native';
import { theme } from 'components';
import { Text } from 'components';
import Avatar from 'assets/img/avatar.png';
import s from 'theme/commonStyles';
import { AppLayout } from 'layouts';
import { RootState, useSelector } from 'redux-store/store';
import { DATE_FORMAT } from 'variables';

const AccountDetail = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);

  function checkGender(gender: string) {
    switch (gender) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      case 'other':
        return 'Khác';
    }
  }

  return (
    <AppLayout
      right="Sửa"
      title="Thông tin"
      onPressRight={() => navigation.navigate('UpdateAccount')}
      backgroundColor={theme.palette.layoutBackground}
    >
      <View style={[styles.header, s.center, s.shadowItem, s.paddingVertical]}>
        <Image
          style={[styles.avatar, s.marginBottomGutter]}
          source={user?.contact_profile_pic ? { uri: user?.contact_profile_pic } : Avatar}
        />
        <Text size={18} weight="600">
          {user?.contact_name}
        </Text>
        <Text size={14} weight="500" color="gray">
          {user?.rank_info?.name}
        </Text>
      </View>

      <View style={[styles.body, s.paddingHorizontal2x]}>
        <View style={[styles.view, s.row, s.spaceBetween, s.marginBottomGutter]}>
          <View style={[s.flex, s.center]}>
            <Text color="gray" size={14} weight="500">
              Điểm hội viên hiện có
            </Text>
            <Text color="primary" size={22} weight="500">
              {user?.rank_info?.current_score || 0}
            </Text>
          </View>
          <View style={styles.afterView} />
          <View style={[s.flex, s.center]}>
            <Text color="gray" size={14} weight="500">
              Đơn hàng đã mua
            </Text>
            <Text color="primary" size={22} weight="500">
              {user?.totalOrder || 0}
            </Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text size={14} weight-="500" color="gray">
            Số điện thoại
          </Text>
          <Text size={16} weight="500">
            {user?.contact_phone}
          </Text>
        </View>
        <View style={styles.info}>
          <Text size={14} weight-="500" color="gray">
            Email
          </Text>
          <Text size={16} weight="500">
            {user?.contact_email || '--'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text size={14} weight-="500" color="gray">
            Ngày sinh
          </Text>
          <Text size={16} weight="500">
            {user.birthday && moment(user.birthday, DATE_FORMAT.vi).isValid()
              ? moment(user.birthday, DATE_FORMAT.vi).format(DATE_FORMAT.vi)
              : '--'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text size={14} weight-="500" color="gray">
            Nghề nghiệp
          </Text>
          <Text size={16} weight="500">
            {user?.job || '--'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text size={14} weight-="500" color="gray">
            Giới tính
          </Text>
          <Text size={16} weight="500">
            {checkGender(user?.contact_gender) || '--'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text size={14} weight-="500" color="gray">
            Địa chỉ
          </Text>
          <Text size={16} weight="500">
            {user?.contact_address}
          </Text>
        </View>
        <View style={styles.info}>
          <Text size={14} weight-="500" color="gray">
            Công ty đang làm việc
          </Text>
          <Text size={16} weight="500">
            {user?.workplace || '--'}
          </Text>
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 7,
    paddingTop: theme.measure.gutter,
    // backgroundColor: '#F5F5F5',
  },
  header: {
    flex: 2,
    backgroundColor: theme.getColor('white'),
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  view: {
    backgroundColor: theme.getColor('white'),
    borderRadius: 15,
    paddingVertical: theme.measure.gutter * 1.5,
  },
  afterView: {
    height: 38,
    width: 1,
    backgroundColor: '#F5F5F5',
  },
  info: {
    borderBottomColor: '#E4E4E4',
    borderBottomWidth: 1,
    paddingVertical: theme.measure.gutter,
  },
});

export default AccountDetail;
