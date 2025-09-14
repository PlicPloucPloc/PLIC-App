import HeaderBackButton from '@components/HeaderBackButton';
import { SharedStackParamList } from '@navigation/Types';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import ApartmentDetailsScreen from '@screens/ApartmentDetailsScreen';
import DirectMessageScreen from '@screens/DirectMessageScreen';
import ProfileScreen from '@screens/ProfileScreen';

const Stack = createStackNavigator<SharedStackParamList>();

function headerOptions(
  navigation: StackNavigationProp<SharedStackParamList>,
  title: string | null,
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
    headerLeft: () => <HeaderBackButton navigation={navigation} />,
  };
}

export default function SharedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ApartmentDetails"
        component={ApartmentDetailsScreen}
        options={({ navigation }) => headerOptions(navigation, 'Details')}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => headerOptions(navigation, null)}
      />
      <Stack.Screen name="DirectMessage" component={DirectMessageScreen} />
    </Stack.Navigator>
  );
}
