import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SharedStackScreenProps } from '../navigation/Types';

export default function OtherProfilScreen({
  navigation,
  route,
}: SharedStackScreenProps<'OtherProfil'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil of user: {route.params.userId}</Text>
      <Button
        title="Contact"
        onPress={() => navigation.navigate('DirectMessage', { userId: route.params.userId })}
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
