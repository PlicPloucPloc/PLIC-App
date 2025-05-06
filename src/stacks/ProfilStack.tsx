import { BottomTabStackScreenProps, ProfilStackParamList } from '@navigation/Types';
import { createStackNavigator } from '@react-navigation/stack';
import FiltersScreen from '@screens/FiltersScreen';
import HistoryScreen from '@screens/HistoryScreen';
import ProfilScreen from '@screens/ProfilScreen';
import SettingsScreen from '@screens/SettingsScreen';

import SharedStack from './SharedStack';

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
