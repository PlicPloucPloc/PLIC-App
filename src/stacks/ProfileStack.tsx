import { BottomTabStackScreenProps, ProfileStackParamList } from '@navigation/Types';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import FiltersScreen from '@screens/FiltersScreen';
import HistoryScreen from '@screens/HistoryScreen';
import ProfileScreen from '@screens/ProfileScreen';
import SettingsScreen from '@screens/SettingsScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

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

export default function ProfileStack(_: BottomTabStackScreenProps<'ProfileStack'>) {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: false, animation: 'fade_from_right' }}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={() => headerOptions('My Account')}
      />
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
