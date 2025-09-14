import React from 'react';
import { View } from 'react-native';

import { AuthStackParamList } from '@navigation/Types';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import LoginScreen from '@screens/authStack/LoginScreen';
import RegisterEmailScreen from '@screens/authStack/RegisterEmailScreen';
import RegisterPasswordScreen from '@screens/authStack/RegisterPasswordScreen';
import RegisterPictureScreen from '@screens/authStack/RegisterPictureScreen';
import RegisterUserInfoScreen from '@screens/authStack/RegisterUserInfoScreen';
import VerifyEmailScreen from '@screens/authStack/VerifyEmailScreen';
import WelcomeScreen from '@screens/authStack/WelcomeScreen';
import HeaderBackButton from 'components/HeaderBackButton';
import HeaderLogo from 'components/HeaderLogo';
import { Bar } from 'react-native-progress';

function LoginScreenHeaderOptions(
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

function RegisterScreensHeaderOptions(
  navigation: StackNavigationProp<AuthStackParamList>,
  progress: number,
): StackNavigationOptions {
  return {
    animation: 'slide_from_right',
    headerShown: true,
    headerShadowVisible: false,
    headerTitleAlign: 'center',
    headerLeft: () => <HeaderBackButton navigation={navigation} />,
    headerRight: () => <HeaderLogo />,
    headerTitle: () => (
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Bar progress={progress} width={200} height={8} />
      </View>
    ),
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
        options={({ navigation, route }) => ({
          ...LoginScreenHeaderOptions(navigation),
          animation: route.params?.navigateFromRegister ? 'fade' : 'slide_from_right',
        })}
      />
      <Stack.Screen
        name="RegisterEmail"
        component={RegisterEmailScreen}
        options={({ navigation }) => RegisterScreensHeaderOptions(navigation, 0.25)}
      />
      <Stack.Screen
        name="RegisterUserInfo"
        component={RegisterUserInfoScreen}
        options={({ navigation }) => RegisterScreensHeaderOptions(navigation, 0.5)}
      />
      <Stack.Screen
        name="RegisterPicture"
        component={RegisterPictureScreen}
        options={({ navigation }) => RegisterScreensHeaderOptions(navigation, 0.75)}
      />
      <Stack.Screen
        name="RegisterPassword"
        component={RegisterPasswordScreen}
        options={({ navigation }) => RegisterScreensHeaderOptions(navigation, 1)}
      />

      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
  );
}
