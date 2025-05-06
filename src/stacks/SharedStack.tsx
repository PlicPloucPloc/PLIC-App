import { SharedStackParamList } from '@navigation/Types';
import { createStackNavigator } from '@react-navigation/stack';
import DirectMessageScreen from '@screens/DirectMessage';
import HouseDetailsScreen from '@screens/HouseDetailsScreen';
import OtherProfilScreen from '@screens/OtherProfilScreen';

const Stack = createStackNavigator<SharedStackParamList>();

export default function SharedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HouseDetails" component={HouseDetailsScreen} />
      <Stack.Screen name="OtherProfil" component={OtherProfilScreen} />
      <Stack.Screen name="DirectMessage" component={DirectMessageScreen} />
    </Stack.Navigator>
  );
}
