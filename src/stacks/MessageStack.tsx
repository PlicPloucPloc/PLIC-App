import { BottomTabStackScreenProps, MessageStackParamList } from '@navigation/Types';
import { createStackNavigator } from '@react-navigation/stack';
import GroupInfoScreen from '@screens/GroupInfoScreen';
import GroupMessageScreen from '@screens/GroupMessageScreen';
import MessageListScreen from '@screens/MessageListScreen';

import SharedStack from './SharedStack';

const Stack = createStackNavigator<MessageStackParamList>();

export default function MessageStack(_: BottomTabStackScreenProps<'MessageStack'>) {
  return (
    <Stack.Navigator initialRouteName="MessageList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessageList" component={MessageListScreen} />
      <Stack.Screen name="GroupMessage" component={GroupMessageScreen} />
      <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
      <Stack.Screen name="SharedStack" component={SharedStack} />
    </Stack.Navigator>
  );
}
