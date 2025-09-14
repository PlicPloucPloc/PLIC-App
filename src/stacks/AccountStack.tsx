import { AccountStackParamList, BottomTabStackScreenProps } from '@navigation/Types';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import AccountScreen from '@screens/AccountScreen';
import FiltersScreen from '@screens/FiltersScreen';
import HistoryScreen from '@screens/HistoryScreen';

const Stack = createStackNavigator<AccountStackParamList>();

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

export default function AccountStack(_: BottomTabStackScreenProps<'AccountStack'>) {
  return (
    <Stack.Navigator
      initialRouteName="Account"
      screenOptions={{ headerShown: false, animation: 'fade_from_right' }}>
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={() => headerOptions('Account')}
      />
      <Stack.Screen name="Filters" component={FiltersScreen} />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={() => headerOptions('History')}
      />
    </Stack.Navigator>
  );
}
