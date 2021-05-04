import React from 'react';
import {
  KeyboardAwareScrollView as RNKeyboardAwareScrollView,
  KeyboardAwareFlatList,
} from 'react-native-keyboard-aware-scroll-view';

const KeyboardAwareScrollView = (props: any) => (
  <RNKeyboardAwareScrollView
    // enableOnAndroid={true}
    alwaysBounceVertical={false}
    keyboardShouldPersistTaps="handled"
    {...props}
  />
);

export default KeyboardAwareScrollView;
export { KeyboardAwareFlatList };
