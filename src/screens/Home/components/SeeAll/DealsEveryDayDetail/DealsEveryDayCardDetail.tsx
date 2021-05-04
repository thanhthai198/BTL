import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { Button, Container, Flex, EmptyData, Text, theme } from 'components';
import { rgba } from 'polished';
import Touchable from 'components/Touchable';
import NumberFormatter from 'components/NumberFormatter';
import commonStyles from 'theme/commonStyles';
import { useSelector } from 'redux-store';
import { useDispatch } from 'react-redux';
import { addCartItems, updateQuantityItem } from 'redux-store/order';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appendRecentViews } from 'redux-store/product';

const ImgProduct = 'https://static.lalanow.com.vn/default_product.png';

const DealsEveryDayCardDetail = ({ navigation, route }: any) => {
  const { data } = route.params;
  const item = data.items;
  console.log(item);
  const isLoading = useSelector(state => state.product?.loading);
  const cartItems = useSelector(state => state.order.cartItems);
  const dispatch = useDispatch();
  const voucher = route?.params?.voucher;
  const user = useSelector(state => state.auth?.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<any>(null);
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);

  function showDefaultPrice(defaultPrice: number, price: number) {
    if (+defaultPrice > +price) {
      return true;
    }
    return false;
  }

  const changeQuantity = (index: number, quantity: number) => () => {
    dispatch(updateQuantityItem({ index, quantity }));
  };

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

  const updateModalQuantity = (quantity: number) => () => {
    if (quantity <= 0) {
      setQuantityToAdd(0);
      return null;
    }
    setQuantityToAdd(quantity);
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

  const goToCheckOut = () => {
    dispatch(addCartItems(cartItems));
    navigation.navigate('CheckOut', { voucher });
  };

  const totalPrice = useMemo(() => {
    const total = cartItems.reduce(
      (s: any, item: any) => s + item.product.list_price * item.quantity,
      0
    );
    return total;
  }, [cartItems]);

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
        <ImageBackground
          source={{
            uri: data.image || ImgProduct,
          }}
          style={styles.header}
        >
          <Touchable style={styles.iconBack} onPress={() => navigation.goBack()}>
            <Image source={require('assets/img/icon_Back_White.png')} />
          </Touchable>
          {/* <Text weight="600" color="#fff" numberOfLines={2} style={[s.absolute, styles.name]}>
            {data.promotion_name}
          </Text> */}
        </ImageBackground>
        <View style={styles.body}>
          <FlatList
            contentContainerStyle={[
              commonStyles.paddingHorizontal,
              commonStyles.paddingVertical,
              { paddingBottom: cartItems.length > 0 ? 110 : 0, marginLeft: 0 },
            ]}
            ListFooterComponent={() => (isLoading ? <ActivityIndicator color="#999999" /> : null)}
            ListEmptyComponent={() => (isLoading ? null : <EmptyData />)}
            data={item || []}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={commonStyles.spaceBetween}
            onEndReachedThreshold={0.25}
            // onEndReached={getDataList}
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
  header: {
    flex: 2,
  },
  body: {
    flex: 6,
    backgroundColor: '#e7e7e7',
  },
  iconBack: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: rgba(theme.palette.gray, 0.7),
    top: 47,
    left: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // name: {
  //   bottom: theme.measure.gutter,
  //   left: theme.measure.gutter * 1.5,
  // },
  item: {
    backgroundColor: theme.palette.background,
    borderRadius: theme.measure.gutter,
    paddingHorizontal: theme.measure.gutter,
    paddingTop: 17,
    width: '48%',
    minHeight: 260,
  },
  productImage: {
    marginBottom: theme.measure.gutter * 1.5,
  },
  changeQuantityBtn: {
    borderRadius: theme.measure.buttonRadius * 1.5,
    width: 40,
    height: 40,
  },
  removeBtn: {
    borderRadius: 6,
    marginBottom: 15,
  },
  addToCard: {
    borderRadius: 6,
    position: 'absolute',
    bottom: 15,
    left: 10,
    right: 10,
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
  btnAddToCart: {
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  type: {
    right: -50,
  },
  modalFooter: {
    bottom: 0,
    left: 0,
    right: 0,
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

export default DealsEveryDayCardDetail;
