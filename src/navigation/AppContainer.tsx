import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { RootEnum } from '@app/definitions';
import { setRoot } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { getToken } from '@app/rest/Client';
import { loadCurrentUserInfo } from '@app/rest/UserService';
import { Images } from '@assets/index';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '@screens/SplashScreen';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import InsideNavigator from './InsideNavigator';

export default function AppContainer() {
  const appState = useSelector((state: RootState) => state.appState);
  const scheme = useColorScheme();

  const [isLoading, setIsLoading] = useState(true);

  async function loadResources() {
    const loadAssetsAsync = async () => {
      const imageAssetsPromises = Object.values(Images).map((image) =>
        Asset.fromModule(image).downloadAsync(),
      );

      return Promise.all(imageAssetsPromises);
    };

    await Promise.all([loadAssetsAsync(), Font.loadAsync(Ionicons.font)]);
  }

  useEffect(() => {
    (async () => {
      try {
        await loadResources();

        const token = await getToken();
        if (token) {
          await loadCurrentUserInfo();
        }

        store.dispatch(setRoot(token ? RootEnum.ROOT_INSIDE : RootEnum.ROOT_AUTH));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style={scheme == 'dark' ? 'dark' : 'light'} />
      {appState.root === RootEnum.ROOT_INSIDE ? <InsideNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
