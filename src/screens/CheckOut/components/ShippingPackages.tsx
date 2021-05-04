import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { rgba } from 'polished';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NumberFormatter, Text, theme } from 'components';
import commonStyles from 'theme/commonStyles';
import Touchable from 'components/Touchable';

export const ShippingPackages = ({ data, selectedItem, onChange }: any) => {
  const [modalVisible, setModalVisible] = useState<any>(false);
  return !selectedItem ? (
    <View style={[commonStyles.marginTopGutter2x, commonStyles.marginBottomGutter]}>
      <ActivityIndicator color="#999999" />
    </View>
  ) : (
    <>
      <View style={commonStyles.marginTopGutter}>
        <View
          style={[
            commonStyles.row,
            commonStyles.alignCenter,
            commonStyles.spaceBetween,
            styles.storeSelector,
          ]}
        >
          {(selectedItem?.message_estimate_fee ||
            (selectedItem?.title && selectedItem?.description)) && (
            <Icon name="error-outline" color={theme.palette.orange} size={30} />
          )}
          <View
            style={[
              commonStyles.marginLeftGutter,
              commonStyles.marginRightGutter,
              commonStyles.flex,
            ]}
          >
            <Text size={14} color="gray">
              Phương thức giao hàng
            </Text>
            {selectedItem?.ship_item_name && (
              <Text weight="bold">{selectedItem?.ship_item_name}</Text>
            )}
            {selectedItem?.surcharge > 0 && (
              <Text size={11} color="gray">
                Phụ phí:{' '}
                <NumberFormatter size={11} suffix="đ" value={selectedItem.surcharge} weight="500" />{' '}
              </Text>
            )}
            {((selectedItem?.message_estimate_fee && selectedItem?.description) ||
              (selectedItem?.title && selectedItem?.description)) && (
              <>
                <Text weight="bold" color="orange">
                  {selectedItem?.description}
                </Text>
                {selectedItem.amount_add > 0 && (
                  <Text size={11} color="gray">
                    Bạn cần mua thêm{' '}
                    <NumberFormatter
                      size={11}
                      suffix="đ"
                      value={selectedItem.amount_add}
                      weight="500"
                    />{' '}
                    để được hưởng ưu đãi phí vận chuyển
                  </Text>
                )}
              </>
            )}
          </View>
          {data.length > 0 && (
            <Touchable
              style={[commonStyles.row, commonStyles.alignCenter]}
              onPress={() => setModalVisible(true)}
            >
              <Icon name="edit" size={18} color={theme.palette.primary} />
              <Text color="primary">Sửa</Text>
            </Touchable>
          )}
        </View>
      </View>
      <Modal
        isVisible={modalVisible}
        style={[commonStyles.flexEnd, { margin: 0 }]}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <Text
            style={[commonStyles.marginBottomGutter2x, commonStyles.paddingHorizontal]}
            size={16}
            weight="bold"
          >
            Chọn phương thức giao hàng
          </Text>
          {data?.map((item: any, index: number) => (
            <Touchable
              key={item._id}
              onPress={() => {
                onChange(item);
                setModalVisible(false);
              }}
            >
              <View
                style={[
                  styles.paymentItem,
                  index === data?.length - 1 ? styles.noBottomBorder : {},
                  item?.id === selectedItem?.id ? styles.active : {},
                ]}
              >
                <Text weight="bold" color={item?.id === selectedItem?.id ? 'primary' : 'black'}>
                  {item.ship_item_name}
                </Text>
                {item.surcharge > 0 && (
                  <Text size={11} color="gray">
                    Phụ phí:{' '}
                    <NumberFormatter size={11} suffix="đ" value={item.surcharge} weight="500" />{' '}
                  </Text>
                )}
                <Text size={11} color={item?.id === selectedItem?.id ? 'primary' : 'gray'}>
                  {item.description}
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
    minHeight: '50%',
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
