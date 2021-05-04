import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Container, Text, theme } from 'components';
import s from 'theme/commonStyles';
import AccountCard from './components/AccountCard';
import Order from 'assets/img/donhang.png';
import Member from 'assets/img/member.png';
import Address from 'assets/img/vitri.png';
import Voucher from 'assets/img/voucher.png';
import Share from 'assets/img/share.png';
import Setting from 'assets/img/settings.png';
import Logout from 'assets/img/logout.png';
import Policy from 'assets/img/Policy.png';
import Version from 'assets/img/Version.png';
import { useNavigation } from '@react-navigation/native';
import { RootState, useSelector } from 'redux-store/store';
import { useDispatch } from 'react-redux';
import { setCurrentUser, setToken } from 'redux-store/auth';
import { DEFAULT_TITLE } from 'variables/response-messages';
import * as UserService from 'services/users';
import { removeSession } from 'utils/storage-helper';

const Account = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await removeSession();
    dispatch(setToken(''));
    dispatch(setCurrentUser(null));
    await UserService.logout();
    navigation.reset({ routes: [{ name: 'App' }] });
  };

  const getUserInfo = async () => {
    try {
      const res = await UserService.getUserInfo();
      if (res.status === 200) {
        dispatch(setCurrentUser({ ...user, ...res.data }));
      }
    } catch (error) {
      Alert.alert(DEFAULT_TITLE, '');
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Container>
      <View
        style={[
          styles.header,
          s.justifyCenter,
          { paddingTop: theme.measure.statusBarHeight + 20, paddingBottom: 20 },
        ]}
      >
        <Text size={22} weight="bold" style={[s.marginLeftGutter2x]}>
          Tài Khoản
        </Text>
      </View>
      <ScrollView
        style={styles.body}
        contentContainerStyle={[
          s.paddingHorizontal,
          s.paddingVertical,
          { paddingBottom: theme.measure.tabBarHeight },
        ]}
      >
        <AccountCard
          title={user?.contact_name || ''}
          desc={user?.contact_phone || ''}
          image={user?.contact_profile_pic}
          hasUri={true}
          onPress={() => navigation.navigate('AccountDetail')}
        />
        <AccountCard
          title="Đơn hàng"
          image={Order}
          onPress={() => navigation.navigate('Order', { type: 'ALL' })}
        />
        <AccountCard
          title={user?.rank_info?.name || ''}
          desc={`${user?.rank_info?.current_score || 0} điểm`}
          image={Member}
          onPress={() => navigation.navigate('Rank')}
        />
        <AccountCard
          title="Địa chỉ đã lưu"
          image={Address}
          onPress={() => navigation.navigate('Address')}
        />
        <AccountCard
          title="Tổng hợp các ưu đãi"
          image={Voucher}
          onPress={() => navigation.navigate('Voucher')}
        />
        <AccountCard
          title="Giới thiệu bạn bè"
          image={Share}
          onPress={() => Alert.alert('Thông báo', 'Chức năng sẽ sớm được cập nhật')}
        />
        <AccountCard
          title="Cài đặt"
          desc="Mật khẩu & Bảo mật"
          image={Setting}
          onPress={() => Alert.alert('Thông báo', 'Chức năng sẽ sớm được cập nhật')}
        />
        <AccountCard
          title="Chính sách"
          desc="Xem chi tiết tại đây"
          image={Policy}
          onPress={() => navigation.navigate('Policy')}
        />
        <AccountCard
          title="Hỏi đáp"
          image={Share}
          onPress={() => navigation.navigate('Communication')}
        />
        <AccountCard
          title="Đăng xuất"
          image={Logout}
          isSwitchScreen={false}
          onPress={handleLogout}
        />
        <AccountCard
          title="Thông tin phiên bản"
          image={Version}
          desc="1.0.0, cập nhật ngày 18/01/2021"
          isSwitchScreen={false}
        />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
  },
  body: {
    backgroundColor: theme.palette.backgroundSecondary,
  },
});

export default Account;
