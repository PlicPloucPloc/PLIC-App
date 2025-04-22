import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthStackScreenProps } from '../navigation/Types';
import store from '../app/store';
import { changeRoot } from '../app/slices';
import { RootEnum } from '../app/definitions';

export default function LoginScreen(_: AuthStackScreenProps<'Login'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Button
        title="Login"
        onPress={() => store.dispatch(changeRoot({ root: RootEnum.ROOT_INSIDE }))}
      />
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
