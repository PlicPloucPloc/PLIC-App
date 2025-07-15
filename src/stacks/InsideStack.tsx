import { InsideStackParamList } from '@navigation/Types';
import { createStackNavigator } from '@react-navigation/stack';
import ImageGalleryScreen from '@screens/ImageGalleryScreen';
import ImageListScreen from '@screens/ImageList';

import BottomTabStack from './BottomTabStack';
import SharedStack from './SharedStack';

const Stack = createStackNavigator<InsideStackParamList>();

export default function InsideStack() {
  return (
    <Stack.Navigator initialRouteName="BottomTabStack" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SharedStack"
        component={SharedStack}
        options={({ route }) => ({
          animation: route.params?.animation || 'slide_from_right',
        })}
      />
      <Stack.Screen name="BottomTabStack" component={BottomTabStack} />
      <Stack.Screen name="ImageList" component={ImageListScreen} options={{ animation: 'fade' }} />
      <Stack.Screen
        name="ImageGallery"
        component={ImageGalleryScreen}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}
