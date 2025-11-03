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
import { usePaginatedQuery } from '@app/hooks/UsePaginatedQuery';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { updateAllowColloc } from '@app/rest/RelationService';
import { getRecommendedColloc } from '@app/rest/UserService';
import { calculateAge } from '@app/utils/Misc';
import { Images } from '@assets/index';
import ColocFinderNotEnabled from '@components/ColocFinderNotEnabled';
import HeaderSwitch from '@components/HeaderSwitch';
import ProfilePicture from '@components/ProfilePicture';
import { ColocFinderStackScreenProps } from '@navigation/Types';

export default function ColocFinderScreen({
  navigation,
}: ColocFinderStackScreenProps<'ColocFinder'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [isEnabled, setIsEnabled] = useState(false);

  const fetchData = useCallback((offset: number) => {
    return getRecommendedColloc(offset);
  }, []);

  const {
    data: users,
    setData: setUsers,
    // FIXME: loadingMore,
    refresh,
    refreshing,
    setRefreshing,
    // FIXME: fetchMore,
  } = usePaginatedQuery<AuthState>(fetchData);

  const toggleSwitch = useCallback(
    async (enabled: boolean) => {
      setRefreshing(true);
      setIsEnabled(enabled);
      await updateAllowColloc(enabled);

      if (enabled) {
        refresh();
      } else {
        setUsers([]);
      }
    },
    [refresh, setUsers, setRefreshing],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderSwitch value={isEnabled} onValueChange={toggleSwitch} />,
    });
  }, [navigation, isEnabled, toggleSwitch]);

  return (
    <View style={styles.container}>
      {!isEnabled && <ColocFinderNotEnabled toggleSwitch={toggleSwitch} />}

      {isEnabled && (
        <FlatList
          data={users}
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
          contentContainerStyle={{ flexGrow: 1 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          // FIXME: enable pagination when backend supports it
          // onEndReached={() => fetchMore()}
          // onEndReachedThreshold={0.2}
          // ListFooterComponent={
          //   loadingMore ? (
          //     <ActivityIndicator
          //       size="small"
          //       color={colors.primary}
          //       style={{ marginVertical: 20 }}
          //     />
          //   ) : null
          // }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            refreshing ? null : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>
                  We haven&apos;t found any potential roommates for you at the moment.
                </Text>

                <Image source={Images.alone} style={styles.gif} />

                <Text style={styles.emptyText}>
                  Try to like more apartments to increase your chances!
                </Text>
              </View>
            )
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
      backgroundColor: colors.textSecondary,
    },

    emptyContainer: {
      height: '85%',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingTop: 40,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
    },
    gif: {
      width: '100%',
      height: 300,
      alignSelf: 'center',
      borderRadius: 20,
      marginBottom: 40,
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.textSecondary,
    },
  });
