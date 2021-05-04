import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from 'components/Touchable';
import { Text, theme } from 'components';

const Security = () => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Touchable
          style={{
            width: theme.measure.buttonIcon.normal,
            height: theme.measure.buttonIcon.normal,
            justifyContent: 'center',
            marginLeft: 20,
            marginRight: 10,
          }}
          hitSlop={{ left: 15, right: 15, top: 15, bottom: 15 }}
          onPress={goBack}
        >
          <Icon name="arrow-back" size={theme.measure.icon.normal} />
        </Touchable>
        <Text weight="bold" size="medium" color="black">
          Chính sách bảo mật thông tin cá nhân
        </Text>
      </View>
      <View style={{ flex: 9 }}>
        <WebView
          source={{
            uri: 'https://lalanow.com.vn/chinh-sach-bao-mat/',
          }}
        />
      </View>
    </View>
  );
};

export default Security;
