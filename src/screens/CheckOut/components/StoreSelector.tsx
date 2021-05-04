import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import * as theme from 'theme';
import commonStyles from 'theme/commonStyles';
import { getStores } from 'services/order';
import { rgba } from 'polished';
import AMGIcon from 'components/Icon';

const StoreSelector = ({ value, onChange }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>(null);
  const [stores, setStores] = useState<any[]>([]);

  const getData = async () => {
    try {
      setLoading(true);
      const result = await getStores();
      const arr = result.data;
      setStores(arr);

      if (arr.length > 0) {
        const matched = arr.find((item: any) => item?.id === value?.id);
        setSelected(matched || arr[0]);
        console.log(matched, arr[0]);
        if (!matched) {
          onChange(arr[0]);
        }
      } else {
        setSelected(null);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChangeMethod = (method: any) => () => {
    setSelected(method);
    setModalVisible(false);
    onChange(method);
  };
  return loading ? (
    <View style={[commonStyles.marginTopGutter2x, commonStyles.marginBottomGutter]}>
      <ActivityIndicator color="#999999" />
    </View>
  ) : (
    <>
      <Touchable onPress={() => setModalVisible(true)}>
        <View style={[commonStyles.row, commonStyles.alignCenter, styles.storeSelector]}>
          <AMGIcon name="store" color="gray" size={24} style={commonStyles.marginRightGutter} />
          <View>
            <Text size={12} color="gray">
              Mua hàng từ
            </Text>
            <Text weight="bold">{selected?.store_name}</Text>
          </View>
        </View>
      </Touchable>
      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modal}>
          {stores.map((item: any, index) => (
            <Touchable key={item.id} onPress={handleChangeMethod(item)}>
              <View
                style={[
                  styles.paymentItem,
                  index === stores.length - 1 ? styles.noBottomBorder : {},
                  item?.id === selected?.id ? styles.active : {},
                ]}
              >
                <Text weight="bold" color={item?.id === selected?.id ? 'primary' : 'black'}>
                  {item.store_name}
                </Text>
                <Text size={11} color={item?.id === selected?.id ? 'primary' : 'gray'}>
                  {item.address}
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

export default StoreSelector;
