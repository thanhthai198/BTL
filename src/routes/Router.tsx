import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Authentication from 'screens/Authentication';
import AuthRouter from './AuthRouter';
import AppRouter from './AppRouter';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const Router = () => (
  <Navigator
    mode="modal"
    screenOptions={{
      gestureEnabled: true,
    }}
    headerMode="none"
    initialRouteName="Authentication"
  >
    <Screen name="Authentication" component={Authentication} />
    <Screen name="Auth" component={AuthRouter} />
    <Screen name="App" component={AppRouter} />
  </Navigator>
);

export default Router;
