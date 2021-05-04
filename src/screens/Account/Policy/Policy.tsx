import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppLayout } from 'layouts';
import AccountCard from '../components/AccountCard';
import { useNavigation } from '@react-navigation/native';

const Policy = () => {
  const navigation = useNavigation();
  return (
    <AppLayout title="Chính sách mua hàng" scrollEnabled>
      <View style={styles.container}>
        <AccountCard
          title="Chính sách mua bán"
          desc="Xem chi tiết tại đây"
          image={null}
          onPress={() => navigation.navigate('Purchase')}
        />
        <AccountCard
          title="Chính sách bảo mật"
          desc="Xem chi tiết tại đây"
          image={null}
          onPress={() => navigation.navigate('Security')}
        />
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Policy;
