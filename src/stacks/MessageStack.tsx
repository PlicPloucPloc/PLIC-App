import { createStackNavigator } from '@react-navigation/stack';

import { BottomTabStackScreenProps, MessageStackParamList } from '@navigation/Types';
import DirectMessageListScreen from '@screens/DirectMessageListScreen';
import DirectMessageScreen from '@screens/DirectMessageScreen';
import GroupInfoScreen from '@screens/GroupInfo';
import GroupMessageListScreen from '@screens/GroupMessageListScreen';
import GroupMessageScreen from '@screens/GroupMessageScreen';

import SharedStack from './SharedStack';

const Stack = createStackNavigator<MessageStackParamList>();

export default function MessageStack(_: BottomTabStackScreenProps<'MessageStack'>) {
  return (
    <Stack.Navigator initialRouteName="DirectMessageList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DirectMessageList" component={DirectMessageListScreen} />
      <Stack.Screen name="DirectMessage" component={DirectMessageScreen} />
      <Stack.Screen name="GroupMessageList" component={GroupMessageListScreen} />
      <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
      <Stack.Screen name="GroupMessage" component={GroupMessageScreen} />
      <Stack.Screen name="SharedStack" component={SharedStack} />
    </Stack.Navigator>
  );
}
