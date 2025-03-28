import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { MessageStackScreenProps } from '../navigation/Types';

export default function GroupMessageScreen({
  navigation,
  route,
}: MessageStackScreenProps<'GroupMessage'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages with group {route.params.groupId}</Text>
      <Button
        title="See group info"
        onPress={() => navigation.navigate('GroupInfo', { groupId: route.params.groupId })}
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
