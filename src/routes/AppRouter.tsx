import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CheckOut from 'screens/CheckOut';
import Shop from 'screens/Shop';
import AccountDetail from 'screens/Account/AccountDetail';
import UpdateAccount from 'screens/Account/UpdateAccount';
import Notification from 'screens/Notification';
import Order from 'screens/Account/Order';
import OrderDetail from 'screens/Account/Order/OrderDetail';
import Address from 'screens/Account/Address';
import AddAddress from 'screens/Account/Address/AddAddress';
import Voucher from 'screens/Account/Voucher';
import VoucherDetail from 'screens/Account/Voucher/VoucherDetail';
import Rank from 'screens/Account/Rank';
import StoreDetail from 'screens/Shop/StoreDetail';
import TabRouter from './TabRouter';
import Policy from 'screens/Account/Policy';
import Security from 'screens/Account/Policy/Detail/Security';
import Purchase from 'screens/Account/Policy/Detail/Purchase';
import Communication from 'screens/Account/Comunication';
import JustForYou from 'screens/Home/components/SeeAll/JustForYou';
import EveryoneBuys from 'screens/Home/components/SeeAll/EveryoneBuys';
import DealsEveryDay from 'screens/Home/components/SeeAll/DealsEveryDay';
import DealsEveryDayCardDetail from 'screens/Home/components/SeeAll/DealsEveryDayDetail';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const Router = () => (
  <Navigator
    screenOptions={{
      gestureEnabled: true,
    }}
    headerMode="none"
    initialRouteName="Home"
  >
    <Screen name="Home" component={TabRouter} />
    {/* Market */}
    <Screen name="CheckOut" component={CheckOut} />
    <Screen name="Shop" component={Shop} />
    {/* Store */}
    <Screen name="StoreDetail" component={StoreDetail} />
    {/* Account */}
    <Screen name="AccountDetail" component={AccountDetail} />
    <Screen name="UpdateAccount" component={UpdateAccount} />
    {/* Notification */}
    <Screen name="Notification" component={Notification} />
    {/* Order */}
    <Screen name="Order" component={Order} />
    <Screen name="OrderDetail" component={OrderDetail} />
    {/* Address */}
    <Screen name="Address" component={Address} />
    <Screen name="AddAddress" component={AddAddress} />
    {/* Voucher */}
    <Screen name="Voucher" component={Voucher} />
    <Screen name="VoucherDetail" component={VoucherDetail} />
    <Screen name="Rank" component={Rank} />
    {/*Policy*/}
    <Screen name="Policy" component={Policy} />
    <Screen name="Purchase" component={Purchase} />
    <Screen name="Security" component={Security} />
    {/* Q&A */}
    <Screen name="Communication" component={Communication} />
    {/* SeeAll */}
    <Screen name="JustForYou" component={JustForYou} />
    <Screen name="EveryoneBuys" component={EveryoneBuys} />
    <Screen name="DealsEveryDay" component={DealsEveryDay} />
    <Screen name="DealsEveryDayCardDetail" component={DealsEveryDayCardDetail} />
  </Navigator>
);

export default Router;
