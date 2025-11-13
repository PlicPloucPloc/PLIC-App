import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useSelector } from 'react-redux';

import { AuthState } from '@app/definitions';
import { MessageResponse, UpdateRoomRequest } from '@app/definitions/rest/ChatService';
import { RootState } from '@app/redux/Store';
import { deleteRoom, getMessage, updateParticipant } from '@app/rest/ChatService';
import { getOtherUserInfo } from '@app/rest/UserService';
import { calculateAge } from '@app/utils/Misc';
import MessageHeader, { User } from '@components/MessageHeader';
import ProfilePicture from '@components/ProfilePicture';
import { MessageStackScreenProps } from '@navigation/Types';

type MemberWithInfo = {
  userId: string;
  userInfo: AuthState;
  age: number;
};

export default function GroupInfoScreen({
  navigation,
  route,
}: MessageStackScreenProps<'GroupInfo'>) {
  const [roomData, setRoomData] = useState<MessageResponse | null>(null);
  const [members, setMembers] = useState<MemberWithInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = useSelector((state: RootState) => state.authState.userId);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const data = await getMessage(route.params.roomId);

        if (!data) {
          console.error('No room data found');
          return;
        }

        setRoomData(data);
        const membersData = await Promise.all(
          data.participants.map(async (userId) => {
            try {
              const userInfo = await getOtherUserInfo(userId);
              if (!userInfo) {
                return null;
              }
              const age = calculateAge(userInfo.birthdate);
              return {
                userId,
                userInfo,
                age,
              };
            } catch (error) {
              console.error(`Error fetching user info for ${userId}:`, error);
              return null;
            }
          }),
        );

        // Filtrer les résultats null
        const validMembers = membersData.filter(
          (member): member is MemberWithInfo => member !== null,
        );
        setMembers(validMembers);
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [route.params.roomId]);

  const handleDeleteMember = async (userId: string) => {
    if (!roomData) return;

    try {
      const updateRequest: UpdateRoomRequest = {
        room_id: roomData.room_id,
        users_to_add: [],
        users_to_remove: [userId],
      };

      await updateParticipant(updateRequest);
      setMembers(members.filter((member) => member.userId !== userId));
      if (members.length <= 1) {
        await deleteRoom(route.params.roomId);
        await navigation.goBack();
      }
    } catch (error) {
      console.error('Error removing participant:', error);
    }
  };

  const renderRightActions = (userId: string) => {
    if (userId === currentUserId) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteMember(userId)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.deleteText}>Supprimer</Text>
      </TouchableOpacity>
    );
  };

  const renderMemberItem = ({ item }: { item: MemberWithInfo }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.userId)}
      enabled={item.userId !== currentUserId} // Désactiver le swipe pour soi-même
    >
      <TouchableOpacity
        style={styles.memberContainer}
        onPress={() => {
          navigation.navigate('SharedStack', {
            screen: 'OtherProfile',
            params: { userId: item.userId },
          });
        }}>
        <ProfilePicture
          size={48}
          imageUri={item.userInfo.profilePictureUri ?? null}
          firstName={item.userInfo.firstName}
          lastName={item.userInfo.lastName}
          borderRadius={24}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.userInfo.firstName} {item.userInfo.lastName}
            {item.userId === currentUserId && ' (Vous)'}
          </Text>
          <Text style={styles.memberAge}>{item.age} ans</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!roomData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Erreur lors du chargement des informations</Text>
      </View>
    );
  }

  const groupInfo: User = {
    id: roomData.room_id,
    name: `Groupe (${members.length} membres)`,
    lastMessage: roomData.messages[roomData.messages.length - 1]?.message || 'Aucun message',
    avatar: members[0]?.userInfo.profilePictureUri || '',
  };

  return (
    <View style={styles.container}>
      <MessageHeader
        user={groupInfo}
        onBackPress={() => navigation.navigate('DirectMessageList')}
      />

      <View style={styles.headerInfo}>
        <Text style={styles.memberCount}>{members.length} participant(s)</Text>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={styles.listContainer}
        renderItem={renderMemberItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun participant</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
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
  memberInfo: {
    flex: 1,
    marginLeft: 12,
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
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
