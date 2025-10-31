import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { UserInfoResponse } from '@app/definitions/rest/UserService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { updateAllowColloc } from '@app/rest/RelationService';
import { getRecommendedColloc } from '@app/rest/UserService';
import { CalculateAge } from '@app/utils/Profile';
import ProfilePicture from '@components/ProfilePicture';
import { ColocFinderStackScreenProps } from '@navigation/Types';
import { Switch } from 'react-native-gesture-handler';

export default function ColocFinderScreen({
  navigation,
}: ColocFinderStackScreenProps<'ColocFinder'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [isEnabled, setIsEnabled] = useState(false);

  const [matchingUsers, setMatchingUsers] = useState<UserInfoResponse[]>([]);
  useEffect(() => {
    const fetchMatchingLikes = async () => {
      try {
        const data = await getRecommendedColloc();
        const users = data.users || [];
        const validUsers = users.filter((user): user is UserInfoResponse => user !== null);
        setMatchingUsers(validUsers);
      } catch (err) {
        console.error('An error occurred :', err);
      }
    };
    fetchMatchingLikes();
  }, []);
  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    try {
      await updateAllowColloc(newValue);
      const data = await getRecommendedColloc();
      const users = data.users || [];
      const validUsers = users.filter((user): user is UserInfoResponse => user !== null);
      setMatchingUsers(validUsers);
    } catch (err) {
      console.error('An error occurred :', err);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matching Likes</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#4BA3C3' }}
          thumbColor={isEnabled ? '#175676' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <FlatList
        data={matchingUsers}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SharedStack', {
                screen: 'OtherProfile',
                params: { userId: item.id },
              })
            }
            style={styles.userCard}>
            <ProfilePicture
              size={70}
              imageUri={null}
              firstName={item.firstname}
              lastName={item.lastname}
              borderRadius={10}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {item.firstname} {item.lastname}
              </Text>
              <Text style={styles.userAge}>
                {item.birthdate ? CalculateAge(item.birthdate) : '?'} years
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
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
      paddingTop: 50,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    listContainer: {
      paddingHorizontal: 16,
    },
    separator: {
      height: 1,
      backgroundColor: '#eee',
    },
    emptyContainer: {
      paddingVertical: 48,
      alignItems: 'center',
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
