import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabStackScreenProps, LikesStackParamList } from '../navigation/Types';
import SharedStack from './SharedStack';
import LikesListScreen from '../screens/LikesListScreen';

const Stack = createStackNavigator<LikesStackParamList>();

export default function LikesStack(_: BottomTabStackScreenProps<'LikesStack'>) {
  return (
    <Stack.Navigator initialRouteName="LikesList">
      <Stack.Screen name="LikesList" component={LikesListScreen} />
      <Stack.Screen name="SharedStack" component={SharedStack} />
    </Stack.Navigator>
  );
}
