import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';

import HeaderBackButton from '@components/HeaderBackButton';
import HeaderMessageParticipants from '@components/HeaderMessageInfo';
import { SharedStackParamList } from '@navigation/Types';
import AddToARoomScreen from '@screens/AddToARoom';
import ApartmentDetailsScreen from '@screens/ApartmentDetailsScreen';
import DirectMessageScreen from '@screens/DirectMessageScreen';
import GroupInfoScreen from '@screens/GroupInfo';
import OtherProfileScreen from '@screens/OtherProfileScreen';

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
    <Stack.Navigator>
      <Stack.Screen
        name="ApartmentDetails"
        component={ApartmentDetailsScreen}
        options={({ navigation }) => headerOptions(navigation, 'Details')}
      />
      <Stack.Screen
        name="OtherProfile"
        component={OtherProfileScreen}
        options={({ navigation }) => headerOptions(navigation, 'Profile')}
      />
      <Stack.Screen
        name="DirectMessage"
        component={DirectMessageScreen}
        options={({ navigation }) => {
          return {
            ...headerOptions(navigation, ''),
            headerRight: () => <HeaderMessageParticipants />,
          };
        }}
      />
      <Stack.Screen
        name="GroupInfo"
        component={GroupInfoScreen}
        options={({ navigation }) => headerOptions(navigation, 'Group Info')}
      />

      <Stack.Screen
        name="AddToARoom"
        component={AddToARoomScreen}
        options={({ navigation }) => headerOptions(navigation, 'Add to a group')}
      />
    </Stack.Navigator>
  );
}
