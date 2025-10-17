import React from 'react';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MessageHeader, { User } from '@components/MessageHeader';
import { Ionicons } from '@expo/vector-icons';
import { MessageStackScreenProps } from '@navigation/Types';
import { Swipeable } from 'react-native-gesture-handler';
type Member = {
  id: string;
  name: string;
  age: string;
  avatar: string;
};

export default function GroupInfoScreen({ navigation }: MessageStackScreenProps<'GroupInfo'>) {
  const groupInfo: User = {
    id: 1,
    name: 'Appartement Paris 12e',
    lastMessage: 'Visite prévue demain à 18h',
    avatar:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=100&q=80',
  };

  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Obiwan Kenobi',
      age: '23 years',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    { id: '3', name: 'Jean Baptiste', age: '30 years', avatar: 'https://i.pravatar.cc/100?img=1' },
    {
      id: '2',
      name: 'Marie Claire',
      age: '27 years',
      avatar: 'https://i.pravatar.cc/100?img=2',
    },
    {
      id: '4',
      name: 'Michel Vaillant',
      age: '28 years',
      avatar: 'https://i.pravatar.cc/150?img=56',
    },
  ]);

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId));
  };

  const renderRightActions = (memberId: string) => {
    return (
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteMember(memberId)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.deleteText}>Supprimer</Text>
      </TouchableOpacity>
    );
  };

  const renderMemberItem = ({ item }: { item: Member }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.memberContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberAge}>{item.age}</Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <MessageHeader user={groupInfo} onBackPress={() => navigation.goBack()} />

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderMemberItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  groupNameContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingTop: 8,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#4CAF50',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberAge: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
