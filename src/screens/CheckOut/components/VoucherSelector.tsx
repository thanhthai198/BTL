import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AMGIcon from 'components/Icon';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import * as theme from 'theme';
import commonStyles from 'theme/commonStyles';
import { getAllVoucher } from 'services/voucher';
import { rgba } from 'polished';
import moment from 'moment';

const VoucherSelector = ({ value, onChange, error }: any) => {
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [selected, setSelected] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const getData = async () => {
    try {
      const result = await getAllVoucher();
      const arr = result.data.filter((item: any) => item.status === 'active');
      setPaymentMethods(arr);
      if (arr.length === 0) {
        return null;
      }

      const matched = arr.find((item: any) => item.id === value?.id);
      if (!matched) {
        // setSelected(arr[0]);
        // onChange(arr[0]);
        return null;
      }
      setSelected(matched);
    } catch (e) {}
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChangeMethod = (method: any) => () => {
    setSelected(method);
    setModalVisible(false);
    onChange(method);
  };

  return (
    <>
      <Touchable
        style={[
          commonStyles.row,
          commonStyles.alignCenter,
          commonStyles.paddingVertical,
          commonStyles.marginTopGutter,
          commonStyles.flex,
        ]}
        onPress={() => setModalVisible(true)}
      >
        {!selected ? (
          <View style={[commonStyles.row, commonStyles.alignCenter, commonStyles.flex]}>
            <AMGIcon
              name="coupon"
              color={theme.palette.primary}
              style={{ marginRight: 10 }}
              size={18}
            />
            <Text color="gray">Bạn có mã giảm giá?</Text>
          </View>
        ) : (
          <View style={[commonStyles.row, commonStyles.alignCenter, commonStyles.flex]}>
            <AMGIcon
              name="coupon"
              color={theme.palette.primary}
              style={{ marginRight: 10 }}
              size={18}
            />
            <Text>{selected?.promotion_no}</Text>
            <Touchable
              style={{ marginLeft: 15 }}
              onPress={() => {
                setSelected(null);
                onChange(null);
              }}
            >
              <Icon name="cancel" size={18} />
            </Touchable>
          </View>
        )}
        {!!error && (
          <Text color="red" size={13}>
            {error}
          </Text>
        )}
      </Touchable>
      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <Text
            size={18}
            weight="500"
            style={[commonStyles.marginBottomGutter, commonStyles.paddingHorizontal]}
          >
            Chọn mã giảm giá
          </Text>
          {paymentMethods.map((item: any, index) => (
            <Touchable key={item.id} onPress={handleChangeMethod(item)}>
              <View
                style={[
                  styles.paymentItem,
                  index === paymentMethods.length - 1 ? styles.noBottomBorder : {},
                  item.id === selected?.id ? styles.active : {},
                ]}
              >
                <Text weight="500" color="primary">
                  {item.promotion_name}
                </Text>
                <Text size={12} color={item.id === selected?.id ? 'primary' : 'gray'}>
                  {moment(item.expire_at).format('DD/MM/YYYY')}
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
});

export default VoucherSelector;
