import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabStackScreenProps, ProfilStackParamList } from '../navigation/Types';
import ProfilScreen from '../screens/ProfilScreen';
import SharedStack from './SharedStack';
import SettingsScreen from '../screens/SettingsScreen';
import FiltersScreen from '../screens/FiltersScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator<ProfilStackParamList>();

export default function ProfilStack(_: BottomTabStackScreenProps<'ProfilStack'>) {
  return (
    <Stack.Navigator initialRouteName="Profil">
      <Stack.Screen name="Profil" component={ProfilScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Filters" component={FiltersScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="SharedStack" component={SharedStack} />
    </Stack.Navigator>
  );
}
