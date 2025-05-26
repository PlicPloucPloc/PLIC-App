import { useEffect, useState } from 'react';

import { RootEnum } from '@app/definitions';
import { RootState } from '@app/redux/Store';
import { Images } from '@assets/index';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '@screens/SplashScreen';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import InsideNavigator from './InsideNavigator';

export default function AppContainer() {
  const root = useSelector((state: RootState) => state.appState.root);

  const [isLoading, setIsLoading] = useState(true);

  async function loadAssetsAsync() {
    const imageAssetsPromises = Object.values(Images).map((image) =>
      Asset.fromModule(image).downloadAsync(),
    );

    return Promise.all(imageAssetsPromises);
  }

  async function loadFontsAsync() {
    return Font.loadAsync(Ionicons.font);
  }

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([loadAssetsAsync(), loadFontsAsync()]);
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
      {root === RootEnum.ROOT_INSIDE ? <InsideNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
