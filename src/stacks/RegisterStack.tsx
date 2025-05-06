import React from 'react';
import { View } from 'react-native';

import { RegisterStackParamList } from '@navigation/Types';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import RegisterEmailScreen from '@screens/authStack/RegisterEmailScreen';
import RegisterPasswordScreen from '@screens/authStack/RegisterPasswordScreen';
import RegisterUserInfoScreen from '@screens/authStack/RegisterUserInfoScreen';
import HeaderBackButton from 'components/HeaderBackButton';
import HeaderLogo from 'components/HeaderLogo';
import { Bar } from 'react-native-progress';

function registerStackHeaderOptions(
  navigation: StackNavigationProp<RegisterStackParamList>,
  progress: number,
) {
  return {
    animation: 'slide_from_right' as const,
    headerShown: true,
    headerShadowVisible: false,
    headerTitleAlign: 'center' as const,
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

const Stack = createStackNavigator<RegisterStackParamList>();

export default function RegisterStack() {
  return (
    <Stack.Navigator initialRouteName="Email">
      <Stack.Screen
        name="Email"
        component={RegisterEmailScreen}
        options={({ navigation }) => registerStackHeaderOptions(navigation, 0.33)}
      />
      <Stack.Screen
        name="UserInfo"
        component={RegisterUserInfoScreen}
        options={({ navigation }) => registerStackHeaderOptions(navigation, 0.66)}
      />
      <Stack.Screen
        name="Password"
        component={RegisterPasswordScreen}
        options={({ navigation }) => registerStackHeaderOptions(navigation, 1)}
      />
    </Stack.Navigator>
  );
}
