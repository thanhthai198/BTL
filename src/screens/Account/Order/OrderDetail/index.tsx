import { Flex, Icon, NumberFormatter, Text, theme } from 'components';
import Avatar from 'components/Avatar';
import { AppLayout } from 'layouts';
import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'redux-store/store';
import s from 'theme/commonStyles';
import AMGIcon from 'components/Icon';
import { rgba } from 'polished';
import { OrderType } from 'models/order';
import GiftImg from 'assets/img/gift.png';

const ImgProduct = 'https://static.lalanow.com.vn/default_product.png';

const OrderDetail = () => {
  const user = useSelector(state => state.auth?.user);
  const orderDetail = useSelector(state => state.order.orderDetail);

  const totalOrder = useMemo(() => {
    const total = orderDetail.salesorder_items?.reduce(
      (sum: any, item: any) => sum + item.list_price * item.quantity,
      0
    );
    return total || 0;
  }, [orderDetail.salesorder_items]);

  const isShowVoucher = orderDetail.coupon_code !== null && orderDetail.voucher_discount > 0;

  return (
    <AppLayout
      title={`Đơn hàng ${orderDetail?.salesorder_no?.toUpperCase()}`}
      backgroundColor={theme.getColor('white')}
      right={
        <Flex alignItems="center">
          <Icon
            name="phone"
            size={18}
            color={theme.getColor('primary')}
            style={styles.iconHeader}
          />
          <Text color="primary" size={14} weight="500">
            Hỗ trợ
          </Text>
        </Flex>
      }
    >
      <View>
        {orderDetail.salesorder_source === 'BUSINESSORDER' && (
          <View
            style={[
              s.center,
              {
                paddingHorizontal: theme.measure.gutter4x + 10,
                paddingBottom: theme.measure.gutter3x,
              },
            ]}
          >
            <Image resizeMode="cover" source={GiftImg} />
            <Text size={17} weight="600" color="primary" align="center">
              Chúc mừng ! Bạn có 1 Đơn hàng từ công ty gửi tặng bạn
            </Text>
          </View>
        )}
        {orderDetail.salesorder_source === 'APPMOBILE' && renderTracking(orderDetail)}
        {orderDetail.salesorder_source === 'APPMOBILE' && (
          <View style={styles.receiver}>
            <Text size={15} weight="500" color="gray">
              THÔNG TIN NGƯỜI NHẬN
            </Text>
            <View style={[s.marginTopGutter, s.marginBottomGutter2x]}>
              <View
                style={[
                  s.row,
                  s.alignCenter,
                  s.spaceBetween,
                  s.marginTopGutter,
                  s.marginBottomGutter2x,
                ]}
              >
                <View style={[s.row, s.alignCenter]}>
                  <Avatar
                    size="small"
                    style={s.marginRightGutter}
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
                <View style={[s.row, s.alignCenter]}>
                  <Icon color="gray" size={20} name="mobile" style={[s.marginRightGutter]} />
                  <Text color="black" weight="500" size={14}>
                    {user?.contact_phone}
                  </Text>
                </View>
              </View>

              <View style={[s.row, s.alignCenter, s.marginBottomGutter]}>
                <View style={styles.miniMap}>
                  <Image source={require('assets/img/map-example.png')} />
                </View>
                <View style={[s.flex, s.marginLeftGutter, s.marginRightGutter]}>
                  <Text size={14} color="gray">
                    Giao hàng tới địa chỉ
                  </Text>
                  <Text weight="bold">{orderDetail.delivery_info.to.address}</Text>
                </View>
              </View>
              {orderDetail.note && (
                <Flex
                  style={[
                    styles.borderBottom,
                    s.paddingVertical,
                    {
                      marginHorizontal: -theme.measure.gutter * 1.5,
                      paddingHorizontal: theme.measure.gutter * 1.5,
                    },
                  ]}
                >
                  <Icon
                    size={20}
                    color={theme.getColor('gray')}
                    name="note"
                    style={[s.marginRightGutter]}
                  />
                  <Text weight="500">{orderDetail.note}</Text>
                </Flex>
              )}

              <View style={[s.row, s.alignCenter, styles.storeSelector]}>
                <AMGIcon name="store" color="gray" size={24} style={s.marginRightGutter} />
                <View style={[s.flex]}>
                  <Text size={12} color="gray">
                    Mua hàng từ
                  </Text>
                  <Text weight="bold">{orderDetail.delivery_info.from.address}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        <View style={{ paddingHorizontal: theme.measure.gutter * 1.5 }}>
          <View
            style={[
              styles.borderBottom,
              styles.resetContainer,
              { marginTop: theme.measure.gutter * 1.5 },
            ]}
          >
            <Text color="gray" weight="500">
              CHI TIẾT ĐƠN HÀNG
            </Text>
            <View style={[s.marginBottomGutter]}>
              {orderDetail.salesorder_items?.map((item: any) => (
                <FoodItem item={item} key={item.item_id} />
              ))}
            </View>
          </View>
          {!!isShowVoucher && (
            <View
              style={[
                styles.borderSection,
                {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  marginHorizontal: -theme.measure.gutter * 1.5,
                  paddingHorizontal: theme.measure.gutter * 1.5,
                },
              ]}
            >
              {/* <View style={[styles.borderBottom, s.paddingVertical, styles.resetContainer]}>
                <Text size={13} weight="500" color="primary" style={[s.marginBottomGutter]}>
                  Mã khuyến mại LaLaNow
                </Text>
                <Flex justifyContent="space-between">
                  <Flex>
                    <Icon
                      name="coupon"
                      size={18}
                      color={theme.getColor('primary')}
                      style={[s.marginRightGutter]}
                    />
                    <Text weight="500">{orderDetail.salesorder_no}</Text>
                  </Flex>

                  <NumberFormatter value={20000} size={13} suffix="đ" color="primary" />
                </Flex>
              </View> */}
              <View style={[s.paddingVertical, styles.resetContainer]}>
                <Text size={13} weight="500" color="primary" style={[s.marginBottomGutter]}>
                  Mã voucher ưu đãi của bạn
                </Text>
                <Flex justifyContent="space-between">
                  <Flex>
                    <Icon
                      name="coupon"
                      size={18}
                      color={theme.getColor('primary')}
                      style={[s.marginRightGutter]}
                    />
                    <Text weight="500">{orderDetail.coupon_code}</Text>
                  </Flex>

                  <NumberFormatter
                    value={orderDetail.voucher_discount}
                    size={13}
                    suffix="đ"
                    color="primary"
                  />
                </Flex>
              </View>
            </View>
          )}

          <View style={[styles.sectionPrice]}>
            <View
              style={[
                s.row,
                s.alignCenter,
                s.spaceBetween,
                { marginBottom: theme.measure.gutter / 2 },
              ]}
            >
              <Text weight="500">Tổng giá sản phẩm</Text>
              <NumberFormatter suffix="đ" value={orderDetail?.amount_item_default} weight="500" />
            </View>
            {!!isShowVoucher && (
              <Flex justifyContent="space-between">
                <Flex>
                  <Icon
                    name="coupon"
                    size={18}
                    color={theme.getColor('primary')}
                    style={[s.marginRightGutter]}
                  />
                  <Text weight="500">{orderDetail.coupon_code}KM8979989</Text>
                </Flex>

                <NumberFormatter
                  value={-orderDetail.voucher_discount}
                  size={13}
                  suffix="đ"
                  color="primary"
                />
              </Flex>
            )}
            <View
              style={[
                s.row,
                s.alignCenter,
                s.spaceBetween,
                { marginBottom: theme.measure.gutter / 2 },
              ]}
            >
              <Text weight="500">Phí giao hàng</Text>
              <NumberFormatter suffix="đ" value={orderDetail?.delivery_info?.fee} weight="500" />
            </View>

            <View style={{ marginBottom: 5 }}>
              <Text weight="500">Giảm giá</Text>
              <View
                style={[s.row, s.alignCenter, s.spaceBetween, { marginBottom: 3, paddingLeft: 10 }]}
              >
                <Text size={13}>+ Giảm giá hội viên</Text>
                <NumberFormatter
                  suffix="đ"
                  prefix="-"
                  value={orderDetail?.member_discount || 0}
                  weight="500"
                />
              </View>
              <View
                style={[s.row, s.alignCenter, s.spaceBetween, { marginBottom: 3, paddingLeft: 10 }]}
              >
                <Text size={13}>+ Giảm giá voucher</Text>
                <NumberFormatter
                  suffix="đ"
                  prefix="-"
                  value={orderDetail?.voucher_discount_amount || 0}
                  weight="500"
                />
              </View>
              <View
                style={[s.row, s.alignCenter, s.spaceBetween, { marginBottom: 3, paddingLeft: 10 }]}
              >
                <Text size={13}>+ Chiết khấu hạng thành viên</Text>
                <NumberFormatter
                  suffix="đ"
                  prefix="-"
                  value={orderDetail?.rank_discount || 0}
                  weight="500"
                />
              </View>
              <View
                style={[s.row, s.alignCenter, s.spaceBetween, { marginBottom: 3, paddingLeft: 10 }]}
              >
                <Text size={13}>+ Giảm phí giao hàng</Text>
                <NumberFormatter
                  suffix="đ"
                  prefix="-"
                  value={orderDetail?.delivery_info?.discount_fee || 0}
                  weight="500"
                />
              </View>
            </View>
            <View style={[s.row, s.alignCenter, s.spaceBetween, s.marginBottomGutter]}>
              <Text weight="500">Thành tiền</Text>
              <NumberFormatter suffix="đ" value={orderDetail.amount} weight="bold" size={20} />
            </View>
            <Text align="right" size={13} weight="500" color="primary">
              Điểm cộng +{Math.floor(totalOrder / 10000)}
            </Text>
          </View>

          {orderDetail.payment_methods?.[0] && (
            <View style={[styles.typePayment]}>
              <Text size={12} color="gray">
                Hình thức thanh toán
              </Text>
              {orderDetail.salesorder_source === 'BUSINESSORDER' ? (
                <Text size={15} weight="600" color="primary">
                  Đã thanh toán
                </Text>
              ) : (
                <Text weight="bold">{orderDetail.payment_methods?.[0]?.name}</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </AppLayout>
  );
};

const renderTracking = (data: OrderType) => {
  const status = data.salesorder_status;
  return (
    <View style={[styles.tracking, styles.borderBottom]}>
      <View style={styles.street}>
        {/* Step 1 */}
        <View style={styles.step1}>
          <Flex justifyContent="flex-start" style={styles.statusDone}>
            <View
              style={[
                styles.circle,
                s.center,
                (status === 'confirm' || status === 'delivery' || status === 'completed') &&
                  styles.activeStatus,
              ]}
            >
              <Icon name="done" color={theme.getColor('white')} />
            </View>
          </Flex>
          <Text
            size={13}
            weight="500"
            color={
              status === 'confirm' || status === 'delivery' || status === 'completed'
                ? 'primary'
                : 'gray'
            }
            align="center"
            style={[styles.stepText]}
          >
            Siêu thị đã xác nhận
          </Text>
        </View>
        {/* Step 2 */}
        <View style={styles.step2}>
          <Flex justifyContent="center">
            <View
              style={[
                styles.circle,
                s.center,
                (status === 'delivery' || status === 'completed') && styles.activeStatus,
              ]}
            >
              <Icon name="done" color={theme.getColor('white')} />
            </View>
          </Flex>
          <Text
            size={13}
            weight="500"
            color={status === 'delivery' || status === 'completed' ? 'primary' : 'gray'}
          >
            Đang giao hàng
          </Text>
        </View>
        {/* Step 3 */}
        <View style={styles.step3}>
          <Flex justifyContent="flex-end">
            <View style={[styles.circle, s.center, status === 'completed' && styles.activeStatus]}>
              <Icon name="done" color={theme.getColor('white')} />
            </View>
          </Flex>
          <Text
            size={13}
            weight="500"
            color={status === 'completed' ? 'primary' : 'gray'}
            style={styles.stepText3}
          >
            Hoàn thành
          </Text>
        </View>
      </View>
    </View>
  );
};

const FoodItem = ({ item }: any) => {
  const diff = +item.default_list_price - +item.list_price;
  return (
    <View style={[s.row, s.spaceBetween, s.marginTopGutter, s.marginBottomGutter]}>
      <Flex style={[s.flex]}>
        <View style={styles.foodImg}>
          <Image
            resizeMode="cover"
            source={{ uri: item.thumbnail || ImgProduct }}
            style={styles.foodImg}
          />
        </View>
        <View style={[s.flex]}>
          <Text weight="500" style={s.breakLine}>
            {item.item_name}
          </Text>
          <View style={[s.row, s.alignCenter]}>
            <Text color="gray">SL: {item.quantity}</Text>
          </View>
        </View>
      </Flex>

      <View style={{ alignItems: 'flex-end' }}>
        <NumberFormatter value={item.default_list_price * item.quantity} suffix="đ" weight="500" />
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
  borderBottom: {
    borderBottomColor: '#E1E1E1',
    borderBottomWidth: 1,
  },
  iconHeader: {
    marginRight: theme.measure.gutter / 2,
  },
  tracking: {
    flex: 1,
    paddingHorizontal: theme.measure.gutter3x * 2,
    paddingTop: 15,
    height: 86,
  },
  street: {
    height: 0.6,
    backgroundColor: '#CFCFCF',
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 50,
    backgroundColor: 'white',
    borderColor: '#CFCFCF',
    borderWidth: 1,
    marginBottom: 5,
  },
  step1: {
    position: 'absolute',
    top: -9,
    left: -2,
    textAlign: 'center',
  },
  step2: {
    position: 'absolute',
    top: -9,
  },
  step3: {
    position: 'absolute',
    top: -9,
    right: 0,
    textAlign: 'center',
  },
  stepText: {
    maxWidth: 70,
    left: '-40%',
  },
  stepText3: {
    right: '-50%',
  },
  miniMap: {
    width: 70,
    height: 70,
    borderRadius: 10,
    flexShrink: 0,
  },
  receiver: {
    paddingHorizontal: 15,
    paddingTop: 15,
    borderColor: '#F3F3F3',
    borderWidth: 1,
  },
  storeSelector: {
    paddingVertical: 10,
  },
  foodImg: {
    borderRadius: 5,
    borderColor: theme.palette.border,
    borderWidth: 1,
    width: 36,
    height: 36,
    marginRight: 10,
  },
  borderSection: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: rgba(theme.palette.gray, 0.3),
  },
  sectionPrice: {
    paddingVertical: 10,
    marginTop: 10,
  },
  typePayment: {
    borderRadius: 10,
    backgroundColor: '#F3F3F3',
    padding: 10,
    marginBottom: 20,
  },
  resetContainer: {
    marginHorizontal: -15,
    paddingHorizontal: 15,
  },
  statusDone: {},
  activeStatus: {
    backgroundColor: theme.getTextColor('primary'),
    color: theme.getTextColor('primary'),
  },
});

export default OrderDetail;
