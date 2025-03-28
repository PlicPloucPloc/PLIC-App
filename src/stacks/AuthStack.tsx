import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { AuthStackParamList } from '../navigation/Types';

const Navigator = createStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Navigator.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Navigator.Screen name="Welcome" component={WelcomeScreen} />
      <Navigator.Screen name="Login" component={LoginScreen} />
      <Navigator.Screen name="Signup" component={SignupScreen} />
    </Navigator.Navigator>
  );
}
