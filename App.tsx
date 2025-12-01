import React from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider } from 'react-redux';

import store from '@app/redux/Store';
import AppContainer from '@navigation/AppContainer';

export default function App() {
  return (
    <Provider store={store}>
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppContainer />
        </GestureHandlerRootView>
      </KeyboardProvider>
    </Provider>
  );
}
