import { BottomTabStackScreenProps, LikesStackParamList } from '@navigation/Types';
import { createStackNavigator } from '@react-navigation/stack';
import LikesListScreen from '@screens/LikesListScreen';

import SharedStack from './SharedStack';

const Stack = createStackNavigator<LikesStackParamList>();

export default function LikesStack(_: BottomTabStackScreenProps<'LikesStack'>) {
  return (
    <Stack.Navigator initialRouteName="LikesList">
      <Stack.Screen name="LikesList" component={LikesListScreen} />
      <Stack.Screen name="SharedStack" component={SharedStack} />
    </Stack.Navigator>
  );
}
