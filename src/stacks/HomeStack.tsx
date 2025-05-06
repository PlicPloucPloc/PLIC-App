import { BottomTabStackScreenProps, HomeStackParamList } from '@navigation/Types';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@screens/HomeScreen';

import SharedStack from './SharedStack';

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeStack(_: BottomTabStackScreenProps<'HomeStack'>) {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SharedStack" component={SharedStack} />
    </Stack.Navigator>
  );
}
