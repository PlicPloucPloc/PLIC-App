import React from 'react';
import { useColorScheme } from 'react-native';

import store from '@app/redux/Store';
import AppContainer from '@navigation/AppContainer';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

export default function App() {
  const scheme = useColorScheme();

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={scheme == 'dark' ? 'dark' : 'light'} />
        <AppContainer />
      </GestureHandlerRootView>
    </Provider>
  );
}
