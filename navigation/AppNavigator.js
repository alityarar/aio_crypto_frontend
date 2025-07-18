import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../components/HomePage';
import Alerts from '../components/Alerts';
import MarketBuy from '../components/MarketBuy';
import MarketSell from '../components/MarketSell';
import LimitBuy from '../components/LimitBuy';
import LimitSell from '../components/LimitSell';
import Portfolio from '../components/Portfolio';
import LoginScreen from '../components/LoginScreen';


const Stack = createNativeStackNavigator();


export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="Alerts" component={Alerts} />
      <Stack.Screen name="MarketBuy" component={MarketBuy} />
      <Stack.Screen name="MarketSell" component={MarketSell} />
      <Stack.Screen name="LimitBuy" component={LimitBuy} />
      <Stack.Screen name="LimitSell" component={LimitSell} />
      <Stack.Screen name="Portfolio" component={Portfolio} />
    </Stack.Navigator>
  );
}
