import { StyleSheet, Dimensions } from 'react-native';
import theme from './theme';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  shadowItem: {
    shadowColor: 'rgba(0, 0, 0, 0.03)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 8,
  },
  noBorder: {
    borderWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  noBorderRadius: {
    borderRadius: 0,
  },
  absolute: {
    position: 'absolute',
  },
  alignCenter: {
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  authContainer: {
    backgroundColor: 'black',
    paddingTop: theme.measure.statusBarHeight,
    paddingBottom: theme.measure.bottomGutter,
    minHeight: height,
    flex: 1,
  },
  appContainer: {
    backgroundColor: theme.palette.background,
    paddingTop: theme.measure.statusBarHeight,
    paddingBottom: theme.measure.bottomGutter,
    minHeight: height,
    flex: 1,
  },
  fullHeight: {
    minHeight: '100%',
  },
  fullScreenHeight: {
    minHeight: height,
  },
  left: {
    justifyContent: 'flex-start',
  },
  endRow: {
    alignItems: 'flex-end',
  },
  flex: {
    flex: 1,
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  marginGutter: {
    marginHorizontal: theme.measure.gutter,
    marginVertical: theme.measure.gutter,
  },
  marginLeftGutter: {
    marginLeft: theme.measure.gutter,
  },
  marginTopGutter: {
    marginTop: theme.measure.gutter,
  },
  marginRightGutter: {
    marginRight: theme.measure.gutter,
  },
  marginBottomGutter: {
    marginBottom: theme.measure.gutter,
  },
  marginGutter2x: {
    marginHorizontal: theme.measure.gutter2x,
    marginVertical: theme.measure.gutter2x,
  },
  marginLeftGutter2x: {
    marginLeft: theme.measure.gutter2x,
  },
  marginTopGutter2x: {
    marginTop: theme.measure.gutter2x,
  },
  marginRightGutter2x: {
    marginRight: theme.measure.gutter2x,
  },
  marginRightGutter3x: {
    marginRight: theme.measure.gutter * 3,
  },
  marginBottomGutter2x: {
    marginBottom: theme.measure.gutter2x,
  },
  paddingHorizontal: {
    paddingHorizontal: theme.measure.gutter,
  },
  paddingHorizontal2x: {
    paddingHorizontal: theme.measure.gutter2x,
  },
  paddingVertical: {
    paddingVertical: theme.measure.gutter,
  },
  paddingVertical2x: {
    paddingVertical: theme.measure.gutter2x,
  },
  modalPage: {
    backgroundColor: theme.palette.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  page: {
    flex: 1,
    backgroundColor: theme.palette.background,
    paddingBottom: theme.measure.tabBarHeight,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  shadow: {
    elevation: 3,
    // shadowColor: theme.palette.shadow,
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  breakLine: {
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
});
export default styles;
