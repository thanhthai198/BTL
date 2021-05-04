import React, { useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Modal,
  Alert,
  Platform,
  NativeModules,
  NativeEventEmitter,
  ActivityIndicator,
} from 'react-native';
import generateUniqueID from 'generate-unique-id';
import { useDispatch } from 'react-redux';
import { useSelector } from 'redux-store';
import isEmpty from 'lodash/isEmpty';
import RNMomosdk from 'react-native-momosdk';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Container from 'components/Container';
import commonStyles from 'theme/commonStyles';
import goBack from 'assets/img/icon_come_back.png';
import { Button, Flex, Text, theme } from 'components';
import Touchable from 'components/Touchable';
import NumberFormatter from 'components/NumberFormatter';
import TextInput from 'components/TextInput';
import Avatar from 'components/Avatar';
import { rgba } from 'polished';
import * as OrderService from 'services/order';
import OrderDone from 'assets/img/orderDone.png';
import { DEFAULT_TITLE } from 'variables/response-messages';
import { Order } from 'screens/components/models/order';
import { addCartItems, resetCart } from 'redux-store/order';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import StoreSelector from './components/StoreSelector';
import AddressSelector from './components/AddressSelector';
import VoucherSelector from './components/VoucherSelector';
import { ShippingPackages } from './components/ShippingPackages';
import OderSubmitNoti from 'assets/img/icon_bell.png';

const ImgProduct = 'https://static.lalanow.com.vn/default_product.png';

const RNMomosdkModule = NativeModules.RNMomosdk;
const EventEmitter = new NativeEventEmitter(RNMomosdkModule);
const merchantname = 'AMG';
const merchantNameLabel = 'AMG';
const appScheme = 'AMGMomo2020';
const billdescription = '';
const enviroment = '1'; //"0": SANBOX , "1": PRODUCTION

const GoToMarket = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const voucherOnParams = route?.params?.voucher;
  const user = useSelector(state => state.auth?.user);
  const cartItems = useSelector(state => state.order?.cartItems);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSubmit, setModalSubmit] = useState(false);
  const [dataOrder, setDataOrder] = useState<Order>({});
  const [store, setStore] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [voucher, setVoucher] = useState<any>(voucherOnParams || null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [dataCheckedOrder, setDataCheckedOrder] = useState<any>(null);
  const [shippingPackage, setShippingPackage] = useState<any>(null);
  const [shippingPackageList, setShippingPackageList] = useState<any>([]);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  const [quantityToEdit, setQuantityToEdit] = useState<number>(1);

  const toggleModalSubmit = () => {
    setModalSubmit(!modalSubmit);
  };

  const openModalEditCart = (item: any) => () => {
    const itemInCart = cartItems.find(
      (cartItem: any) => cartItem?.product?.id === item?.product?.id
    );
    setItemToEdit(item?.product);
    if (itemInCart) {
      setQuantityToEdit(itemInCart?.quantity);
    } else {
      setQuantityToEdit(1);
    }

    setModalEditVisible(true);
  };

  const closeModalEditCart = () => {
    setItemToEdit(null);
    setQuantityToEdit(1);
    setModalEditVisible(false);
  };

  const addToCartFromModal = (product: any, quantity: number) => () => {
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
    if (!itemInCart) {
      tmp.push({ product, quantity });
    }
    // setCartItems(tmp);
    dispatch(addCartItems(tmp));
    setModalEditVisible(false);
  };

  const updateModalQuantity = (quantity: number) => () => {
    if (quantity <= 1) {
      setQuantityToEdit(1);
      return null;
    }
    setQuantityToEdit(quantity);
  };

  const removeProduct = (product: any) => () => {
    const indexInCart = cartItems.findIndex(
      (cartItem: any) => cartItem?.product?.id === product?.id
    );
    if (indexInCart === -1) {
      return null;
    }
    const tmp = [...cartItems];
    tmp.splice(indexInCart, 1);
    dispatch(addCartItems(tmp));
  };

  const totalPrice = useMemo(() => {
    const total =
      cartItems && cartItems.length > 0
        ? cartItems.reduce(
            (s: any, item: any) => s + item.product.default_list_price * item.quantity,
            0
          )
        : 0;
    return total;
  }, [cartItems, dataCheckedOrder]);

  useEffect(() => {
    EventEmitter.addListener(
      'RCTMoMoNoficationCenterRequestTokenReceived',
      async (response: any) => {
        momoHandleResponse(response);
      }
    );

    return () => {
      EventEmitter.removeListener('RCTMoMoNoficationCenterRequestTokenReceived', () => {});
    };
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && navigation.isFocused()) {
      navigation.goBack();
    }
  }, [cartItems]);

  const onPressSubmit = async () => {
    if (!shippingPackage?.id && !shippingPackage?.ship_fee) {
      Alert.alert(
        'Đã xảy ra lỗi',
        shippingPackage?.description || 'Địa chỉ giao hàng chưa được hỗ trợ'
      );
      return null;
    }

    switch (paymentMethod?.id) {
      case 'MOMO_APP':
        await processMomo();
        break;
      default:
        await handleSubmitOrder();
    }
  };

  const processMomo = async () => {
    try {
      setLoading(true);
      if (!dataCheckedOrder) {
        throw new Error('Đã xảy ra lỗi');
      }
      const { data: merchantCode } = await OrderService.getMomoMerchant();
      const jsonData: any = {};
      const orderId = dataCheckedOrder?.saleorder_no || generateUniqueID({ length: 11 });
      jsonData.enviroment = enviroment;
      jsonData.action = 'gettoken';
      jsonData.merchantname = merchantname;
      jsonData.merchantcode = merchantCode?.merchant_code;
      jsonData.merchantnamelabel = merchantNameLabel;
      jsonData.description = billdescription;
      jsonData.amount = dataCheckedOrder?.amount;
      jsonData.orderId = orderId;
      jsonData.appScheme = appScheme;

      if (Platform.OS === 'android') {
        let dataPayment = await RNMomosdk.requestPayment(jsonData);
        await momoHandleResponse(dataPayment);
      } else {
        await RNMomosdk.requestPayment(jsonData);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      Alert.alert('Đã xảy ra lỗi', 'Có lỗi xảy ra khi thanh toán với Momo');
      setLoading(false);
    }
  };

  const momoHandleResponse = async (response: any) => {
    try {
      setLoading(true);
      if (response && (response.status === '0' || response.status === 0) && !!store) {
        //SUCCESS continue to submit momoToken,phonenumber to server
        const momoToken = response.data;
        const orderId = response.orderId;
        const phoneNumber = response.phonenumber;

        await OrderService.payMomo({
          momo_token: momoToken,
          partner_ref_id: orderId,
          amount: dataCheckedOrder?.amount,
          customer_number: phoneNumber,
          store_id: store?.id,
          store_name: store?.store_name,
          branch_id: store?.tenant_id,
        });

        await handleSubmitOrder(true);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(JSON.stringify(e));
    }
  };

  const handleOk = () => {
    navigation.replace('Order', { type: 'APPMOBILE' });
    setModalVisible(false);
    dispatch(resetCart());
  };

  useEffect(() => {
    handleShipping({
      delivery_info: {
        from: {
          store_id: store?.id,
          tenant_id: store?.tenant_id,
          tenant_name: store?.tenant?.tenant_name,
          phone: store?.phone,
          address: store?.address,
          street: store?.address,
          district: store?.address_district,
          city: store?.address_city,
          country: store?.address_country,
          note: '',
          lat: store?.lat,
          lng: store?.lng,
        },
        to: {
          contact_name: address?.user_name,
          phone: address?.user_phone,
          address: address?.address,
          lat: address?.lat,
          lng: address?.lng,
        },
      },
      amount: totalPrice,
    });
  }, [store, address, totalPrice]);

  useEffect(() => {
    if (cartItems.length > 0 && store && address && shippingPackage?.ship_fee) {
      handleCheckOrder(1);
    }
  }, [paymentMethod, cartItems, store, address, voucher, shippingPackage]);

  const handleShipping = async (data: any) => {
    try {
      const { data: shippingPackageData } = await OrderService.shippingPackage(data);
      console.log(shippingPackageData);
      if (Array.isArray(shippingPackageData)) {
        if (shippingPackageData.length > 0) {
          setShippingPackage(shippingPackageData[0]);
          setShippingPackageList([]);
        }
        return null;
      }
      const { package_optimization, package_estimate_ship } = shippingPackageData;

      if (package_estimate_ship) {
        setShippingPackage(
          !isEmpty(package_optimization)
            ? package_optimization
            : package_estimate_ship?.length > 0
            ? package_estimate_ship[0]
            : null
        );
        setShippingPackageList(package_estimate_ship);
        return null;
      }
      setShippingPackageList([]);
      setShippingPackage(shippingPackageData);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCheckOrder = async (event: number = 1) => {
    setLoading(true);

    try {
      const mapItem = [...cartItems].map(item => {
        const { product, quantity } = item;
        const amount = product.default_list_price * quantity;

        return {
          ...product,
          quantity,
          discount_amount: 0,
          doc_type: 'item',
          net_amount: amount,
          amount,
          voucher_discount_amount: 0,
          vat_amount: 0,
        };
      });
      const shippingFee = shippingPackage?.ship_fee || 0 + shippingPackage?.surcharge || 0;
      const data = {
        is_delivery: true,
        delivery_info: {
          from: {
            store_id: store?.id,
            tenant_id: store?.tenant_id,
            tenant_name: store?.tenant?.tenant_name,
            phone: store?.phone,
            address: store?.address,
            street: store?.address,
            district: store?.address_district,
            city: store?.address_city,
            country: store?.address_country,
            note: '',
            lat: store?.lat,
            lng: store?.lng,
          },
          to: {
            contact_name: address?.user_name,
            phone: address?.user_phone,
            address: address?.address,
            lat: address?.lat,
            lng: address?.lng,
          },
          ship_partner: {
            id: 'Ahamove',
            name: 'Ahamove',
          },
          net_fee: shippingFee,
          fee: shippingFee,
        },
        payment_info: [
          {
            method: paymentMethod?.id,
            name: paymentMethod?.name,
            net_amount: totalPrice,
            amount: totalPrice,
          },
        ],
        store_id: store?.id,
        tennant_id: store?.tenant_id,
        coupon_code: voucher?.promotion_no,
        items: mapItem,
      };
      const { data: checkedOrder } = await OrderService.checkOrder(data);
      if (event !== 7) {
        if (!checkedOrder.error_code && !checkedOrder.error_message) {
          setDataCheckedOrder(checkedOrder);
          setVoucherError(null);
        }
        if (checkedOrder.error_code === 'INVALID_VOUCHER') {
          setVoucherError(checkedOrder.error_message);
          setDataCheckedOrder({ ...dataCheckedOrder, voucher_discount_amount: 0 });
        }
      }
      console.log(checkedOrder);
      setLoading(false);
      return checkedOrder;
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const handleSubmitOrder = async (paid?: boolean) => {
    setLoading(true);
    try {
      const dataOrderOnline = {
        ...dataCheckedOrder,
        payment_status: paid ? 'paid' : 'unpaid',
        delivery_info: {
          ...(dataCheckedOrder?.delivery_info || {}),
          delivery_status: 'waiting',
        },
        salesorder_source: 'APPMOBILE',
        card_fee_amount: 0,
        card_fee_percent: 0,
        discount_percent: 0,
        discount_unit: 'VNĐ',
        received_amount: dataCheckedOrder?.amount,
        store_id: store?.id,
        store_name: store?.store_name,
        store_no: store?.store_no,
      };
      console.log(dataOrderOnline);
      const resOrder = await OrderService.orderOnline(dataOrderOnline);
      if (resOrder.status === 200) {
        setDataOrder(resOrder?.data);
        setModalVisible(true);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      Alert.alert(DEFAULT_TITLE, err || '');
    }
  };

  const shipFee = (shippingPackage?.ship_fee || 0) + (shippingPackage?.surcharge || 0);

  return (
    <>
      <Container withoutSafeView style={styles.root}>
        <View style={[styles.header, commonStyles.paddingHorizontal2x]}>
          {navigation.canGoBack() && (
            <Touchable
              hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
              onPress={navigation.goBack}
            >
              <Image source={goBack} />
            </Touchable>
          )}
          <Text size={18} weight="600">
            Giỏ hàng
          </Text>
          <View style={{ width: 18, height: 18 }} />
        </View>
        <View style={styles.body}>
          <ScrollView>
            <View
              style={[
                commonStyles.marginLeftGutter2x,
                commonStyles.marginRightGutter2x,
                commonStyles.marginTopGutter2x,
              ]}
            >
              <Text color="gray" weight="500">
                THÔNG TIN NGƯỜI NHẬN
              </Text>
              <View style={[commonStyles.marginTopGutter, commonStyles.marginBottomGutter2x]}>
                <View
                  style={[
                    commonStyles.row,
                    commonStyles.alignCenter,
                    commonStyles.spaceBetween,
                    commonStyles.marginTopGutter,
                    commonStyles.marginBottomGutter2x,
                  ]}
                >
                  <View style={[commonStyles.row, commonStyles.alignCenter]}>
                    <Avatar
                      size="small"
                      style={commonStyles.marginRightGutter}
                      source={
                        user?.contact_profile_pic
                          ? { uri: user?.contact_profile_pic }
                          : require('assets/img/avatar.png')
                      }
                    />
                    <Text weight="bold" size={14} color="black">
                      {user?.contact_name}
                    </Text>
                  </View>
                  <View style={[commonStyles.row, commonStyles.alignCenter]}>
                    <Icon color="gray" size={20} name="smartphone" />
                    <Text color="black" weight="500" size={14}>
                      {user?.contact_phone}
                    </Text>
                  </View>
                </View>
                <AddressSelector value={address} onChange={setAddress} />
                <StoreSelector value={store} onChange={setStore} />
                <ShippingPackages
                  data={shippingPackageList}
                  selectedItem={shippingPackage}
                  onChange={setShippingPackage}
                />
                <TextInput
                  multiline
                  numberOfLines={5}
                  placeholder="Thêm ghi chú"
                  inputStyle={styles.noteInput}
                />
              </View>
            </View>
            <View style={[commonStyles.marginLeftGutter2x, commonStyles.marginRightGutter2x]}>
              <Text color="gray" weight="500">
                CHI TIẾT ĐƠN HÀNG
              </Text>
              <View>
                {cartItems.map((item: any) => (
                  <FoodItem
                    item={item}
                    key={item?.id}
                    onPress={openModalEditCart(item)}
                    onRemovePress={removeProduct(item.product)}
                  />
                ))}
              </View>
              <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
                shippingPackage={shippingPackage}
              />
              <VoucherSelector value={voucher} onChange={setVoucher} error={voucherError} />
            </View>
            <View
              style={[
                commonStyles.marginLeftGutter2x,
                commonStyles.marginRightGutter2x,
                styles.sectionPrice,
              ]}
            >
              <View
                style={[
                  commonStyles.row,
                  commonStyles.alignCenter,
                  commonStyles.spaceBetween,
                  { marginBottom: 5 },
                ]}
              >
                <Text weight="500">Tổng giá sản phẩm</Text>
                <NumberFormatter suffix="đ" value={totalPrice} weight="500" />
              </View>

              <View
                style={[
                  commonStyles.row,
                  commonStyles.alignCenter,
                  commonStyles.spaceBetween,
                  { marginBottom: 5 },
                ]}
              >
                <Text weight="500">Phí giao hàng</Text>
                <NumberFormatter suffix="đ" value={shipFee} weight="500" />
              </View>

              <View style={{ marginBottom: 5 }}>
                <Text weight="500">Giảm giá</Text>
                <View
                  style={[
                    commonStyles.row,
                    commonStyles.alignCenter,
                    commonStyles.spaceBetween,
                    { marginBottom: 3, paddingLeft: 10 },
                  ]}
                >
                  <Text size={13}>+ Giảm giá hội viên</Text>
                  <NumberFormatter
                    suffix="đ"
                    prefix="-"
                    value={dataCheckedOrder?.member_discount || 0}
                    weight="500"
                  />
                </View>
                <View
                  style={[
                    commonStyles.row,
                    commonStyles.alignCenter,
                    commonStyles.spaceBetween,
                    { marginBottom: 3, paddingLeft: 10 },
                  ]}
                >
                  <Text size={13}>+ Giảm giá voucher</Text>
                  <NumberFormatter
                    suffix="đ"
                    prefix="-"
                    value={dataCheckedOrder?.voucher_discount_amount || 0}
                    weight="500"
                  />
                </View>
                <View
                  style={[
                    commonStyles.row,
                    commonStyles.alignCenter,
                    commonStyles.spaceBetween,
                    { marginBottom: 3, paddingLeft: 10 },
                  ]}
                >
                  <Text size={13}>+ Chiết khấu hạng thành viên</Text>
                  <NumberFormatter
                    suffix="đ"
                    prefix="-"
                    value={dataCheckedOrder?.rank_discount || 0}
                    weight="500"
                  />
                </View>
                <View
                  style={[
                    commonStyles.row,
                    commonStyles.alignCenter,
                    commonStyles.spaceBetween,
                    { marginBottom: 3, paddingLeft: 10 },
                  ]}
                >
                  <Text size={13}>+ Giảm phí giao hàng</Text>
                  <NumberFormatter
                    suffix="đ"
                    prefix="-"
                    value={dataCheckedOrder?.discount_fee || 0}
                    weight="500"
                  />
                </View>
              </View>
              <View style={[commonStyles.row, commonStyles.alignCenter, commonStyles.spaceBetween]}>
                <Text weight="500">Tổng cộng</Text>
                <NumberFormatter
                  suffix="đ"
                  value={dataCheckedOrder?.amount || totalPrice || 0}
                  weight="bold"
                  size={20}
                />
              </View>
            </View>
          </ScrollView>
          <Touchable style={styles.bottomPanel} onPress={toggleModalSubmit}>
            <Text color="white" weight="bold">
              Đặt hàng
            </Text>
          </Touchable>
        </View>
      </Container>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalSubmit}
        presentationStyle="overFullScreen"
        onRequestClose={() => setModalSubmit(false)}
        onDismiss={() => setModalSubmit(false)}
      >
        <View style={[styles.modalWrap, commonStyles.center, commonStyles.flex]}>
          <View style={styles.modal}>
            <View style={[commonStyles.center]}>
              <View style={commonStyles.marginBottomGutter}>
                <Image source={OderSubmitNoti} />
              </View>
              <Text color="primary" size={24} weight="bold">
                Xác nhận đặt hàng
              </Text>
              <View style={{ paddingHorizontal: theme.measure.gutter2x }}>
                <Text
                  size={15}
                  weight="500"
                  color="black"
                  align="center"
                  style={[commonStyles.marginBottomGutter]}
                >
                  Lưu ý: Dịch vụ giao hàng của LALANOW tạm nghỉ trong thời gian nghỉ lễ Tết Nguyên
                  Đán (từ 10/02/2021 đến hết 15/02/2021).
                </Text>
                <Text size={15} weight="500" color="black" align="center">
                  Đơn hàng của bạn sẽ được LALANOW giao vào ngày 16/02/2021. Bạn bấm tiếp tục để đặt
                  hàng nhé.
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Button
                  style={{ marginRight: 5 }}
                  fullWidth={false}
                  width={160}
                  onPress={toggleModalSubmit}
                >
                  Quay lại
                </Button>
                <Button
                  style={{ marginLeft: 5 }}
                  fullWidth={false}
                  width={160}
                  onPress={onPressSubmit}
                >
                  Tiếp tục
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalEditVisible}
        presentationStyle="overFullScreen"
        onRequestClose={() => setModalEditVisible(false)}
        onDismiss={() => setModalEditVisible(false)}
      >
        <View style={[styles.modalWrap, commonStyles.center, commonStyles.flex]}>
          <View style={styles.modal}>
            <Button
              fullWidth={false}
              variant="clear"
              style={styles.buttonCloseModal}
              onPress={closeModalEditCart}
            >
              <Icon name="close" size={24} />
            </Button>
            <View style={[commonStyles.center, styles.productImage]}>
              <Image
                source={{ uri: itemToEdit?.thumbnail || ImgProduct }}
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
                {itemToEdit?.item_name}
              </Text>
              <NumberFormatter
                value={itemToEdit?.list_price || 0}
                size={13}
                weight="500"
                suffix="đ"
                color={theme.getColor('primary')}
                style={commonStyles.marginRightGutter}
              />
              <Text size={13} weight="500" color="#AAAAAA">
                Số lượng còn {itemToEdit?.quantity} sản phẩm có sẵn
              </Text>
            </View>
            <View style={[commonStyles.row, commonStyles.center]}>
              <View style={[commonStyles.row, commonStyles.center]}>
                <Button
                  textProps={{ weight: '600', color: 'white' }}
                  style={styles.changeQuantityBtn}
                  onPress={updateModalQuantity(quantityToEdit - 1)}
                >
                  -
                </Button>
                <Text color="primary" size={16} weight="600" style={[commonStyles.marginGutter2x]}>
                  {quantityToEdit}
                </Text>
                <Button
                  textProps={{ weight: '600', color: 'white' }}
                  style={styles.changeQuantityBtn}
                  onPress={updateModalQuantity(
                    itemToEdit?.quantity <= quantityToEdit ? quantityToEdit : quantityToEdit + 1
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
                  {itemToEdit?.unit_name === 'Kilogram' ? 'KG' : itemToEdit?.unit_name}
                </Text>
              </View>
            </View>
            <View removeClippedSubviews style={[commonStyles.absolute, styles.modalFooter]}>
              <Button
                style={styles.btnEditCart}
                onPress={addToCartFromModal(itemToEdit, quantityToEdit)}
              >
                <View style={[commonStyles.row, commonStyles.spaceAround, commonStyles.flex]}>
                  <Text size={16} weight="600" color="white">
                    Cập nhật
                  </Text>
                  <NumberFormatter
                    value={itemToEdit?.list_price * quantityToEdit}
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
            <View style={[commonStyles.center]}>
              <View style={commonStyles.marginBottomGutter2x}>
                <Image source={OrderDone} />
              </View>
              <Text color="primary" size={24} weight="bold">
                {dataOrder?.salesorder_no?.toUpperCase()}
              </Text>
              <View style={styles.notiModal}>
                <Text
                  size={15}
                  weight="500"
                  color="black"
                  align="center"
                  style={[commonStyles.marginBottomGutter2x]}
                >
                  Đặt hàng thành công. Cảm ơn bạn đã sử dụng dịch vụ
                </Text>
              </View>
              <Button fullWidth={false} width={177} onPress={handleOk}>
                OK
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      {loading && (
        <View style={styles.fadeView}>
          <ActivityIndicator animating size="large" />
        </View>
      )}
    </>
  );
};

const FoodItem = ({ item, onPress, onRemovePress }: any) => {
  const diff = +item.product.default_list_price - +item.product.list_price;
  return (
    <View
      style={[
        commonStyles.row,
        commonStyles.alignCenter,
        commonStyles.spaceBetween,
        commonStyles.marginTopGutter,
        commonStyles.marginBottomGutter,
      ]}
    >
      <Flex style={[commonStyles.flex]}>
        <View style={styles.foodImg}>
          <Image
            resizeMode="cover"
            source={{ uri: item?.product?.thumbnail || ImgProduct }}
            style={styles.foodImg}
          />
        </View>
        <View style={[commonStyles.flex]}>
          <Text weight="500" style={commonStyles.breakLine}>
            {item.product.item_name}
          </Text>
          <View style={[commonStyles.row, commonStyles.alignCenter]}>
            <Text color="gray">SL: {item.quantity}</Text>
            <Touchable onPress={onPress} style={commonStyles.marginLeftGutter}>
              <Text color="primary" size={13}>
                Chỉnh sửa
              </Text>
            </Touchable>
            <Touchable onPress={onRemovePress} style={commonStyles.marginLeftGutter2x}>
              <Text color="red" size={13}>
                Xóa
              </Text>
            </Touchable>
          </View>
        </View>
      </Flex>
      <View style={{ alignItems: 'flex-end' }}>
        <NumberFormatter
          value={item.product.default_list_price * item.quantity}
          suffix="đ"
          weight="500"
        />
        {diff > 0 && (
          <NumberFormatter
            value={diff * item.quantity}
            prefix="-"
            suffix="đ"
            size={13}
            color="gray"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingTop: theme.measure.statusBarHeight,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    backgroundColor: theme.palette.background,
  },
  body: {
    flex: 9,
    backgroundColor: theme.palette.background,
    paddingBottom: 55 + theme.measure.bottomGutter,
  },
  noteInput: {
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    padding: 10,
    textAlign: 'left',
    paddingTop: 12,
    marginTop: 10,
  },
  sectionPrice: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: rgba(theme.palette.gray, 0.3),
    paddingVertical: 10,
    marginTop: 10,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: theme.palette.primary,
    height: 55 + theme.measure.bottomGutter,
    alignItems: 'center',
    justifyContent: 'center',
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
  productImage: {
    marginBottom: theme.measure.gutter * 1.5,
  },
  notiModal: {
    paddingHorizontal: theme.measure.gutter2x * 2,
    marginTop: theme.measure.gutter2x,
  },
  fadeView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodImg: {
    borderRadius: 5,
    borderColor: theme.palette.border,
    borderWidth: 1,
    width: 36,
    height: 36,
    marginRight: 10,
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
  btnEditCart: {
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

export default GoToMarket;
