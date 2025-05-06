import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { RootEnum } from '@app/definitions';
import { setRoot } from '@app/redux/slices';
import store from '@app/redux/store';
import { ProfilStackScreenProps } from '@navigation/Types';

export default function SettingsScreen({ navigation }: ProfilStackScreenProps<'Settings'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Edit Filters" onPress={() => navigation.navigate('Filters')} />
      <Button title="View history" onPress={() => navigation.navigate('History')} />
      <Button title="Logout" onPress={() => store.dispatch(setRoot(RootEnum.ROOT_AUTH))} />
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
