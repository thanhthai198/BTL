import React, { FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import Touchable from 'components/Touchable';
import { Container, Text, theme } from 'components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import s from 'theme/commonStyles';
import { AppLayoutContainerProps } from 'models/layout';

const AppLayout: FC<AppLayoutContainerProps> = props => {
  const { title, right, onPressRight, backgroundColor, children } = props;
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[s.appContainer, { backgroundColor }]}>
      <View style={[styles.navbar, { backgroundColor }]}>
        {canGoBack && (
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
            <Text weight="bold" size="medium" color="black">
              {title}
            </Text>
          </View>
        )}

        {right && (
          <Touchable hitSlop={{ left: 15, right: 15, top: 15, bottom: 15 }} onPress={onPressRight}>
            {typeof right === 'string' ? (
              <Text size={15} weight="600" color="primary">
                {right}
              </Text>
            ) : (
              <View>{right}</View>
            )}
          </Touchable>
        )}
      </View>
      <Container withoutSafeView haveTextInput {...props} style={[{ backgroundColor }]}>
        {children}
      </Container>
    </View>
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
    backgroundColor: theme.palette.white,
  },
  button: {
    width: theme.measure.buttonIcon.normal,
    height: theme.measure.buttonIcon.normal,
    justifyContent: 'center',
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default AppLayout;
