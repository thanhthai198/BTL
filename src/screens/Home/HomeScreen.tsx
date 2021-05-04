import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useSelector } from 'redux-store';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useDispatch } from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Touchable from 'components/Touchable';
import Avatar from 'components/Avatar';
import Text from 'components/Text';
import Button from 'components/Button';
import Icon from 'components/Icon';
import commonStyles from 'theme/commonStyles';
import * as theme from 'theme';
import {
  appendRecentViews,
  getItemCategory,
  getRecommendedItems,
  getTrendingItems,
  getItemPromotions,
} from 'redux-store/product';
import ProductCategories from './components/ProductCategories';
// import SeeAll from './components/SeeAll';
import ToolButton from './components/ToolButton';
import { Flex, NumberFormatter, EmptyData } from 'components';
import { rgba } from 'polished';
import { addCartItems } from 'redux-store/order';
import AvatarImg from 'assets/img/avatar.png';
import DealsEveryDayCardHome from './components/SeeAll/DealsEveryDayCardHome';

const ImgProduct = 'https://static.lalanow.com.vn/default_product.png';
const Layout = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};

const data = [
  'https://static.lalanow.com.vn/bannerappamg/KHAITRUONG1.png',
  'https://static.lalanow.com.vn/bannerappamg/KHAITRUONG2.png',
  'https://static.lalanow.com.vn/bannerappamg/KHAITRUONG3.png',
  'https://static.lalanow.com.vn/bannerappamg/KHAITRUONG4.png',
  'https://static.lalanow.com.vn/bannerappamg/KHAITRUONG5.png',
  'https://static.lalanow.com.vn/bannerappamg/KHAITRUONG6.png',
];

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  // const categories = useSelector(state => state.product?.categories);

  const user = useSelector(state => state.auth?.user);
  const recommendedProducts = useSelector(state => state.product?.recommendedProducts || []);
  const loadingRecommendedProducts = useSelector(state => state.product?.loadingRecommended);
  const trendingProducts = useSelector(state => state.product?.trendingProducts || []);
  const loadingTrendingProducts = useSelector(state => state.product?.loadingTrending);
  const promotionsProduct = useSelector(state => state.product?.promotionsProducts || []);

  const recentViews = useSelector(state => state.product?.recentViews || []);
  const cartItems = useSelector(state => state.order.cartItems);
  const isLoading = useSelector(state => state.product?.loading);

  // const [cartItems, setCartItems] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<any>(null);
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);
  const [indexCarousel, setIndexCarousel] = useState<number>(1);

  const onPressStore = (item: any) => () => {
    navigation.navigate('DealsEveryDayCardDetail', { data: item });
  };
  const renderItem = ({ item }: any) => (
    <DealsEveryDayCardHome data={item} onPress={onPressStore(item)} />
  );

  const onToolPress = (tool: string) => () => {
    switch (tool) {
      case 'market':
        navigation.navigate('GoToMarket');
        return;
      case 'scan':
        if (!user) {
          navigation.navigate('Auth');
          return null;
        }
        Alert.alert('Thông báo', 'Chức năng sẽ sớm được cập nhật');
        return;
      case 'coupon':
        if (!user) {
          navigation.navigate('Auth');
          return null;
        }
        navigation.navigate('Voucher');
        return;
      case 'gift':
        if (!user) {
          navigation.navigate('Auth');
          return null;
        }
        navigation.navigate('Order', { type: 'BUSINESSORDER' });
        return;
    }
  };

  useEffect(() => {
    dispatch(getItemCategory());
    dispatch(getRecommendedItems({ page_size: 10 }));
    dispatch(getTrendingItems({ page_size: 10 }));
    dispatch(getItemPromotions({ page_size: 10 }));
  }, []);

  const openModalAddCart = (item: any) => () => {
    const itemInCart = cartItems.find((cartItem: any) => cartItem?.product?.id === item.id);
    setItemToAdd(item);
    if (itemInCart) {
      setQuantityToAdd(itemInCart?.quantity);
    } else {
      setQuantityToAdd(1);
    }
    dispatch(appendRecentViews(item));
    setModalVisible(true);
  };

  const closeModal = () => {
    setItemToAdd(null);
    setQuantityToAdd(1);
    setModalVisible(false);
  };

  const addToCartFromModal = (product: any, quantity: number) => () => {
    if (!user) {
      setModalVisible(false);
      navigation.navigate('Auth');
      return null;
    }
    if (quantity === 0) {
      return Alert.alert('Thông báo', 'Vui lòng thêm số lượng sản phẩm');
    }
    const itemInCart = cartItems.find((cartItem: any) => cartItem?.product?.id === product.id);
    const indexInCart = cartItems.findIndex(
      (cartItem: any) => cartItem?.product?.id === product.id
    );
    const tmp = [...cartItems];
    if (itemInCart && quantity > 0) {
      tmp[indexInCart] = { product, quantity };
    }
    if (itemInCart && quantity <= 0) {
      tmp.splice(indexInCart, 1);
    }
    if (!itemInCart) {
      tmp.push({ product, quantity });
    }
    dispatch(addCartItems(tmp));
    setModalVisible(false);
  };

  const updateModalQuantity = (quantity: number) => () => {
    if (quantity <= 0) {
      setQuantityToAdd(0);
      return null;
    }
    if (quantity > itemToAdd?.quantity) {
      return null;
    }
    setQuantityToAdd(quantity);
  };

  function showDefaultPrice(defaultPrice: number, price: number) {
    if (defaultPrice > price) {
      return true;
    }
    return false;
  }

  return (
    <>
      <ScrollView
        style={commonStyles.page}
        contentContainerStyle={{
          paddingBottom: theme.measure.tabBarHeight + 20 + (cartItems.length > 0 ? 50 : 0),
        }}
      >
        <View style={[commonStyles.alignCenter]}>
          <ImageBackground
            style={[styles.topContainer, styles.imageBackGround]}
            source={require('assets/img/Group954.png')}
          >
            <View
              style={[
                commonStyles.row,
                commonStyles.alignCenter,
                commonStyles.spaceBetween,
                commonStyles.marginLeftGutter2x,
                commonStyles.marginRightGutter2x,
              ]}
            >
              <View
                style={[
                  commonStyles.row,
                  commonStyles.alignCenter,
                  commonStyles.marginTopGutter,
                  commonStyles.marginBottomGutter,
                ]}
              >
                <Touchable onPress={() => navigation.navigate(user ? 'AccountDetail' : 'Auth')}>
                  <Avatar
                    style={commonStyles.marginRightGutter}
                    source={
                      user?.contact_profile_pic ? { uri: user?.contact_profile_pic } : AvatarImg
                    }
                  />
                </Touchable>
                {user ? (
                  <View>
                    <Touchable onPress={() => navigation.navigate(user ? 'AccountDetail' : 'Auth')}>
                      <Text weight="bold" size={18} color="white">
                        {user?.contact_name}
                      </Text>
                    </Touchable>
                    <Touchable onPress={() => navigation.navigate('Rank')}>
                      <Text size={16} color="rgba(255,255,255,0.7)">
                        {user?.rank_info?.name}
                      </Text>
                    </Touchable>
                  </View>
                ) : (
                  <Touchable onPress={() => navigation.navigate('Auth')}>
                    <Text weight="bold" size={18} color="white">
                      Đăng nhập
                    </Text>
                  </Touchable>
                )}
              </View>
              <Icon
                size={20}
                name="notify2"
                color="#fff"
                onPress={() => navigation.navigate(user ? 'Notification' : 'Auth')}
              />
            </View>
          </ImageBackground>
          <ImageBackground source={require('assets/img/Union.png')} style={styles.tools}>
            <ToolButton
              label="Đi chợ"
              icon={require('assets/img/cart.png')}
              onPress={onToolPress('market')}
            />
            <ToolButton
              label="Tích điểm"
              icon={require('assets/img/tichdiem.png')}
              onPress={onToolPress('scan')}
            />
            <ToolButton
              label="Quà công ty"
              icon={require('assets/img/quacty.png')}
              onPress={onToolPress('gift')}
            />
            <ToolButton
              label="Ưu đãi"
              icon={require('assets/img/uudai.png')}
              onPress={onToolPress('coupon')}
            />
          </ImageBackground>
        </View>
        <Carousel
          autoplay
          loop
          autoplayDelay={2000}
          data={data}
          renderItem={({ item, index }: any) => (
            <View key={`card-${index}`} style={{ width: '100%', height: 180 }}>
              <Image
                source={{ uri: item }}
                style={{ width: '100%', height: 180 }}
                resizeMode="cover"
              />
            </View>
          )}
          onSnapToItem={index => setIndexCarousel(index)}
          sliderWidth={Layout.width}
          itemWidth={Layout.width}
          sliderHeight={180}
          itemHeight={180}
        />
        <Pagination
          dotsLength={data.length}
          activeDotIndex={indexCarousel}
          containerStyle={styles.dotsContainerStyle}
          dotStyle={styles.dotsStyle}
          inactiveDotOpacity={0.15}
          inactiveDotScale={0.75}
          animatedDuration={100}
          inactiveDotStyle={{
            marginHorizontal: -theme.measure.gutter,
          }}
        />

        <View style={[commonStyles.marginLeftGutter, commonStyles.marginRightGutter]}>
          <Touchable
            style={[
              commonStyles.row,
              commonStyles.alignCenter,
              commonStyles.justifyCenter,
              {
                borderRadius: theme.measure.inputHeight / 2,
                height: theme.measure.inputHeight,
                backgroundColor: theme.palette.backgroundSecondary,
                marginVertical: theme.measure.gutter,
              },
            ]}
            onPress={() => navigation.navigate(user ? 'Search' : 'Auth')}
          >
            <MIcon
              name="search"
              size={22}
              color={theme.palette.gray}
              style={commonStyles.marginRightGutter}
            />
            <Text weight="500" color="gray" size={16}>
              Tìm kiếm sản phẩm
            </Text>
          </Touchable>
        </View>
        <ProductCategories />
        <View style={styles.row}>
          <Text size={16} weight="bold">
            Dành riêng cho bạn
          </Text>
          <Touchable onPress={() => navigation.navigate('JustForYou')}>
            <Text weight="600" color="#039477" size={14}>
              Xem tất cả
            </Text>
          </Touchable>
        </View>
        {loadingRecommendedProducts && <ActivityIndicator color="#999999" />}
        <ScrollView horizontal={true}>
          {recommendedProducts?.map((item: any) => {
            const isShowPriceDefault = +item.default_list_price > +item.list_price;

            return (
              <Touchable
                key={item.id}
                style={{ width: 138, height: 200, marginLeft: 10 }}
                onPress={openModalAddCart(item)}
              >
                <View
                  style={{ width: 138, height: 138, backgroundColor: '#E7E7E7', borderRadius: 15 }}
                >
                  <Image
                    source={{ uri: item.thumbnail || ImgProduct }}
                    style={[commonStyles.center, { width: 138, height: 138 }]}
                    resizeMode="contain"
                  />
                </View>
                <View style={[commonStyles.marginTopGutter]}>
                  <Text numberOfLines={1}>{item.item_name}</Text>
                  <Flex style={[commonStyles.spaceBetween]}>
                    {isShowPriceDefault && (
                      <NumberFormatter
                        value={item.default_list_price}
                        size={13}
                        weight="500"
                        suffix="đ"
                        color={theme.getColor('gray')}
                        style={[commonStyles.marginRightGutter, commonStyles.lineThrough]}
                      />
                    )}
                    <Flex flexDirection="row" justifyContent="flex-end" flex={1}>
                      <NumberFormatter
                        value={item.list_price || 0}
                        size={13}
                        weight="500"
                        suffix="đ"
                        color={theme.getColor('primary')}
                        style={commonStyles.marginRightGutter}
                      />
                    </Flex>
                  </Flex>
                </View>
              </Touchable>
            );
          })}
        </ScrollView>
        <View style={styles.row}>
          <Text size={16} weight="bold">
            Mọi người đều mua
          </Text>
          <Touchable onPress={() => navigation.navigate('EveryoneBuys')}>
            <Text weight="600" color="#039477" size={14}>
              Xem tất cả
            </Text>
          </Touchable>
        </View>
        {loadingTrendingProducts && <ActivityIndicator color="#999999" />}
        <ScrollView horizontal={true}>
          {trendingProducts.map((item: any) => {
            const isDefaultPrice = showDefaultPrice(item.default_list_price, item.list_price);
            return (
              <Touchable
                key={item.id}
                style={{ width: 138, height: 200, marginLeft: 10 }}
                onPress={openModalAddCart(item)}
              >
                <View
                  style={{ width: 138, height: 138, backgroundColor: '#E7E7E7', borderRadius: 15 }}
                >
                  <Image
                    source={{ uri: item.thumbnail || ImgProduct }}
                    style={[commonStyles.center, { width: 138, height: 138 }]}
                    resizeMode="contain"
                  />
                </View>
                <View style={[commonStyles.marginTopGutter]}>
                  <Text numberOfLines={1}>{item.item_name}</Text>
                  <Flex flexDirection="row" justifyContent="space-between">
                    {isDefaultPrice && (
                      <NumberFormatter
                        value={item.default_list_price}
                        size={13}
                        weight="500"
                        suffix="đ"
                        color={theme.getColor('gray')}
                        style={[commonStyles.marginRightGutter, commonStyles.lineThrough]}
                      />
                    )}

                    <Flex flexDirection="row" justifyContent="flex-end" flex={1}>
                      <NumberFormatter
                        value={item.list_price || 0}
                        size={13}
                        weight="500"
                        suffix="đ"
                        color={theme.getColor('primary')}
                        style={commonStyles.marginRightGutter}
                      />
                    </Flex>
                  </Flex>
                </View>
              </Touchable>
            );
          })}
        </ScrollView>
        <View style={styles.row}>
          <Text size={16} weight="bold">
            Ưu đãi mỗi ngày
          </Text>
          <Touchable onPress={() => navigation.navigate('DealsEveryDay')}>
            <Text weight="600" color="#039477" size={14}>
              Xem tất cả
            </Text>
          </Touchable>
        </View>
        {loadingTrendingProducts && <ActivityIndicator color="#999999" />}
        <FlatList
          ListFooterComponent={() => (isLoading ? <ActivityIndicator color="#999999" /> : null)}
          data={promotionsProduct}
          renderItem={renderItem}
          style={{
            marginHorizontal: 5,
          }}
          horizontal
          keyExtractor={(item: any) => item.id}
        />
        {recentViews.length > 0 && (
          <>
            <View style={styles.row}>
              <Text weight="bold" size={16}>
                Các sản phẩm đã xem
              </Text>
            </View>
            <ScrollView horizontal={true}>
              {recentViews.slice(0, 10).map((item: any) => {
                const isDefaultPrice = showDefaultPrice(item.default_list_price, item.list_price);

                return (
                  <Touchable
                    key={item.id}
                    style={{ width: 138, height: 200, marginLeft: 10 }}
                    onPress={openModalAddCart(item)}
                  >
                    <View
                      style={{
                        width: 138,
                        height: 138,
                        backgroundColor: '#E7E7E7',
                        borderRadius: 15,
                      }}
                    >
                      <Image
                        source={{ uri: item.thumbnail || ImgProduct }}
                        style={[commonStyles.center, { width: 138, height: 138 }]}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={[commonStyles.marginTopGutter]}>
                      <Text numberOfLines={1}>{item.item_name}</Text>
                      <Flex flexDirection="row" justifyContent="space-between">
                        {isDefaultPrice && (
                          <NumberFormatter
                            value={item.default_list_price}
                            size={13}
                            weight="500"
                            suffix="đ"
                            color={theme.getColor('gray')}
                            style={[commonStyles.marginRightGutter, commonStyles.lineThrough]}
                          />
                        )}

                        <Flex flexDirection="row" justifyContent="flex-end" flex={1}>
                          <NumberFormatter
                            value={item.list_price || 0}
                            size={13}
                            weight="500"
                            suffix="đ"
                            color={theme.getColor('primary')}
                            style={commonStyles.marginRightGutter}
                          />
                        </Flex>
                      </Flex>
                    </View>
                  </Touchable>
                );
              })}
            </ScrollView>
          </>
        )}

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          presentationStyle="overFullScreen"
          onRequestClose={() => setModalVisible(false)}
          onDismiss={() => setModalVisible(false)}
        >
          <View style={[styles.modalWrap, commonStyles.center, commonStyles.flex]}>
            <View style={styles.modal}>
              <Button
                fullWidth={false}
                variant="clear"
                style={styles.buttonCloseModal}
                onPress={closeModal}
              >
                <MIcon name="close" size={24} />
              </Button>
              <View style={[commonStyles.center]}>
                <Image
                  source={{ uri: itemToAdd?.thumbnail || ImgProduct }}
                  style={[commonStyles.center, { width: '100%', height: 150 }]}
                  resizeMode="contain"
                />
              </View>
              <View style={[commonStyles.center]}>
                <Text
                  color={theme.palette.text.black}
                  size={14}
                  weight="500"
                  style={[commonStyles.marginBottomGutter]}
                >
                  {itemToAdd?.item_name}
                </Text>
                <NumberFormatter
                  value={itemToAdd?.list_price || 0}
                  size={13}
                  weight="500"
                  suffix="đ"
                  color={theme.getColor('primary')}
                  style={commonStyles.marginRightGutter}
                />
                <Text size={13} weight="500" color="#AAAAAA">
                  Số lượng còn {itemToAdd?.quantity} sản phẩm có sẵn
                </Text>
              </View>
              <View style={[commonStyles.row, commonStyles.center]}>
                <View style={[commonStyles.row, commonStyles.center]}>
                  <Button
                    textProps={{ weight: '600', color: 'white' }}
                    style={styles.changeQuantityBtn}
                    onPress={updateModalQuantity(quantityToAdd - 1)}
                  >
                    -
                  </Button>
                  <Text
                    color="primary"
                    size={16}
                    weight="600"
                    style={[commonStyles.marginGutter2x]}
                  >
                    {quantityToAdd}
                  </Text>
                  <Button
                    textProps={{ weight: '600', color: 'white' }}
                    style={styles.changeQuantityBtn}
                    onPress={updateModalQuantity(
                      itemToAdd?.quantity <= quantityToAdd ? quantityToAdd : quantityToAdd + 1
                    )}
                  >
                    +
                  </Button>
                  <Text
                    size={16}
                    weight="600"
                    color="primary"
                    style={[commonStyles.absolute, styles.type]}
                  >
                    {itemToAdd?.unit_name === 'Kilogram' ? 'KG' : itemToAdd?.unit_name}
                  </Text>
                </View>
              </View>
              <View removeClippedSubviews style={[commonStyles.absolute, styles.modalFooter]}>
                <Button
                  style={styles.btnAddToCart}
                  onPress={addToCartFromModal(itemToAdd, quantityToAdd)}
                >
                  <View style={[commonStyles.row, commonStyles.spaceAround, commonStyles.flex]}>
                    <Text size={16} weight="600" color="white">
                      Thêm vào giỏ
                    </Text>
                    <NumberFormatter
                      value={itemToAdd?.list_price * quantityToAdd}
                      size={13}
                      weight="600"
                      suffix="đ"
                      color="white"
                      style={commonStyles.marginRightGutter}
                    />
                  </View>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {cartItems.length > 0 && (
        <Touchable style={styles.cartLabel} onPress={() => navigation.navigate('GoToMarket')}>
          <View style={[commonStyles.row, commonStyles.alignCenter]}>
            <MIcon name="shopping-cart" size={20} color="#fff" />
            <Text style={{ marginLeft: 5 }} color="#fff" weight="500">
              {cartItems.length} sản phẩm
            </Text>
          </View>
          {/* <View style={[commonStyles.row, commonStyles.alignCenter]}>
            <Text style={{ marginRight: 5 }}>Giỏ hàng</Text>
            <MIcon name="east" size={20} />
          </View> */}
        </Touchable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  imageBackGround: {
    height: 185,
    width: Layout.width,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  topContainer: {
    paddingTop: theme.measure.statusBarHeight,
  },
  tools: {
    flexDirection: 'row',
    width: Layout.width,
    height: 150,
    marginTop: -60,
    paddingVertical: 25,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  modalWrap: {
    backgroundColor: rgba(theme.palette.gray, 0.5),
  },
  modal: {
    width: 350,
    height: 400,
    backgroundColor: theme.palette.background,
    borderRadius: theme.measure.borderRadius * 1.5,
    paddingTop: theme.measure.gutter * 3,
  },
  buttonCloseModal: {
    position: 'absolute',
    right: 5,
    top: 5,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: rgba(theme.palette.gray, 0.1),
  },
  changeQuantityBtn: {
    borderRadius: theme.measure.buttonRadius * 1.5,
    width: 40,
    height: 40,
  },
  type: {
    right: -50,
  },
  modalFooter: {
    bottom: 0,
    left: 0,
    right: 0,
  },
  btnAddToCart: {
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  cartLabel: {
    position: 'absolute',
    bottom: theme.measure.tabBarHeight + 10,
    right: 10,
    backgroundColor: theme.palette.primary,
    borderRadius: 8,
    elevation: 3,
    shadowColor: theme.palette.primary,
    shadowOpacity: 0.25,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dotsContainerStyle: {
    backgroundColor: theme.palette.background,
    paddingVertical: 20,
  },
  dotsStyle: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: theme.palette.primary,
  },
});

export default HomeScreen;
