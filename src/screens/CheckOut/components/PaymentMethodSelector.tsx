import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import * as theme from 'theme';
import commonStyles from 'theme/commonStyles';
// import { getPaymentMethods } from 'services/order';
import { rgba } from 'polished';

const methods = [
  {
    _id: 'ff3faf87a801096a5acfe103e901cb1a',
    _rev: '1-1e1ce125f665eef003f67a5a9ddd031e',
    name: 'Ví điện tử MOMO',
    payment_method: 'E_WALLET',
    description: 'Ví điện tử MOMO',
    sort: 100,
    active: true,
    image:
      'https://heovang.ss-hn-1.vccloud.vn:443/images/merchant-profile/1569230286172-ic_momo3x.jpg',
    doc_type: 'payment_method',
    created_at: 1604892126,
    created_by: null,
    updated_at: 1604892126,
    updated_by: null,
    deleted: null,
    deleted_by: null,
    deleted_at: null,
    id: 'MOMO_APP',
  },
  {
    _id: 'ff3faf87a801096a5acfe103e901f04a',
    _rev: '3-9d389510a4cd18d88441a865da80def8',
    name: 'Thanh toán khi nhận hàng (COD)',
    payment_method: 'COD',
    description: 'Thanh toán khi nhận hàng ',
    sort: 100,
    active: true,
    image: null,
    doc_type: 'payment_method',
    created_at: 1605165859,
    created_by: null,
    updated_at: 1605165859,
    updated_by: null,
    deleted: null,
    deleted_by: null,
    deleted_at: null,
    tenant_id: 'AMG',
    id: 'COD',
  },
];

const PaymentMethodSelector = ({ value, onChange, shippingPackage }: any) => {
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [selected, setSelected] = useState<any>(
    methods.find(item => item.id === value?.id) || methods[0]
  );
  const [paymentMethods] = useState<any[]>(methods);

  useEffect(() => {
    onChange(selected);
  }, [selected]);
  useEffect(() => {
    if (shippingPackage?.distance > 10) {
      setSelected(methods[0]);
    }
  }, [shippingPackage]);

  const handleChangeMethod = (method: any) => () => {
    if (!!shippingPackage && shippingPackage?.distance > 10 && method.id === methods[1].id) {
      return null;
    }
    setSelected(method);
    setModalVisible(false);
  };

  return (
    <>
      <View
        style={[
          commonStyles.row,
          commonStyles.alignCenter,
          commonStyles.spaceBetween,
          styles.storeSelector,
        ]}
      >
        <View>
          <Text size={12} color="gray">
            Hình thức thanh toán
          </Text>
          <Text weight="bold">{selected?.name}</Text>
        </View>
        <Touchable style={[commonStyles.row, commonStyles.alignCenter]}>
          <Text color="primary" size={14} weight="bold" onPress={() => setModalVisible(true)}>
            Thay đổi
          </Text>
          <Icon name="chevron-right" color={theme.palette.primary} size={20} />
        </Touchable>
      </View>
      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modal}>
          {paymentMethods.map((item: any, index) => (
            <Touchable
              key={item._id}
              onPress={handleChangeMethod(item)}
              activeOpacity={
                !!shippingPackage && shippingPackage?.distance > 10 && index === 1 ? 1 : 0.8
              }
            >
              <View
                style={[
                  styles.paymentItem,
                  index === paymentMethods.length - 1 ? styles.noBottomBorder : {},
                  item.id === selected?.id ? styles.active : {},
                  !!shippingPackage && shippingPackage?.distance > 10 && index === 1
                    ? styles.disabled
                    : {},
                ]}
              >
                <Text weight="500" color={item.id === selected?.id ? 'primary' : 'black'}>
                  {item.name}
                </Text>
              </View>
            </Touchable>
          ))}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  storeSelector: {
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    padding: 10,
  },
  modal: {
    backgroundColor: theme.palette.background,
    borderRadius: theme.measure.borderRadius * 1.5,
    paddingVertical: theme.measure.gutter,
  },
  paymentItem: {
    paddingVertical: theme.measure.gutter,
    paddingHorizontal: theme.measure.gutter2x,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.palette.border,
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  active: {
    backgroundColor: rgba(theme.palette.primary, 0.1),
  },
  disabled: {
    opacity: 0.3,
  },
});

export default PaymentMethodSelector;
