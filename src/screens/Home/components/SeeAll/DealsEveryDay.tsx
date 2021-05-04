import React from 'react';
import { StyleSheet, View, Image, FlatList, ActivityIndicator } from 'react-native';
import { useSelector } from 'redux-store';
import Container from 'components/Container';
import commonStyles from 'theme/commonStyles';
import goBack from 'assets/img/icon_come_back.png';
import { EmptyData, Text } from 'components';
import Touchable from 'components/Touchable';
import DealsEveryDayCard from './DealsEveryDayDetail/DealsEveryDayCard';

const DealsEveryDay = ({ navigation }: any) => {
  const isLoading = useSelector(state => state.product?.loading);
  const promotionsProduct = useSelector(state => state.product?.promotionsProducts || []);

  const onPressStore = (item: any) => () => {
    navigation.navigate('DealsEveryDayCardDetail', { data: item });
  };
  const renderItem = ({ item }: any) => (
    <DealsEveryDayCard data={item} onPress={onPressStore(item)} />
  );

  return (
    <>
      <Container style={styles.root}>
        <View style={styles.header}>
          {navigation.canGoBack() && (
            <Touchable
              hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
              onPress={navigation.goBack}
            >
              <Image style={[commonStyles.marginLeftGutter2x]} source={goBack} />
            </Touchable>
          )}
          <Text size={18} weight="600">
            Ưu đãi mỗi ngày
          </Text>
          <View style={commonStyles.marginRightGutter3x} />
        </View>
        <View style={styles.body}>
          <FlatList
            ListFooterComponent={() => (isLoading ? <ActivityIndicator color="#999999" /> : null)}
            ListEmptyComponent={() => (isLoading ? null : <EmptyData />)}
            data={promotionsProduct}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
          />
        </View>
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
  },
  body: {
    flex: 8,
    backgroundColor: '#e7e7e7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DealsEveryDay;
