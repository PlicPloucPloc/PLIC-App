import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SharedValue } from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { AuthState } from '@app/definitions';
import { UpdateRoomRequest } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setShouldRefecthMessages, setShouldRefetchRoomInfo } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { deleteRoom, updateParticipant } from '@app/rest/ChatService';
import { calculateAge } from '@app/utils/Misc';
import BottomPopupModal from '@components/BottomPopupModal';
import HeaderInfoButton from '@components/HeaderInfoButton';
import ProfilePicture from '@components/ProfilePicture';
import RightActionDelete from '@components/RightActionDelete';
import { SharedStackScreenProps } from '@navigation/Types';

export default function GroupInfoScreen({
  navigation,
  route,
}: SharedStackScreenProps<'GroupInfo'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderInfoButton icon="help-circle-outline" onPress={() => setModalVisible(true)} />
      ),
    });
  }, [navigation]);

  // Page
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

        if (members.length <= 2) {
          updateRequest.users_to_remove.push(authState.userId);
        }

        await updateParticipant(updateRequest);

        const newMembers = members.filter((member) => member.userId !== userId);
        setMembers(newMembers);

        store.dispatch(setShouldRefecthMessages(true));

        if (newMembers.length <= 0) {
          await deleteRoom(roomId);
          navigation.navigate('BottomTabStack', {
            screen: 'MessageStack',
            params: { screen: 'MessageList' },
          });
          return;
        }

        const newRoomInfo = { ...route.params.roomInfo };
        newRoomInfo.participants = newMembers.filter(
          (member) => member.userId !== authState.userId,
        );
        newRoomInfo.participants_id = newRoomInfo.participants.map((p) => p.userId);

        store.dispatch(setShouldRefetchRoomInfo(newRoomInfo));
      } catch (error) {
        console.error('Error removing participant:', error);
      }
    },
    [members, navigation, route.params.roomInfo, authState.userId],
  );

  const renderMemberItem = ({ item }: { item: AuthState }) => (
    <Swipeable
      enabled={route.params.roomInfo.is_owner && item.userId !== authState.userId}
      renderRightActions={(_, drag: SharedValue<number>) => (
        <RightActionDelete drag={drag} onPress={() => handleDeleteMember(item.userId)} />
      )}>
      <TouchableOpacity
        style={styles.memberContainer}
        onPress={() => {
          navigation.navigate('SharedStack', {
            screen: 'OtherProfile',
            params: { user: item },
          });
        }}>
        <ProfilePicture
          size={60}
          imageUri={item.profilePictureUri}
          firstName={item.firstName}
          lastName={item.lastName}
          borderRadius={10}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.firstName} {item.lastName}
            {item.userId === authState.userId && ' (You)'}
            {item.userId === route.params.apartment?.owner_id && ' (Owner)'}
          </Text>
          <Text style={styles.memberAge}>{calculateAge(item.birthdate)} years</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <BottomPopupModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="List of members of this group chat">
        <View>
          <Text style={{ fontSize: 16, color: colors.textPrimary }}>
            This screen is showing all the participants of this group chat.
            {'\n\n'}You can swipe a user to the left in order to remove it from the discussion.
          </Text>
        </View>
      </BottomPopupModal>

      {/* ===== Apartment =====*/}
      {route.params.apartment && (
        <TouchableOpacity
          style={styles.aptInfoContainer}
          onPress={() => {
            if (route.params.apartment) {
              navigation.navigate('ApartmentDetails', {
                apartment: route.params.apartment,
                enableMessageButton: true,
              });
            }
          }}>
          <Image
            source={{ uri: route.params.apartment.image_thumbnail || undefined }}
            style={styles.aptImage}
            resizeMode="cover"
          />
          <Text style={styles.aptName}>{route.params.apartment.name}</Text>
        </TouchableOpacity>
      )}

      {/* ===== Participants =====*/}
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

    aptInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.contrast,
      marginBottom: 16,
    },
    aptImage: {
      width: 60,
      height: 60,
      borderRadius: 10,
    },
    aptName: {
      fontSize: 18,
      fontWeight: '500',
      marginLeft: 12,
    },

    headerContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
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
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    memberInfo: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'center',
    },
    memberName: {
      fontSize: 16,
      fontWeight: '600',
    },
    memberAge: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
