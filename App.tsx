import React from 'react';

import store from '@app/redux/Store';
import AppContainer from '@navigation/AppContainer';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <AppContainer />
      </GestureHandlerRootView>
    </Provider>
  );
}
