import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import * as theme from 'theme';
import commonStyles from 'theme/commonStyles';
import { getAllAddress } from 'services/address';
import { rgba } from 'polished';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddressSelector = ({ value, onChange }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>(null);
  const [stores, setStores] = useState<any[]>([]);
  const navigation = useNavigation();

  const getData = async (newAddress?: any) => {
    try {
      setLoading(true);
      const result = await getAllAddress();
      const arr = result.data;
      setStores(arr);

      if (arr.length > 0) {
        if (!newAddress) {
          const matched = arr.find((item: any) => item?.id === value?.id);
          setSelected(matched || arr[0]);
          if (!matched) {
            onChange(arr[0]);
          }
        } else {
          const matched = arr.find((item: any) => item?.id === newAddress?.id);
          setSelected(matched || arr[0]);
          onChange(matched || arr[0]);
        }
      } else {
        setSelected(null);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
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

  const goToAddAddress = () => {
    setModalVisible(false);
    navigation.navigate('AddAddress', {
      onAddDone: (newAddress?: any) => {
        navigation.goBack();
        getData(newAddress);
      },
    });
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator color="#999999" />
      ) : selected ? (
        <View
          style={[
            commonStyles.row,
            commonStyles.alignCenter,
            commonStyles.spaceBetween,
            commonStyles.marginBottomGutter,
          ]}
        >
          <View style={styles.miniMap}>
            <Image source={require('assets/img/map-example.png')} />
          </View>
          <View
            style={[
              commonStyles.marginLeftGutter,
              commonStyles.marginRightGutter,
              commonStyles.flex,
            ]}
          >
            <Text size={14} color="gray">
              Giao hàng tới địa chỉ
            </Text>
            <Text weight="bold">{selected?.address}</Text>
          </View>
          <Touchable
            style={[commonStyles.row, commonStyles.alignCenter]}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="edit" size={18} color={theme.palette.primary} />
            <Text color="primary">Sửa</Text>
          </Touchable>
        </View>
      ) : (
        <Touchable
          style={[
            commonStyles.row,
            commonStyles.alignCenter,
            commonStyles.justifyCenter,
            commonStyles.marginBottomGutter,
            styles.addButton,
          ]}
          onPress={goToAddAddress}
        >
          <Icon
            name="add"
            color={theme.palette.text.primary}
            size={22}
            style={commonStyles.marginRightGutter}
          />
          <Text weight="500" color="primary">
            Thêm địa chỉ nhận hàng
          </Text>
        </Touchable>
      )}
      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modal}>
          {stores.map((item: any) => (
            <Touchable key={item._id} onPress={handleChangeMethod(item)}>
              <View style={[styles.paymentItem, item?.id === selected?.id ? styles.active : {}]}>
                <Text
                  size={12}
                  weight="500"
                  color={item?.id === selected?.id ? 'primary' : 'black'}
                >
                  {item.address_name}
                </Text>
                <Text weight="500" color={item?.id === selected?.id ? 'primary' : 'black'}>
                  {item.address}
                </Text>
              </View>
            </Touchable>
          ))}
          <Touchable onPress={goToAddAddress}>
            <View style={[styles.paymentItem, styles.noBottomBorder]}>
              <Text weight="500" color={'primary'}>
                Thêm địa chỉ
              </Text>
            </View>
          </Touchable>
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
  miniMap: {
    width: 70,
    height: 70,
    borderRadius: 10,
    flexShrink: 0,
  },
  addButton: {
    padding: theme.measure.gutter2x,
    borderWidth: 1,
    borderColor: theme.palette.primary,
    borderStyle: 'dashed',
    borderRadius: theme.measure.borderRadius,
  },
});

export default AddressSelector;
