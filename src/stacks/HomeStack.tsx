import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import HeaderLogo from '@components/HeaderLogo';
import { BottomTabStackScreenProps, HomeStackParamList } from '@navigation/Types';
import HomeScreen from '@screens/HomeScreen';

const Stack = createStackNavigator<HomeStackParamList>();

function headerOptions(): StackNavigationOptions {
  return {
    headerShown: true,
    headerShadowVisible: false,
    headerTitle: 'SwAppart',
    headerTitleAlign: 'left',
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: 26,
    },
    headerLeft: () => <HeaderLogo />,
  };
}

export default function HomeStack(_: BottomTabStackScreenProps<'HomeStack'>) {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} options={headerOptions} />
    </Stack.Navigator>
  );
}
