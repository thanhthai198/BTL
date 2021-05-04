import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { StyleSheet, View, Image, FlatList, Modal, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'redux-store';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Container from 'components/Container';
import commonStyles from 'theme/commonStyles';
import goBack from 'assets/img/icon_come_back.png';
import { Button, EmptyData, Flex, Text, theme } from 'components';
import Touchable from 'components/Touchable';
import CategoryItem from 'components/items/CategoryItem';
import NumberFormatter from 'components/NumberFormatter';
import { rgba } from 'polished';
import { appendRecentViews, getItemCategory, getItemByCategory } from 'redux-store/product';
import { addCartItems, updateQuantityItem } from 'redux-store/order';

const ImgProduct = 'https://static.lalanow.com.vn/default_product.png';

const GoToMarket = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const activeID = route?.params?.activeID;
  const voucher = route?.params?.voucher;
  const user = useSelector(state => state.auth?.user);
  const categories = useSelector(state => state.product?.categories);
  const isLoading = useSelector(state => state.product?.loading);
  const cartItems = useSelector(state => state.order.cartItems);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<any>(null);
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);
  const products = useSelector(state =>
    activeCategory && state.product?.productByCategory[activeCategory?.id]
      ? state.product?.productByCategory[activeCategory?.id].data
      : []
  );

  const getDataList = () => {
    const params = {
      id: activeCategory?.id || categories[0]?.id,
    };
    dispatch(getItemByCategory(params));
  };

  useEffect(() => {
    dispatch(getItemCategory());
  }, []);

  useEffect(() => {
    if (products.length === 0) {
      getDataList();
    }
  }, [activeCategory]);

  useFocusEffect(
    useCallback(() => {
      if (categories.length > 0) {
        if (!activeID) {
          setActiveCategory(categories[0]);
        } else {
          const category = categories.find((item: any) => item?.id === activeID);
          setActiveCategory(category);
        }
      }

      // return () => {
      //   dispatch(addCartItems(cartItems));
      // };
    }, [activeID, categories])
  );

  const addToCart = (product: any, quantity: number) => () => {
    if (!user) {
      navigation.navigate('Auth');
      return null;
    }

    const tmp = [...cartItems];
    tmp.push({ product, quantity });
    // setCartItems(tmp);
    dispatch(addCartItems(tmp));
  };

  const changeQuantity = (index: number, quantity: number) => () => {
    dispatch(updateQuantityItem({ index, quantity }));
    // const tmp = [...cartItems];
    // if (!tmp[index]) {
    //   return null;
    // }
    // if (quantity === 0) {
    //   tmp.splice(index, 1);
    // } else {
    //   tmp[index].quantity = quantity;
    // }
    // setCartItems(tmp);
  };

  const openModalAddCart = (item: any) => () => {
    const itemInCart = cartItems.find((cartItem: any) => cartItem?.product?.id === item?.id);
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
    const itemInCart = cartItems.find((cartItem: any) => cartItem?.product?.id === product?.id);
    const indexInCart = cartItems.findIndex(
      (cartItem: any) => cartItem?.product?.id === product?.id
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
    // setCartItems(tmp);
    dispatch(addCartItems(tmp));
    setModalVisible(false);
  };

  const updateModalQuantity = (quantity: number) => () => {
    if (quantity <= 0) {
      setQuantityToAdd(0);
      return null;
    }
    setQuantityToAdd(quantity);
  };

  const totalPrice = useMemo(() => {
    const total = cartItems.reduce(
      (s: any, item: any) => s + item.product.list_price * item.quantity,
      0
    );
    return total;
  }, [cartItems]);

  const goToCheckOut = () => {
    dispatch(addCartItems(cartItems));
    navigation.navigate('CheckOut', { voucher });
  };

  function showDefaultPrice(defaultPrice: number, price: number) {
    if (+defaultPrice > +price) {
      return true;
    }
    return false;
  }

  const renderItem = ({ item }: any) => {
    const isDefaultPrice = showDefaultPrice(item.default_list_price, item.list_price);
    const itemInCart = cartItems.find((cartItem: any) => cartItem?.product?.id === item?.id);
    const indexInCart = cartItems.findIndex((cartItem: any) => cartItem?.product?.id === item?.id);

    return (
      <Touchable
        style={[styles.item, commonStyles.marginBottomGutter]}
        onPress={openModalAddCart(item)}
      >
        <View style={[commonStyles.center, styles.productImage]}>
          <Image
            source={{ uri: item.thumbnail || ImgProduct }}
            style={[commonStyles.center, { width: '100%', height: 120 }]}
            resizeMode="contain"
          />
        </View>
        <Text color={theme.palette.text.black} size={14} weight="500" numberOfLines={1}>
          {item.item_name}
        </Text>
        <Flex flexDirection="row" justifyContent="space-between">
          {isDefaultPrice && (
            <NumberFormatter
              value={item.default_list_price}
              size={13}
              weight="500"
              suffix="đ"
              color={theme.getColor('red')}
              style={[commonStyles.marginRightGutter, commonStyles.lineThrough]}
            />
          )}
          <NumberFormatter
            value={item.list_price || 0}
            size={13}
            weight="500"
            suffix="đ"
            color={theme.getColor('primary')}
            style={commonStyles.marginRightGutter}
          />
        </Flex>
        {itemInCart ? (
          <View>
            <View style={[commonStyles.row, commonStyles.center]}>
              <Button
                fullWidth={false}
                textProps={{ weight: '600', color: 'white' }}
                style={styles.changeQuantityBtn}
                onPress={changeQuantity(indexInCart, itemInCart.quantity - 1)}
              >
                -
              </Button>
              <Text color="primary" size={16} weight="600" style={[commonStyles.marginGutter2x]}>
                {itemInCart.quantity}
              </Text>
              <Button
                fullWidth={false}
                style={styles.changeQuantityBtn}
                textProps={{ weight: '600', color: 'white' }}
                onPress={changeQuantity(
                  indexInCart,
                  itemInCart.quantity < itemInCart.product.quantity
                    ? itemInCart.quantity + 1
                    : itemInCart.quantity
                )}
              >
                +
              </Button>
            </View>
            <Button
              textProps={{ weight: '600', color: 'white' }}
              medium
              // variant="opacity-bg"
              color="red"
              style={[styles.removeBtn]}
              onPress={changeQuantity(indexInCart, 0)}
            >
              Xóa khỏi giỏ
            </Button>
          </View>
        ) : (
          <Button
            medium
            variant="opacity-bg"
            style={[styles.addToCard]}
            onPress={addToCart(item, 1)}
          >
            <Text size={13} weight="500" color="primary">
              Thêm vào giỏ
            </Text>
          </Button>
        )}
      </Touchable>
    );
  };

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
            Đi chợ
          </Text>
          <View style={commonStyles.marginRightGutter3x} />
          {/* <Touchable onPress={() => navigation.navigate(user ? 'Search' : 'Auth')}>
            <Image style={commonStyles.marginRightGutter2x} source={IconSearch} />
          </Touchable> */}
        </View>
        <View style={styles.body}>
          <FlatList
            contentContainerStyle={[
              commonStyles.paddingHorizontal,
              { paddingBottom: cartItems.length > 0 ? 110 : 0, marginLeft: 0 },
            ]}
            ListHeaderComponent={() => (
              <>
                <View style={[styles.producPortfolio, { marginHorizontal: -10 }]}>
                  {categories.map((item: any) => {
                    return (
                      <CategoryItem
                        key={`category-market-${item?.id}`}
                        label={item.category_name}
                        thumbnail={item.thumbnail}
                        onPress={() => setActiveCategory({ ...item })}
                        isActive={activeCategory && activeCategory?.id === item?.id}
                      />
                    );
                  })}
                </View>
                {!!activeCategory && (
                  <View style={commonStyles.paddingHorizontal}>
                    <Text
                      size={15}
                      weight="600"
                      color={theme.palette.text.black}
                      style={[commonStyles.marginBottomGutter, commonStyles.marginTopGutter2x]}
                    >
                      {activeCategory.category_name}
                    </Text>
                  </View>
                )}
              </>
            )}
            ListFooterComponent={() => (isLoading ? <ActivityIndicator color="#999999" /> : null)}
            ListEmptyComponent={() => (isLoading ? null : <EmptyData />)}
            data={products || []}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            numColumns={2}
            columnWrapperStyle={commonStyles.spaceBetween}
            onEndReachedThreshold={0.25}
            onEndReached={getDataList}
          />

          {cartItems.length > 0 && (
            <Touchable style={styles.bottomPanel} onPress={goToCheckOut}>
              <Text color="white" weight="bold">
                Xem giỏ hàng
              </Text>
              <NumberFormatter
                value={totalPrice}
                size={13}
                weight="bold"
                suffix="đ"
                color="white"
              />
            </Touchable>
          )}
        </View>
      </Container>
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
              <Icon name="close" size={24} />
            </Button>
            <View style={[commonStyles.center, styles.productImage]}>
              <Image
                source={{ uri: itemToAdd?.thumbnail || ImgProduct }}
                style={[commonStyles.center, { width: '100%', height: 150 }]}
                resizeMode="contain"
              />
            </View>
            <View style={[commonStyles.center, commonStyles.paddingHorizontal]}>
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
                <Text color="primary" size={16} weight="600" style={[commonStyles.marginGutter2x]}>
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
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  producPortfolio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginHorizontal: -3,
    paddingTop: 10,
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
  },
  item: {
    backgroundColor: theme.palette.background,
    borderRadius: theme.measure.gutter,
    paddingHorizontal: theme.measure.gutter,
    paddingTop: 17,
    width: '48%',
    minHeight: 260,
  },
  addToCard: {
    borderRadius: 6,
    position: 'absolute',
    bottom: 15,
    left: 10,
    right: 10,
  },
  removeBtn: {
    borderRadius: 6,
    marginBottom: 15,
  },
  productImage: {
    marginBottom: theme.measure.gutter * 1.5,
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
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: theme.palette.primary,
    height: 65,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
});

export default GoToMarket;
