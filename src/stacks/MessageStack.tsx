import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';

import HeaderBackButton from '@components/HeaderBackButton';
import { BottomTabStackScreenProps, MessageStackParamList } from '@navigation/Types';
import MessageListScreen from '@screens/MessageListScreen';

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
    <Stack.Navigator initialRouteName="MessageList" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MessageList"
        component={MessageListScreen}
        options={({ navigation }) => headerOptions(navigation, 'Messages')}
      />
    </Stack.Navigator>
  );
}
