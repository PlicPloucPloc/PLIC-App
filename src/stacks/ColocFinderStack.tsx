import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabStackScreenProps, ColocFinderStackParamList } from '../navigation/Types';
import ColocFinderScreen from '../screens/ColocFinderScreen';
import ColocFinderForHouseScreen from '../screens/ColocFinderForHouseScreen';
import SharedStack from './SharedStack';

const Stack = createStackNavigator<ColocFinderStackParamList>();

export default function ColocFinderStack(_: BottomTabStackScreenProps<'ColocFinderStack'>) {
  return (
    <Stack.Navigator initialRouteName="ColocFinder">
      <Stack.Screen name="ColocFinder" component={ColocFinderScreen} />
      <Stack.Screen name="ColocFinderForHouse" component={ColocFinderForHouseScreen} />
      <Stack.Screen name="SharedStack" component={SharedStack} />
    </Stack.Navigator>
  );
}
