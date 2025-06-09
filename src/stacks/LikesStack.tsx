import { BottomTabStackScreenProps, LikesStackParamList } from '@navigation/Types';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import LikesListScreen from '@screens/LikesListScreen';

import SharedStack from './SharedStack';

const Stack = createStackNavigator<LikesStackParamList>();

function headerOptions(): StackNavigationOptions {
  return {
    headerShown: true,
    headerShadowVisible: false,
    headerTitle: 'Likes',
    headerTitleAlign: 'left',
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: 26,
    },
  };
}

export default function LikesStack(_: BottomTabStackScreenProps<'LikesStack'>) {
  return (
    <Stack.Navigator initialRouteName="LikesList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LikesList" component={LikesListScreen} options={() => headerOptions()} />
      <Stack.Screen name="SharedStack" component={SharedStack} />
    </Stack.Navigator>
  );
}
