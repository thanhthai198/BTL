import { Button, EmptyData, Flex, NumberFormatter, Text, TextInput, theme } from 'components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, View } from 'react-native';
import debounce from 'lodash/debounce';
import s from 'theme/commonStyles';
import Touchable from 'components/Touchable';
import { useNavigation } from '@react-navigation/native';
import * as ProductService from 'services/product';
import { addCartItems, updateQuantityItem } from 'redux-store/order';
import { appendRecentViews } from 'redux-store/product';
import { useDispatch } from 'react-redux';
import { Modal } from 'react-native';
import rgba from 'polished/lib/color/rgba';
import { useSelector } from 'redux-store';

const ImgProduct = 'https://static.lalanow.com.vn/default_product.png';

const Search = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();
  const user = useSelector(state => state.auth.user);
  const cartItems = useSelector(state => state.order.cartItems);

  const [listItem, setListItem] = useState<any>([]);
  const [itemToAdd, setItemToAdd] = useState<any>(null);
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  console.log('Search -> keyword', keyword);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [listPage, setListPage] = useState<number[]>([]);

  const goBack = () => {
    navigation.goBack();
  };

  const goToCheckOut = () => {
    dispatch(addCartItems(cartItems));
    navigation.navigate(user ? 'CheckOut' : 'Auth');
  };

  const updateModalQuantity = (quantity: number) => () => {
    if (quantity <= 0) {
      setQuantityToAdd(0);
      return null;
    }
    setQuantityToAdd(quantity);
  };

  const addToCartFromModal = (product: any, quantity: number) => () => {
    if (quantity === 0) {
      return Alert.alert('Thông báo', 'Vui lòng thêm số lượng sản phẩm');
    }
    const itemInCart = cartItems.find(cartItem => cartItem?.product?.id === product.id);
    const indexInCart = cartItems.findIndex(cartItem => cartItem?.product?.id === product.id);
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

  const totalPrice = useMemo(() => {
    const total = cartItems.reduce((s, item) => s + item.product.list_price * item.quantity, 0);
    return total;
  }, [cartItems]);

  const handleFilter = async (reload?: boolean) => {
    try {
      if (!keyword || keyword.length === 0) {
        setListItem([]);
        return null;
      }
      setIsLoading(true);

      if (reload) {
        setListItem([]);
        setPage(1);
      }
      const result = await ProductService.filterItem({
        filter_name: keyword,
        page_size: 10,
        page: reload ? 1 : page,
      });
      console.log(result.data);
      setListPage(result.data.list_page);
      setListItem([...listItem, ...result.data.data]);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      if (reload) {
        setListItem([]);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFilter(true);
  }, [keyword]);

  useEffect(() => {
    handleFilter();
  }, [page]);

  const loadMore = () => {
    if (isLoading || (listPage.length > 0 && !listPage.includes(page))) {
      return null;
    }
    setPage(page + 1);
  };

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

  const changeQuantity = (index: number, quantity: number) => () => {
    dispatch(updateQuantityItem({ index, quantity }));
  };

  const closeModal = () => {
    setItemToAdd(null);
    setQuantityToAdd(1);
    setModalVisible(false);
  };

  const addToCart = (product: any, quantity: number) => () => {
    const tmp = [...cartItems];
    tmp.push({ product, quantity });
    dispatch(addCartItems(tmp));
  };

  function showDefaultPrice(defaultPrice: number, price: number) {
    if (+defaultPrice > +price) {
      return true;
    }
    return false;
  }

  const handleKeyword = (value: string) => {
    setKeyword(value);
  };

  const debouncedKeyword = debounce(handleKeyword, 500);

  const renderItem = ({ item }: any) => {
    const isDefaultPrice = showDefaultPrice(item.default_list_price, item.list_price);
    const itemInCart = cartItems.find((cartItem: any) => cartItem?.product?.id === item.id);
    const indexInCart = cartItems.findIndex((cartItem: any) => cartItem?.product?.id === item.id);

    return (
      <Touchable style={[styles.item, s.marginBottomGutter]} onPress={openModalAddCart(item)}>
        <View style={[s.center, styles.productImage]}>
          <Image
            source={{ uri: item?.thumbnail || ImgProduct }}
            style={[s.center, { width: '100%', height: 120 }]}
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
              style={[s.marginRightGutter, s.lineThrough]}
            />
          )}
          <NumberFormatter
            value={item.list_price || 0}
            size={13}
            weight="500"
            suffix="đ"
            color={theme.getColor('primary')}
            style={s.marginRightGutter}
          />
        </Flex>
        {itemInCart ? (
          <View style={[s.row, s.center]}>
            <View style={[s.row, s.center]}>
              <Button
                fullWidth={false}
                textProps={{ weight: '600', color: 'white' }}
                style={styles.changeQuantityBtn}
                onPress={changeQuantity(indexInCart, itemInCart.quantity - 1)}
              >
                -
              </Button>
              {console.log(itemInCart)}
              <Text color="primary" size={16} weight="600" style={[s.marginGutter2x]}>
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
      <Flex
        alignItems="center"
        style={[
          styles.search,
          s.paddingHorizontal,
          s.paddingVertical,
          { paddingTop: theme.measure.statusBarHeight + 10 },
        ]}
      >
        {canGoBack && (
          <Touchable onPress={goBack} hitSlop={{ left: 15, right: 15, top: 15, bottom: 15 }}>
            <Icon name="arrow-back" size={theme.measure.icon.normal} />
          </Touchable>
        )}
        <TextInput
          placeholder="Tìm kiếm sản phẩm..."
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          keyboardType="web-search"
          style={[s.flex, s.marginRightGutter]}
          onChangeText={debouncedKeyword}
        />
      </Flex>
      <FlatList
        data={listItem}
        renderItem={renderItem}
        ListFooterComponent={isLoading ? <ActivityIndicator color="#999999" /> : null}
        ListEmptyComponent={!isLoading ? EmptyData : null}
        keyExtractor={(item: any) => item.id}
        numColumns={2}
        columnWrapperStyle={s.spaceBetween}
        refreshing
        onEndReached={loadMore}
        onEndReachedThreshold={0}
        contentContainerStyle={[
          {
            paddingBottom: cartItems.length > 0 ? 110 : 70,
            paddingTop: 15,
            backgroundColor: theme.palette.layoutBackground,
          },
        ]}
      />
      {cartItems.length > 0 && (
        <Touchable style={styles.bottomPanel} onPress={goToCheckOut}>
          <Text color="white" weight="bold">
            Xem giỏ hàng
          </Text>
          <NumberFormatter value={totalPrice} size={13} weight="bold" suffix="đ" color="white" />
        </Touchable>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        presentationStyle="overFullScreen"
        onRequestClose={() => setModalVisible(false)}
        onDismiss={() => setModalVisible(false)}
      >
        <View style={[styles.modalWrap, s.center, s.flex]}>
          <View style={styles.modal}>
            <Button
              fullWidth={false}
              variant="clear"
              style={styles.buttonCloseModal}
              onPress={closeModal}
            >
              <Icon name="close" size={24} />
            </Button>
            <View style={[s.center, styles.productImage]}>
              <Image
                source={{ uri: itemToAdd?.thumbnail || ImgProduct }}
                style={[s.center, { width: '100%', height: 150 }]}
                resizeMode="contain"
              />
            </View>
            <View style={[s.center]}>
              <Text
                color={theme.palette.text.black}
                size={14}
                weight="500"
                style={[s.marginBottomGutter]}
              >
                {itemToAdd?.item_name}
              </Text>
              <NumberFormatter
                value={itemToAdd?.list_price || 0}
                size={13}
                weight="500"
                suffix="đ"
                color={theme.getColor('primary')}
                style={s.marginRightGutter}
              />
              <Text size={13} weight="500" color="#AAAAAA">
                Số lượng còn {itemToAdd?.quantity} sản phẩm có sẵn
              </Text>
            </View>
            <View style={[s.row, s.center]}>
              <View style={[s.row, s.center]}>
                <Button
                  textProps={{ weight: '600', color: 'white' }}
                  style={styles.changeQuantityBtn}
                  onPress={updateModalQuantity(quantityToAdd - 1)}
                >
                  -
                </Button>
                <Text color="primary" size={16} weight="600" style={[s.marginGutter2x]}>
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
                <Text size={16} weight="600" color="primary" style={[s.absolute, styles.type]}>
                  {itemToAdd?.unit_name === 'Kilogram' ? 'KG' : itemToAdd?.unit_name}
                </Text>
              </View>
            </View>
            <View removeClippedSubviews style={[s.absolute, styles.modalFooter]}>
              <Button
                style={styles.btnAddToCart}
                onPress={addToCartFromModal(itemToAdd, quantityToAdd)}
              >
                <View style={[s.row, s.spaceAround, s.flex]}>
                  <Text size={16} weight="600" color="white">
                    Thêm vào giỏ
                  </Text>
                  <NumberFormatter
                    value={itemToAdd?.list_price * quantityToAdd}
                    size={13}
                    weight="600"
                    suffix="đ"
                    color="white"
                    style={s.marginRightGutter}
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
  inputContainer: {
    marginLeft: 10,
    backgroundColor: theme.getColor('white'),
  },
  input: {
    borderRadius: 4,
    paddingHorizontal: theme.measure.gutter,
    textAlign: 'left',
  },
  search: {
    backgroundColor: theme.getColor('white'),
    shadowColor: 'rgba(0, 0, 0, 0.13)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 8,
  },
  item: {
    backgroundColor: theme.palette.background,
    borderRadius: 10,
    marginHorizontal: theme.measure.gutter / 2,
    paddingHorizontal: theme.measure.gutter,
    paddingTop: 17,
    width: '47%',
    minHeight: 260,
  },
  addToCard: {
    borderRadius: 6,
    position: 'absolute',
    bottom: 15,
    left: 10,
    right: 10,
  },
  changeQuantityBtn: {
    borderRadius: theme.measure.buttonRadius * 1.5,
    width: 40,
    height: 40,
  },
  productImage: {
    marginBottom: theme.measure.gutter * 1.5,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: theme.palette.primary,
    height: 75,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 20,
    paddingBottom: theme.measure.bottomGutter,
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
  type: {
    right: -50,
  },
});

export default Search;
