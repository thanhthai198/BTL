import { AppLayout } from 'layouts';
import React from 'react';
import BgRank from 'assets/img/rank-member.png';
import { Image, StyleSheet, View } from 'react-native';
import { Flex, Text, theme } from 'components';
import Avatar from 'components/Avatar';
import s from 'theme/commonStyles';
import AccountCard from '../components/AccountCard';
import { useNavigation } from '@react-navigation/native';
import Voucher from 'assets/img/voucher.png';
import Member from 'assets/img/member.png';
import { useSelector } from 'redux-store';
import { rgba } from 'polished';

const RankMember = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);

  return (
    <AppLayout title="Hạng thành viên" scrollEnabled>
      <View style={[s.paddingHorizontal]}>
        <View style={styles.rankCard}>
          <Image source={BgRank} resizeMode="cover" style={styles.rankCardBackground} />
          <View style={[s.paddingHorizontal2x, s.paddingVertical2x]}>
            <View style={[s.row, s.alignCenter, s.marginTopGutter, s.marginBottomGutter]}>
              <Avatar
                style={s.marginRightGutter}
                source={
                  user?.contact_profile_pic
                    ? { uri: user?.contact_profile_pic }
                    : require('assets/img/avatar.png')
                }
              />
              <View>
                <Text weight="bold" size={18}>
                  {user?.rank_info?.name}
                </Text>
                <Text size={16} weight="500">
                  {user?.contact_name}
                </Text>
              </View>
            </View>
            <Flex style={[s.marginBottomGutter2x]}>
              <View style={styles.range} />
              <Image source={Member} style={{ width: 20, height: 30 }} />
            </Flex>
          </View>
        </View>
      </View>
      <View style={[s.paddingHorizontal, styles.shadow, s.paddingVertical]}>
        <Text weight="500">
          Giờ đây, mỗi giao dịch trên AMG đều được tặng điểm thưởng. Bạn có thể dùng điểm này để đổi
          lấy rất nhiều quà tặng và ưu đãi hấp dẫn.
        </Text>
        <View style={[styles.score, styles.border]}>
          <Text size={16} weight="600" style={[s.marginBottomGutter]}>
            ĐIỂM CÓ THỂ SỬ DỤNG
          </Text>
          <Text
            size={24}
            weight="500"
            color="primary"
            style={[{ marginBottom: theme.measure.gutter / 2 }]}
          >
            {user?.rank_info?.current_score} ĐIỂM
          </Text>
          {/* <Text weight="500" color="gray">
          805 điểm sẽ hết hạn vào ngày 31/03/2020
        </Text> */}
        </View>
        <View style={[styles.rank]}>
          <Text size={16} weight="600" style={[s.marginBottomGutter]}>
            QUÁ TRÌNH TÍCH LŨY ĐIỂM
          </Text>
          <Flex style={[s.marginBottomGutter2x]}>
            <View style={styles.range} />
            <Image source={Member} />
          </Flex>

          <AccountCard
            title="Xem ưu đãi đang có"
            image={Voucher}
            onPress={() => navigation.navigate('Voucher')}
          />
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  border: {
    borderTopWidth: 0.6,
    borderBottomWidth: 0.6,
    borderColor: theme.getColor('borderSecondary'),
  },
  score: {
    paddingVertical: 15,
  },
  rankCard: {
    height: 200,
    marginTop: 10,
    marginHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  rankCardBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: -10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  rank: {
    paddingVertical: 15,
  },
  range: {
    flex: 1,
    height: 6,
    marginRight: 10,
    backgroundColor: rgba('#000', 0.2),
    borderRadius: 29,
  },
  shadow: {
    // height: '100%',
    // shadowColor: '#000',
    // shadowOpacity: 0.3,
    // shadowRadius: 10,
    // shadowOffset: { height: -4, width: 0 },
    // backgroundColor: theme.palette.backgroundSecondary,
  },
});
export default RankMember;
