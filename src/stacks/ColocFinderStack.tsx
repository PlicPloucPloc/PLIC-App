import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import HeaderSwitch from '@components/HeaderSwitch';
import { BottomTabStackScreenProps, ColocFinderStackParamList } from '@navigation/Types';
import ColocFinderScreen from '@screens/ColocFinderScreen';

const Stack = createStackNavigator<ColocFinderStackParamList>();

function headerOptions(): StackNavigationOptions {
  return {
    headerShown: true,
    headerShadowVisible: false,
    headerTitle: 'Coloc Finder',
    headerTitleAlign: 'left',
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: 26,
    },
    headerRight: () => <HeaderSwitch />,
  };
}

export default function ColocFinderStack(_: BottomTabStackScreenProps<'ColocFinderStack'>) {
  return (
    <Stack.Navigator initialRouteName="ColocFinder" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ColocFinder" component={ColocFinderScreen} options={headerOptions} />
    </Stack.Navigator>
  );
}
