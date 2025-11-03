import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { AuthState } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { updateAllowColloc } from '@app/rest/RelationService';
import { getRecommendedColloc } from '@app/rest/UserService';
import { CalculateAge as calculateAge } from '@app/utils/Misc';
import HeaderSwitch from '@components/HeaderSwitch';
import ProfilePicture from '@components/ProfilePicture';
import { ColocFinderStackScreenProps } from '@navigation/Types';

export default function ColocFinderScreen({
  navigation,
}: ColocFinderStackScreenProps<'ColocFinder'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [isEnabled, setIsEnabled] = useState(false);
  const [matchingUsers, setMatchingUsers] = useState<AuthState[]>([]);

  useEffect(() => {
    const fetchMatchingLikes = async () => {
      try {
        const users = await getRecommendedColloc();
        setMatchingUsers(users);
      } catch (err) {
        console.error('An error occurred :', err);
      }
    };

    fetchMatchingLikes();
  }, []);

  const onValueChange = async (value: boolean) => {
    setIsEnabled(value);
    try {
      await updateAllowColloc(value);
      const users = await getRecommendedColloc();
      setMatchingUsers(users);
    } catch (err) {
      console.error('An error occurred :', err);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderSwitch onValueChange={onValueChange} value={isEnabled} />,
    });
  }, [navigation, isEnabled]);

  return (
    <View style={styles.container}>
      <FlatList
        data={matchingUsers}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SharedStack', {
                screen: 'OtherProfile',
                params: { userId: item.userId },
              })
            }
            style={styles.userCard}>
            <ProfilePicture
              size={70}
              imageUri={item.profilePictureUri}
              firstName={item.firstName}
              lastName={item.lastName}
              borderRadius={10}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.userAge}>{calculateAge(item.birthdate)} years</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No matching likes, you can active if you click here but others could see your likes
            </Text>
          </View>
        }
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
    listContainer: {},
    separator: {
      height: 1,
      backgroundColor: '#eee',
    },
    emptyContainer: {
      paddingTop: 30,
      paddingHorizontal: 20,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    userInfo: {
      marginLeft: 16,
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    userAge: {
      fontSize: 16,
      color: colors.textSecondary,
    },
  });
