import React from 'react';

import store from '@app/redux/store';
import AppContainer from '@navigation/AppContainer';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <AppContainer />
    </Provider>
  );
}
