import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { MessageStackScreenProps } from '../navigation/Types';

export default function GroupInfoScreen({
  navigation,
  route,
}: MessageStackScreenProps<'GroupInfo'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Info of group {route.params.groupId}</Text>
      <Button
        title="See profil of user 1"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'OtherProfil',
            params: { userId: 1 },
          })
        }
      />
      <Button
        title="See profil of user 2"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'OtherProfil',
            params: { userId: 2 },
          })
        }
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
