import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthStackScreenProps } from '../navigation/Types';
import store from '../app/store';
import { RootEnum } from '../app/definitions';
import { changeRoot } from '../app/slices';

export default function SignupScreen(_: AuthStackScreenProps<'Signup'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <Button
        title="Signup"
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
