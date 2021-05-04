import { Button, EmptyData, Flex, Text, theme } from 'components';
import { AppLayout } from 'layouts';
import React, { useEffect } from 'react';
import { Animated, Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import s from 'theme/commonStyles';
import IconAdd from 'assets/img/add.png';
import { useNavigation } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import IconEdit from 'assets/img/edit-icon.png';
import IconDelete from 'assets/img/delete-icon.png';
import { useDispatch } from 'react-redux';
import { getAllAddress } from 'redux-store/address';
import { useSelector } from 'redux-store/store';
import { IAddress } from 'models/address';
import IconMap from 'assets/img/map-icon.png';

const AddressSaved = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { addressList, loading } = useSelector(state => state.address);

  const handleDelete = () => {};
  const handleOnEdit = () => {
    navigation.navigate('AddAddress');
  };

  useEffect(() => {
    dispatch(getAllAddress());
  }, []);

  const renderRightActions = (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [-300, -100, 0, 100, 101],
      outputRange: [0, 0, 1, 0, 0],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View
        style={[
          styles.action,
          {
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <Button style={styles.buttonAction} variant="opacity-bg" onPress={handleOnEdit}>
          <Image source={IconEdit} />
        </Button>
        <Button style={styles.buttonAction} variant="opacity-bg" color="red" onPress={handleDelete}>
          <Image source={IconDelete} />
        </Button>
      </Animated.View>
    );
  };

  return (
    <AppLayout
      title="Địa chỉ đã lưu"
      scrollEnabled
      right={
        <Flex>
          <Image source={IconAdd} style={[{ marginRight: theme.measure.gutter / 2 }]} />
          <Text weight="500" color="primary">
            Thêm
          </Text>
        </Flex>
      }
      onPressRight={() =>
        navigation.navigate('AddAddress', {
          onAddDone: () => {
            navigation.goBack();
            dispatch(getAllAddress());
          },
        })
      }
      style={{ backgroundColor: theme.palette.layoutBackground }}
    >
      <View style={[{ paddingTop: theme.measure.gutter * 1.5 }]}>
        <View style={styles.padding}>
          {addressList.length === 0 && <EmptyData />}
          {!!loading && (
            <ActivityIndicator color={theme.palette.gray} style={[s.paddingVertical]} />
          )}

          {addressList.map((address: IAddress) => {
            return (
              <Swipeable key={address.id} renderRightActions={renderRightActions}>
                <Flex
                  style={[
                    styles.address,
                    styles.padding,
                    s.paddingVertical,
                    s.shadowItem,
                    s.marginBottomGutter,
                  ]}
                >
                  <Image source={IconMap} />
                  <View style={[{ marginLeft: theme.measure.gutter * 1.5 }]}>
                    <Text size={12} weight="500">
                      {address.address_name}
                    </Text>
                    <Text weight="500">{address.address}</Text>
                  </View>
                </Flex>
              </Swipeable>
            );
          })}
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  address: {
    backgroundColor: theme.getColor('white'),
    borderRadius: 10,
  },
  padding: {
    paddingHorizontal: theme.measure.gutter * 1.5,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonAction: {
    height: 45,
    width: 45,
    marginLeft: 8,
    borderRadius: 6,
  },
});

export default AddressSaved;
