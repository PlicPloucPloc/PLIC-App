import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import InsideNavigator from './InsideNavigator';
import { RootEnum } from '../app/definitions';
import AuthNavigator from './AuthNavigator';
import { RootState } from '../app/store';

export default function AppContainer() {
  const root = useSelector((state: RootState) => state.appState.root);

  return (
    <NavigationContainer>
      {root === RootEnum.ROOT_INSIDE ? <InsideNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
