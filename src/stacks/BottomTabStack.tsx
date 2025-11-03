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

const Stack = createBottomTabNavigator<BottomTabStackParamList>();

type IconNames = keyof typeof Ionicons.glyphMap;

function tabBarOptions(
  tabBarLabel: string,
  icon: IconNames,
  iconFocused: IconNames,
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
  return (
    <Stack.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4BA3C3',
        tabBarInactiveTintColor: 'black',
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
