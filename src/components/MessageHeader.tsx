import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
}

interface ChatHeaderProps {
  user: User;
  onBackPress: () => void;
}

export default function MessageHeader({ user, onBackPress }: ChatHeaderProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingTop: 50, // Pour le status bar
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333333',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 24,
    color: '#666666',
  },
});
