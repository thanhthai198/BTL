import React from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button, Container, Flex, Icon, Text, theme } from 'components';
import Touchable from 'components/Touchable';
import s from 'theme/commonStyles';
import goBack from 'assets/img/icon_come_back.png';
import MIcon from 'react-native-vector-icons/MaterialIcons';

const StoreDetail = ({ navigation, route }: any) => {
  const { data } = route.params;
  return (
    <Container style={styles.root}>
      <View style={[s.flex]}>
        <View
          style={[styles.header, s.flex, s.marginTopGutter, s.row, s.alignCenter, s.spaceBetween]}
        >
          {navigation.canGoBack() && (
            <Touchable
              hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
              onPress={navigation.goBack}
            >
              <Image style={[s.marginLeftGutter2x]} source={goBack} />
            </Touchable>
          )}
          <Text size={18} weight="600">
            Chi tiết
          </Text>
          <View style={s.marginRightGutter2x} />
        </View>
        <View style={[styles.body, s.paddingHorizontal, s.paddingVertical]}>
          <Touchable
            style={[
              s.row,
              s.alignCenter,
              s.justifyCenter,
              {
                borderRadius: theme.measure.inputHeight / 2,
                height: theme.measure.inputHeight,
                backgroundColor: '#fff',
                marginVertical: theme.measure.gutter,
              },
            ]}
            onPress={() => navigation.navigate('Search')}
          >
            <MIcon name="search" size={22} color={theme.palette.gray} style={s.marginRightGutter} />
            <Text weight="500" color="gray" size={16}>
              Tìm kiếm sản phẩm
            </Text>
          </Touchable>
          <View style={[s.paddingHorizontal]}>
            <Text size={18} weight="600" style={s.marginBottomGutter}>
              {data.store_name}
            </Text>
            <Text size={14} weight="500">
              08:00 - 23:00 (Đang mở cửa)
            </Text>
          </View>
          <View style={styles.storeImage}>
            <ImageBackground
              source={{ uri: 'https://static.lalanow.com.vn/lalanowYenPhong.jpg' }}
              resizeMode="cover"
              style={styles.bgStore}
            />
          </View>
          <View style={[styles.infoStore]}>
            <Flex>
              <Icon name="marker" color="gray" style={[s.marginRightGutter]} />
              <Text size={15} weight="500" style={[s.flex]}>
                {data.address}
              </Text>
            </Flex>
            {data.tenant.phone && (
              <Text color="primary" size={15} weight="500">
                {data.tenant.phone}
              </Text>
            )}
          </View>
          <View>
            {/* <Button variant="opacity-bg" style={[s.marginBottomGutter]}>
              <Text size={16} weight="600" color="primary">
                Chỉ đường{' '}
                <Text weight="normal" color="primary">
                  (Cách bạn 1,5km)
                </Text>
              </Text>
            </Button> */}
            <Button onPress={() => navigation.navigate('GoToMarket')}>
              <Flex>
                <Image
                  width={20}
                  height={20}
                  resizeMode="contain"
                  source={require('assets/img/cart-white.png')}
                />
                <Text color="white" size={16} weight="600" style={[s.marginLeftGutter]}>
                  Đi chợ
                </Text>
              </Flex>
            </Button>
          </View>
        </View>
      </View>
    </Container>
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
    backgroundColor: theme.palette.backgroundSecondary,
  },
  storeImage: {
    marginVertical: theme.measure.gutter,
    borderRadius: theme.measure.gutter,
    overflow: 'hidden',
  },
  infoStore: {
    backgroundColor: theme.getColor('white'),
    borderRadius: theme.measure.gutter,
    borderWidth: 1,
    borderColor: theme.palette.border,
    paddingHorizontal: theme.measure.gutter * 1.5,
    paddingVertical: theme.measure.gutter,
    marginBottom: theme.measure.gutter3x,
  },
  bgStore: {
    height: 200,
  },
});

export default StoreDetail;
