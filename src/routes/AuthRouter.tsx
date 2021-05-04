import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { EnterPassword, EnterPhoneNumber } from 'screens/Login';
import Register from 'screens/Register';
import RegisterPassword from 'screens/RegisterPassword';
import RegisterUserInfo from 'screens/RegisterUserInfo';
import VerificationCode from 'screens/VerificationCode';
import {
  EnterPhoneNumberForgot,
  NewPassword,
  VerificationCode as VerificationForgot,
} from 'screens/ForgotPassword';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const Router = () => (
  <Navigator
    screenOptions={{
      gestureEnabled: true,
    }}
    headerMode="none"
    initialRouteName="EnterPhoneNumber"
  >
    <Screen name="EnterPhoneNumber" component={EnterPhoneNumber} />
    <Screen name="EnterPassword" component={EnterPassword} />
    <Screen name="Register" component={Register} />
    <Screen name="RegisterPassword" component={RegisterPassword} />
    <Screen name="RegisterUserInfo" component={RegisterUserInfo} />
    <Screen name="VerificationCode" component={VerificationCode} />
    {/* Forgot Password */}
    <Screen name="EnterPhoneNumberForgot" component={EnterPhoneNumberForgot} />
    <Screen name="VerificationForgot" component={VerificationForgot} />
    <Screen name="NewPassword" component={NewPassword} />
  </Navigator>
);

export default Router;
