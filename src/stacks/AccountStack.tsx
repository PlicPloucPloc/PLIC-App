import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';

import HeaderBackButton from '@components/HeaderBackButton';
import { AccountStackParamList, BottomTabStackScreenProps } from '@navigation/Types';
import AccountScreen from '@screens/AccountScreen';
import FiltersScreen from '@screens/FiltersScreen';
import HistoryScreen from '@screens/HistoryScreen';
import MyProfileScreen from '@screens/MyProfileScreen';

const Stack = createStackNavigator<AccountStackParamList>();

function headerOptions(
  title: string | null,
  navigation?: StackNavigationProp<AccountStackParamList>,
): StackNavigationOptions {
  return {
    headerShown: true,
    headerShadowVisible: false,
    headerTitle: title ?? '',
    headerTitleAlign: 'left',
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: 26,
    },
    headerLeft: () => {
      return navigation ? <HeaderBackButton navigation={navigation} /> : null;
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
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={({ navigation }) => headerOptions('Profile', navigation)}
      />
      <Stack.Screen
        name="Filters"
        component={FiltersScreen}
        options={({ navigation }) => headerOptions('Filters', navigation)}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={({ navigation }) => headerOptions('History', navigation)}
      />
    </Stack.Navigator>
  );
}
