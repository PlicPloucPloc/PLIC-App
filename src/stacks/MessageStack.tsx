import { createStackNavigator } from '@react-navigation/stack';
import MessageListScreen from '../screens/MessageListScreen';
import { BottomTabStackScreenProps, MessageStackParamList } from '../navigation/Types';
import SharedStack from './SharedStack';
import GroupMessageScreen from '../screens/GroupMessageScreen';
import GroupInfoScreen from '../screens/GroupInfoScreen';

const Stack = createStackNavigator<MessageStackParamList>();

export default function MessageStack(_: BottomTabStackScreenProps<'MessageStack'>) {
  return (
    <Stack.Navigator initialRouteName="MessageList">
      <Stack.Screen name="MessageList" component={MessageListScreen} />
      <Stack.Screen name="GroupMessage" component={GroupMessageScreen} />
      <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
      <Stack.Screen name="SharedStack" component={SharedStack} />
    </Stack.Navigator>
  );
}
