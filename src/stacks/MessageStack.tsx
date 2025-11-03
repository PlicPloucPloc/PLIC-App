import HeaderBackButton from '@components/HeaderBackButton';
import { BottomTabStackScreenProps, MessageStackParamList } from '@navigation/Types';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import DirectMessageListScreen from '@screens/DirectMessageListScreen';
import GroupInfoScreen from '@screens/GroupInfo';
import GroupMessageListScreen from '@screens/GroupMessageListScreen';
import GroupMessageScreen from '@screens/GroupMessageScreen';

import SharedStack from './SharedStack';

const Stack = createStackNavigator<MessageStackParamList>();

function headerOptions(
  navigation: StackNavigationProp<MessageStackParamList>,
  title: string | null,
): StackNavigationOptions {
  return {
    headerShown: true,
    headerShadowVisible: false,
    headerTitle: title ?? '',
    headerTitleAlign: 'left',
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: 26,
    },
    headerLeft: () => <HeaderBackButton navigation={navigation} />,
  };
}

export default function MessageStack(_: BottomTabStackScreenProps<'MessageStack'>) {
  return (
    <Stack.Navigator initialRouteName="DirectMessageList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DirectMessageList" component={DirectMessageListScreen} />
      <Stack.Screen name="GroupMessageList" component={GroupMessageListScreen} />
      <Stack.Screen
        name="GroupInfo"
        component={GroupInfoScreen}
        options={({ navigation }) => headerOptions(navigation, 'Group Info')}
      />
      <Stack.Screen
        name="GroupMessage"
        component={GroupMessageScreen}
        options={({ navigation }) => headerOptions(navigation, 'Group')}
      />
      <Stack.Screen name="SharedStack" component={SharedStack} />
    </Stack.Navigator>
  );
}
