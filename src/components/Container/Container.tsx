import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import theme from 'theme/theme';

export interface ContainerProps {
  haveTextInput?: boolean;
  style?: any;
  contentStyle?: any;
  subViewStyle?: any;
  center?: boolean;
  loading?: boolean;
  children?: any;
  disableScrollForContainer?: boolean;
  scrollEnabled?: boolean;
  withoutSafeView?: boolean;
}

const Container = ({
  haveTextInput,
  style,
  contentStyle,
  center,
  loading,
  subViewStyle,
  children,
  disableScrollForContainer,
  scrollEnabled,
  withoutSafeView,
}: ContainerProps) => {
  if (haveTextInput) {
    if (withoutSafeView) {
      return (
        <>
          <View style={[styles.container, style]}>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="always"
              style={[center && styles.center, subViewStyle && subViewStyle]}
              contentContainerStyle={contentStyle && contentStyle}
              contentInsetAdjustmentBehavior="never"
              scrollEnabled={!disableScrollForContainer}
              enableAutomaticScroll={false}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.fill}>{children}</View>
              </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
          </View>
          {loading && (
            <View style={styles.fadeView}>
              <ActivityIndicator animating size="large" />
            </View>
          )}
        </>
      );
    }
    return (
      <SafeAreaView style={[styles.container, style]}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          style={[center && styles.center, subViewStyle && subViewStyle]}
          contentContainerStyle={contentStyle && contentStyle}
          contentInsetAdjustmentBehavior="never"
          scrollEnabled={!disableScrollForContainer}
          enableAutomaticScroll={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.fill}>{children}</View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
        {loading && (
          <View style={styles.fadeView}>
            <ActivityIndicator animating size="large" />
          </View>
        )}
      </SafeAreaView>
    );
  }
  if (withoutSafeView) {
    if (scrollEnabled) {
      <View style={[styles.container, style]}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          scrollEnabled
          keyboardDismissMode="on-drag"
          style={[styles.container, center && styles.center, subViewStyle && subViewStyle]}
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {loading && (
          <View style={styles.fadeView}>
            <ActivityIndicator animating size="large" />
          </View>
        )}
      </View>;
    } else {
      return (
        <View style={[styles.container, style]}>
          {children}
          {loading && (
            <View style={styles.fadeView}>
              <ActivityIndicator animating size="large" />
            </View>
          )}
        </View>
      );
    }
  }
  if (scrollEnabled) {
    return (
      <SafeAreaView style={[styles.container, style]}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          scrollEnabled
          keyboardDismissMode="on-drag"
          style={[styles.container, center && styles.center, subViewStyle && subViewStyle]}
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {loading && (
          <View style={styles.fadeView}>
            <ActivityIndicator animating size="large" />
          </View>
        )}
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={[styles.container, style]}>
      {children}
      {loading && (
        <View style={styles.fadeView}>
          <ActivityIndicator animating size="large" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background,
  },
  fill: {
    flex: 1,
  },
  fadeView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Container;
