import React from 'react';

import { AuthStackParamList } from '@navigation/Types';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import LoginScreen from '@screens/authStack/LoginScreen';
import WelcomeScreen from '@screens/authStack/WelcomeScreen';
import HeaderBackButton from 'components/HeaderBackButton';
import HeaderLogo from 'components/HeaderLogo';

import RegisterStack from './RegisterStack';

function authStackHeaderOptions(
  navigation: StackNavigationProp<AuthStackParamList>,
): StackNavigationOptions {
  return {
    headerShown: true,
    headerTitle: '',
    headerShadowVisible: false,
    headerLeft: () => <HeaderBackButton navigation={navigation} />,
    headerRight: () => <HeaderLogo />,
  };
}

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation }) => authStackHeaderOptions(navigation)}
      />
      <Stack.Screen name="RegisterStack" component={RegisterStack} />
    </Stack.Navigator>
  );
}
