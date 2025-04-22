import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ProfilStackScreenProps } from '../navigation/Types';

export default function ProfilScreen({ navigation }: ProfilStackScreenProps<'Profil'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil </Text>
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
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
