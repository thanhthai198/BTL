import { Text } from 'components';
import Touchable from 'components/Touchable';
import React, { FC, useState } from 'react';
import { ActionSheetIOS, Platform, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import theme from 'theme/theme';

const { forwardRef, useImperativeHandle } = React;

interface ActionProps {
  options?: any;
  handler?: any;
  ref?: any;
}
const ActionSheet: FC<ActionProps> = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isAndroid] = useState<boolean>(Platform.OS === 'android');

  const { options = [], handler } = props;
  const closeModal = () => setIsVisible(false);

  const showActionSheetAndroid = () => setIsVisible(true);

  const showActionSheetIOS = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        cancelButtonIndex: options.length,
        options: [...options, 'Cancel'],
      },
      handler
    );
  };

  useImperativeHandle(ref, () => ({
    show() {
      isAndroid ? showActionSheetAndroid() : showActionSheetIOS();
    },
  }));

  return isAndroid ? (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onSwipeComplete={closeModal}
      style={styles.androidActionSheet}
      swipeDirection={['down']}
    >
      <View style={styles.panel}>
        {options.map((item: any, index: number) => (
          <Touchable
            activeOpacity={0.8}
            key={`action-${index}`}
            onPress={() => {
              closeModal();
              handler(index);
            }}
            style={[styles.menuItem, styles.borderBottom]}
          >
            <Text color="blue">{item}</Text>
          </Touchable>
        ))}
      </View>
      <Touchable
        activeOpacity={0.8}
        onPress={() => {
          closeModal();
        }}
        style={[styles.menuItem, styles.cancelMenu]}
      >
        <Text size="medium" color="blue">
          Cancel
        </Text>
      </Touchable>
    </Modal>
  ) : null;
});

const styles = StyleSheet.create({
  androidActionSheet: {
    justifyContent: 'flex-end',
    // margin: 0,
  },
  panel: {
    borderRadius: theme.measure.borderRadius,
    overflow: 'hidden',
  },
  menuItem: {
    backgroundColor: theme.getColor('white'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  borderBottom: {
    borderBottomColor: theme.palette.border,
    borderBottomWidth: theme.measure.hairlineWidth,
  },
  cancelMenu: {
    borderRadius: theme.measure.borderRadius,
    marginTop: theme.measure.gutter,
  },
});

export default ActionSheet;
