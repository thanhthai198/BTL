import React from 'react';
import { View, TouchableOpacity, Linking, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import IconMater from 'react-native-vector-icons/MaterialIcons';
import Touchable from 'components/Touchable';
import { Text, theme, Icon, Flex } from 'components';

const Communication = () => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  const MakeCall = () => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${1900 299980}';
    } else {
      phoneNumber = 'telprompt:${1900 299980}';
    }

    Linking.openURL(phoneNumber);
  };
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Touchable
          style={{
            width: theme.measure.buttonIcon.normal,
            height: theme.measure.buttonIcon.normal,
            justifyContent: 'center',
            marginLeft: 20,
          }}
          hitSlop={{ left: 15, right: 15, top: 15, bottom: 15 }}
          onPress={goBack}
        >
          <IconMater name="arrow-back" size={theme.measure.icon.normal} />
        </Touchable>
        <Text weight="bold" size="medium" color="black">
          Hỏi đáp
        </Text>
        <TouchableOpacity style={{ marginRight: 20, flexDirection: 'row' }} onPress={MakeCall}>
          <Flex alignItems="center">
            <Icon
              name="phone"
              size={18}
              color={theme.getColor('primary')}
              style={{ marginRight: theme.measure.gutter / 2 }}
            />
            <Text color="primary" size={14} weight="500">
              Hỗ trợ
            </Text>
          </Flex>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 9 }}>
        <WebView
          source={{
            uri: 'https://www.facebook.com/lalanow.vn',
          }}
        />
      </View>
    </View>
  );
};

export default Communication;
