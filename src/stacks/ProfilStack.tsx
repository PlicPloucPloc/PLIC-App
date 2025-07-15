import { BottomTabStackScreenProps, ProfilStackParamList } from '@navigation/Types';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import FiltersScreen from '@screens/FiltersScreen';
import HistoryScreen from '@screens/HistoryScreen';
import ProfilScreen from '@screens/ProfilScreen';
import SettingsScreen from '@screens/SettingsScreen';

const Stack = createStackNavigator<ProfilStackParamList>();

function headerOptions(title: string): StackNavigationOptions {
  return {
    headerShown: true,
    headerShadowVisible: false,
    headerTitle: title,
    headerTitleAlign: 'left',
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: 26,
    },
  };
}

export default function ProfilStack(_: BottomTabStackScreenProps<'ProfilStack'>) {
  return (
    <Stack.Navigator
      initialRouteName="Profil"
      screenOptions={{ headerShown: false, animation: 'fade_from_right' }}>
      <Stack.Screen name="Profil" component={ProfilScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Filters" component={FiltersScreen} />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={() => headerOptions('History')}
      />
    </Stack.Navigator>
  );
}
