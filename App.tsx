import React from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import store from '@app/redux/Store';
import AppContainer from '@navigation/AppContainer';

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppContainer />
      </GestureHandlerRootView>
    </Provider>
  );
}
