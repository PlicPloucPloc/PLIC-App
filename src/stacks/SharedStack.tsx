import HeaderBackButton from '@components/HeaderBackButton';
import HeaderLogo from '@components/HeaderLogo';
import { SharedStackParamList } from '@navigation/Types';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import ApartmentDetailsScreen from '@screens/ApartmentDetailsScreen';
import DirectMessageScreen from '@screens/DirectMessageScreen';
import OtherProfilScreen from '@screens/OtherProfilScreen';

const Stack = createStackNavigator<SharedStackParamList>();

function headerOptions(
  navigation: StackNavigationProp<SharedStackParamList>,
): StackNavigationOptions {
  return {
    headerShown: true,
    headerShadowVisible: false,
    headerTitle: 'Details',
    headerTitleAlign: 'left',
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: 26,
    },
    headerLeft: () => <HeaderBackButton navigation={navigation} />,
    headerRight: () => <HeaderLogo />,
  };
}

export default function SharedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ApartmentDetails"
        component={ApartmentDetailsScreen}
        options={({ navigation }) => headerOptions(navigation)}
      />
      <Stack.Screen name="OtherProfil" component={OtherProfilScreen} />
      <Stack.Screen name="DirectMessage" component={DirectMessageScreen} />
    </Stack.Navigator>
  );
}
