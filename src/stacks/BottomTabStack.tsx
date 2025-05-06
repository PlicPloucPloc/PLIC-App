import { BottomTabStackParamList } from '@navigation/Types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from '@stacks/HomeStack';
import MessageStack from '@stacks/MessageStack';

import ColocFinderStack from './ColocFinderStack';
import LikesStack from './LikesStack';
import ProfilStack from './ProfilStack';

const Stack = createBottomTabNavigator<BottomTabStackParamList>();

export default function BottomTabStack() {
  return (
    <Stack.Navigator initialRouteName="HomeStack">
      <Stack.Screen name="HomeStack" component={HomeStack} />
      <Stack.Screen name="MessageStack" component={MessageStack} />
      <Stack.Screen name="LikesStack" component={LikesStack} />
      <Stack.Screen name="ColocFinderStack" component={ColocFinderStack} />
      <Stack.Screen name="ProfilStack" component={ProfilStack} />
    </Stack.Navigator>
  );
}
