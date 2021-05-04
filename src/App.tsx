/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import Router from './routes/Router';
// import initStore from './store';
import 'react-native-gesture-handler';
import store from './redux-store';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <Router />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
