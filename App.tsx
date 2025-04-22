import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import store from './src/app/store';
import AppContainer from './src/navigation/AppContainer';

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <AppContainer />
    </Provider>
  );
}
