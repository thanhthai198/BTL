import React, { FC } from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from 'components/Text';
import Container from 'components/Container';
import { ContainerProps } from 'components/Container/Container';
import Touchable from 'components/Touchable';
import commonStyles from 'theme/commonStyles';
import * as theme from 'theme';
import Background from 'assets/img/bg.png';

interface AuthLayoutProps extends ContainerProps {
  title?: string;
  showAppVersion?: boolean;
  hideBackButton?: boolean;
}

const AuthLayout: FC<AuthLayoutProps> = ({
  title,
  children,
  showAppVersion,
  hideBackButton,
  ...props
}) => {
  const navigation = useNavigation();
  const appVersion = DeviceInfo.getVersion();

  const canGoBack = navigation.canGoBack();

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground style={commonStyles.authContainer} source={Background}>
      <View style={styles.navbar}>
        {canGoBack && !hideBackButton && (
          <Touchable
            style={styles.button}
            hitSlop={{ left: 15, right: 15, top: 15, bottom: 15 }}
            onPress={goBack}
          >
            <Icon name="arrow-back" size={theme.measure.icon.normal} />
          </Touchable>
        )}
        {title && (
          <View style={styles.title}>
            <Text weight="bold" size="medium" color="primary">
              {title}
            </Text>
          </View>
        )}
        {canGoBack && <Touchable style={styles.button} />}
      </View>
      <Container
        withoutSafeView
        haveTextInput
        style={{ backgroundColor: 'transparent' }}
        {...props}
      >
        {children}
      </Container>
      {showAppVersion && (
        <View>
          <Text color="primary" align="center">
            Phiên bản {appVersion}
          </Text>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'relative',
    flexDirection: 'row',
    height: theme.measure.headerBarHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  button: {
    width: theme.measure.buttonIcon.normal,
    height: theme.measure.buttonIcon.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default AuthLayout;
