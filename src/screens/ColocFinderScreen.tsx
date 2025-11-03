import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ColorTheme } from '@app/Colors';
import { AuthState } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { updateAllowColloc } from '@app/rest/RelationService';
import { getRecommendedColloc } from '@app/rest/UserService';
import { calculateAge } from '@app/utils/Misc';
import { Images } from '@assets/index';
import HeaderSwitch from '@components/HeaderSwitch';
import ProfilePicture from '@components/ProfilePicture';
import { ColocFinderStackScreenProps } from '@navigation/Types';

export default function ColocFinderScreen({
  navigation,
}: ColocFinderStackScreenProps<'ColocFinder'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [isEnabled, setIsEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [matchingUsers, setMatchingUsers] = useState<AuthState[]>([]);

  const refresh = useCallback(() => {
    (async () => {
      setRefreshing(true);
      const users = await getRecommendedColloc().finally(() => setRefreshing(false));
      setMatchingUsers(users);
    })();
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    refresh();
  }, [isEnabled, refresh]);

  const toggleSwitch = useCallback(
    (enabled: boolean) => {
      setIsEnabled(enabled);
      if (enabled) {
        refresh();
      }
      updateAllowColloc(enabled);
    },
    [refresh],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderSwitch value={isEnabled} onValueChange={toggleSwitch} />,
    });
  }, [navigation, isEnabled, toggleSwitch]);

  return (
    <View style={styles.container}>
      {!isEnabled && (
        <View style={styles.disabledContainer}>
          <Text style={styles.disabledTitle}>Find Your Perfect Roommate</Text>

          <Text style={styles.disabledText}>
            Enable the coloc finder to connect with people who share your vibe and lifestyle.
          </Text>

          <Text style={styles.disabledNote}>
            Once enabled, your profile becomes visible to others looking for roommates.
          </Text>

          <TouchableOpacity style={styles.enableButton} onPress={() => toggleSwitch(true)}>
            <Text style={styles.enableButtonText}>Enable Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {isEnabled && (
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          keyExtractor={(item) => item.userId}
          contentContainerStyle={{ flexGrow: 1 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                We haven&apos;t found any potential roommates for you at the moment.
              </Text>

              <Image source={Images.alone} style={styles.gif} />

              <Text style={styles.emptyText}>
                Try to like more apartments to increase your chances!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    separator: {
      height: 1,
      backgroundColor: '#eee',
    },

    emptyContainer: {
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingTop: 40,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 16,
      marginTop: 30,
      textAlign: 'center',
      color: colors.textSecondary,
    },
    gif: {
      width: '100%',
      height: 300,
      alignSelf: 'center',
      borderRadius: 20,
    },

    // sqdlkfhsdqlkfhlksdqjfkjqskfhqskhfksqdhfkqhd
    disabledContainer: {
      height: '75%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    disabledImage: {
      width: 200,
      height: 200,
      marginBottom: 30,
      borderRadius: 20,
    },
    disabledTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 20,
      textAlign: 'center',
    },
    disabledText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 10,
    },
    disabledNote: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
      opacity: 0.8,
    },
    enableButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 30,
    },
    enableButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
  });
