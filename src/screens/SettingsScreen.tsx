import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { RootEnum } from '@app/definitions';
import { setRoot } from '@app/redux/slices';
import store from '@app/redux/Store';
import { ProfilStackScreenProps } from '@navigation/Types';
import * as SecureStore from 'expo-secure-store';

export default function SettingsScreen({ navigation }: ProfilStackScreenProps<'Settings'>) {
  async function handleLogout() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('refresh_token');
    store.dispatch(setRoot(RootEnum.ROOT_AUTH));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Edit Filters" onPress={() => navigation.navigate('Filters')} />
      <Button title="View history" onPress={() => navigation.navigate('History')} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
