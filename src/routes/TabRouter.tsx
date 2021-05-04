import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'redux-store';
import Icon from 'components/Icon';
import Home from 'screens/Home';
import GoToMarket from 'screens/GoToMaket';
import Shop from 'screens/Shop';
import Account from 'screens/Account';
import Search from 'screens/Search';
import * as theme from 'theme';

const Tab = createBottomTabNavigator();
const { Navigator, Screen } = Tab;

const Router = () => {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

  const loggedIn = !!token && !!user;

  return (
    <Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'GoToMarket') {
            return <MIcon name="shopping-cart" size={size} color={color} />;
          } else if (route.name === 'Shop') {
            iconName = 'store';
          } else if (route.name === 'Account') {
            iconName = 'user';
          } else if (route.name === 'Search') {
            return <MIcon name="search" size={size} color={color} />;
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: theme.palette.primary,
        inactiveTintColor: theme.palette.tabbarInactiveIcon,
        labelStyle: {
          fontSize: 12,
        },
        showLabel: false,
        style: styles.tabBar,
        tabStyle: styles.tab,
      }}
      initialRouteName="Home"
      lazy
    >
      <Screen name="Home" component={Home} />
      <Screen
        name="GoToMarket"
        component={GoToMarket}
        options={{ tabBarVisible: false }}
        // listeners={({ navigation }) => ({
        //   tabPress: e => {
        //     if (!loggedIn) {
        //       e.preventDefault();
        //       navigation.navigate('Auth');
        //     }
        //   },
        // })}
      />
      <Screen
        name="Search"
        component={Search}
        options={{ tabBarVisible: false }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            if (!loggedIn) {
              e.preventDefault();
              navigation.navigate('Auth');
            }
          },
        })}
      />
      <Screen
        name="Shop"
        component={Shop}
        listeners={({ navigation }) => ({
          tabPress: e => {
            if (!loggedIn) {
              e.preventDefault();
              navigation.navigate('Auth');
            }
          },
        })}
      />
      <Screen
        name="Account"
        component={Account}
        listeners={({ navigation }) => ({
          tabPress: e => {
            if (!loggedIn) {
              e.preventDefault();
              navigation.navigate('Auth');
            }
          },
        })}
      />
    </Navigator>
  );
};

const styles = StyleSheet.create({
  tab: {
    borderTopColor: 'transparent',
    borderTopWidth: 2,
  },
  tabBar: {
    borderTopWidth: 0,
    bottom: 0,
    height: theme.measure.tabBarHeight,
    position: 'absolute',
    shadowColor: theme.palette.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default Router;
