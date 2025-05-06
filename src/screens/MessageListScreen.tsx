import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { MessageStackScreenProps } from '@navigation/Types';

export default function MessageListScreen({ navigation }: MessageStackScreenProps<'MessageList'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Message List Screen !</Text>
      <Button
        title="Message with user 1"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'DirectMessage',
            params: { userId: 1 },
          })
        }
      />
      <Button
        title="Message with user 2"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'DirectMessage',
            params: { userId: 1 },
          })
        }
      />
      <Button
        title="Message with group 1"
        onPress={() => navigation.navigate('GroupMessage', { groupId: 1 })}
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
