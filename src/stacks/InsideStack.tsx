import { InsideStackParamList } from '@navigation/Types';
import { createStackNavigator } from '@react-navigation/stack';
import ImageGalleryScreen from '@screens/ImageGalleryScreen';
import ImageListScreen from '@screens/ImageList';

import BottomTabStack from './BottomTabStack';

const Stack = createStackNavigator<InsideStackParamList>();

export default function InsideStack() {
  return (
    <Stack.Navigator initialRouteName="BottomTabStack" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabStack" component={BottomTabStack} />
      <Stack.Screen name="ImageList" component={ImageListScreen} />
      <Stack.Screen name="ImageGallery" component={ImageGalleryScreen} />
    </Stack.Navigator>
  );
}
