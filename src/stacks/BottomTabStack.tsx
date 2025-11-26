import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { BottomTabStackParamList } from '@navigation/Types';

import AccountStack from './AccountStack';
import ColocFinderStack from './ColocFinderStack';
import HomeStack from './HomeStack';
import LikesStack from './LikesStack';
import MessageStack from './MessageStack';
import { IoniconName } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';

const Stack = createBottomTabNavigator<BottomTabStackParamList>();

function tabBarOptions(
  tabBarLabel: string,
  icon: IoniconName,
  iconFocused: IoniconName,
): BottomTabNavigationOptions {
  return {
    tabBarLabel,
    tabBarIcon: ({ focused, color, size }) => {
      const iconName = focused ? iconFocused : icon;
      return <Ionicons name={iconName} size={size} color={color} />;
    },
  };
}

export default function BottomTabStack() {
  const colors = useThemeColors();

  return (
    <Stack.Navigator
      initialRouteName="MessageStack"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { paddingHorizontal: 8 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.contrast,
        animation: 'shift',
      }}>
      <Stack.Screen
        name="HomeStack"
        component={HomeStack}
        options={tabBarOptions('Home', 'home-outline', 'home')}
      />
      <Stack.Screen
        name="MessageStack"
        component={MessageStack}
        options={tabBarOptions('Messages', 'chatbubble-outline', 'chatbubble')}
      />
      <Stack.Screen
        name="LikesStack"
        component={LikesStack}
        options={tabBarOptions('Likes', 'heart-outline', 'heart')}
      />
      <Stack.Screen
        name="ColocFinderStack"
        component={ColocFinderStack}
        options={tabBarOptions('Coloc', 'search-outline', 'search')}
      />
      <Stack.Screen
        name="AccountStack"
        component={AccountStack}
        options={tabBarOptions('Account', 'person-outline', 'person')}
      />
    </Stack.Navigator>
  );
}
