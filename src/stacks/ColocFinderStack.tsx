import { BottomTabStackScreenProps, ColocFinderStackParamList } from '@navigation/Types';
import { createStackNavigator } from '@react-navigation/stack';
import ColocFinderScreen from '@screens/ColocFinderScreen';

const Stack = createStackNavigator<ColocFinderStackParamList>();

export default function ColocFinderStack(_: BottomTabStackScreenProps<'ColocFinderStack'>) {
  return (
    <Stack.Navigator initialRouteName="ColocFinder" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ColocFinder" component={ColocFinderScreen} />
    </Stack.Navigator>
  );
}
