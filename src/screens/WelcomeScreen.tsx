import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthStackScreenProps } from '../navigation/Types';

export default function WelcomeScreen({ navigation }: AuthStackScreenProps<'Welcome'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SwAppart !</Text>
      <Button onPress={() => navigation.navigate('Login')} title="Login" />
      <Button onPress={() => navigation.navigate('Signup')} title="Signup" />
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
