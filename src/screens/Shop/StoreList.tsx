import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { EmptyData, theme } from 'components';
import s from 'theme/commonStyles';
import StoreCard from './StoreCard';
import { AppLayout } from 'layouts';
import { getStores } from 'services/order';

const StoreList = ({ navigation }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [stores, setStores] = useState<any[]>([]);

  const onPressStore = (item: any) => () => {
    navigation.navigate('StoreDetail', { data: item });
  };
  const renderItem = ({ item }: any) => <StoreCard data={item} onPress={onPressStore(item)} />;

  const getStoreList = async () => {
    setLoading(true);
    try {
      const result = await getStores();
      setStores(result.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStoreList();
  }, []);

  return (
    <AppLayout scrollEnabled title="Cửa hàng" right={<View style={s.marginRightGutter2x} />}>
      <View style={styles.body}>
        <FlatList
          ListFooterComponent={() =>
            !!loading && (
              <ActivityIndicator color={theme.palette.gray} style={[s.paddingVertical]} />
            )
          }
          ListEmptyComponent={() => <EmptyData />}
          data={stores}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
        />
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 8,
    padding: theme.measure.gutter,
    backgroundColor: theme.palette.backgroundSecondary,
    height: Dimensions.get('window').height,
  },
});

export default StoreList;
