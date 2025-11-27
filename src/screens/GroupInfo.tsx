import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { AuthState } from '@app/definitions';
import { UpdateRoomRequest } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { deleteRoom, updateParticipant } from '@app/rest/ChatService';
import { calculateAge } from '@app/utils/Misc';
import ProfilePicture from '@components/ProfilePicture';
import { SharedStackScreenProps } from '@navigation/Types';

export default function GroupInfoScreen({
  navigation,
  route,
}: SharedStackScreenProps<'GroupInfo'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [members, setMembers] = useState<AuthState[]>([]);
  const authState = useSelector((state: RootState) => state.authState);

  useEffect(() => {
    setMembers([authState, ...route.params.roomInfo.participants]);
  }, [authState, route.params.roomInfo]);

  const handleDeleteMember = useCallback(
    async (userId: string) => {
      const roomId = route.params.roomInfo.room_id;

      try {
        const updateRequest: UpdateRoomRequest = {
          room_id: roomId,
          users_to_add: [],
          users_to_remove: [userId],
        };

        await updateParticipant(updateRequest);
        setMembers(members.filter((member) => member.userId !== userId));
        if (members.length <= 1) {
          await deleteRoom(roomId);
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error removing participant:', error);
      }
    },
    [members, navigation, route.params.roomInfo],
  );

  const renderRightActions = (userId: string) => {
    if (userId === authState.userId) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteMember(userId)}>
        <Ionicons name="trash-outline" size={24} color={colors.textPrimary} />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderMemberItem = ({ item }: { item: AuthState }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.userId)}
      enabled={item.userId !== authState.userId}>
      <TouchableOpacity
        style={styles.memberContainer}
        onPress={() => {
          navigation.navigate('SharedStack', {
            screen: 'OtherProfile',
            params: { userId: item.userId },
          });
        }}>
        <ProfilePicture
          size={52}
          imageUri={item.profilePictureUri}
          firstName={item.firstName}
          lastName={item.lastName}
          borderRadius={10}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.firstName} {item.lastName}
            {item.userId === authState.userId && ' (You)'}
          </Text>
          <Text style={styles.memberAge}>{calculateAge(item.birthdate)} years</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{members.length} participants</Text>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={{ paddingTop: 8 }}
        renderItem={renderMemberItem}
      />
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    headerContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    headerTitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },

    memberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
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
      color: colors.textSecondary,
    },
    deleteButton: {
      backgroundColor: '#ff3b30',
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      height: '100%',
    },
    deleteText: {
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: '600',
      marginTop: 4,
    },
  });
