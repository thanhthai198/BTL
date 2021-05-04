import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import commonStyles from 'theme/commonStyles';
import * as theme from 'theme';

const ToolButton = ({ icon, label, onPress }: any) => (
  <Touchable style={commonStyles.center} onPress={onPress}>
    <View style={styles.icon}>
      <Image width={24} height={24} resizeMode="contain" source={icon} />
    </View>
    <Text color="black" weight="500">
      {label}
    </Text>
  </Touchable>
);

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D9EFE3',
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.measure.gutter / 2,
  },
});

export default ToolButton;
