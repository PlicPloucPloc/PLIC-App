import { useEffect, useState } from 'react';

import { RootEnum, UserInfoResponse } from '@app/definitions';
import { IAuthState, setRoot, setUserInfo } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { getToken } from '@app/rest/Client';
import { getUserInfo } from '@app/rest/UserService';
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

  async function loadResources() {
    const loadAssetsAsync = async () => {
      const imageAssetsPromises = Object.values(Images).map((image) =>
        Asset.fromModule(image).downloadAsync(),
      );

      return Promise.all(imageAssetsPromises);
    };

    await Promise.all([loadAssetsAsync(), Font.loadAsync(Ionicons.font)]);
  }

  const toIAuthState = (userInfo: UserInfoResponse) => {
    return {
      userId: userInfo.id,
      email: '',
      firstName: userInfo.firstname,
      lastName: userInfo.lastname,
      birthdate: userInfo.birthdate,
    } as IAuthState;
  };

  useEffect(() => {
    (async () => {
      try {
        await loadResources();

        const token = await getToken();
        const userInfo = await getUserInfo();

        store.dispatch(setUserInfo(toIAuthState(userInfo)));
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
      {root === RootEnum.ROOT_INSIDE ? <InsideNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
