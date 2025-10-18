import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { getRecommendedColloc } from '@app/rest/UserService';
import Loader from '@components/Loader';
import { Ionicons } from '@expo/vector-icons';
import { SharedStackScreenProps } from '@navigation/Types';

type UserInfoResponse = {
  id: string;
  firstname: string;
  lastname: string;
  birthdate: string;
};

const calculateAge = (birthdate: string): number => {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const getRandomColor = (): string => {
  const colors = ['#4ade80', '#f87171', '#c084fc', '#a3e635', '#60a5fa', '#f472b6', '#fbbf24'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getInitials = (firstname: string, lastname: string): string => {
  return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
};

export default function MatchingLikesScreen({}: SharedStackScreenProps<any>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [matchingUsers, setMatchingUsers] = useState<UserInfoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchingLikes = async () => {
      try {
        setLoading(true);
        console.log('Fetching recommended colloc...');
        const data = await getRecommendedColloc();
        console.log('Recommended colloc response:', data);

        // L'API retourne {users: [...]} et non pas directement un tableau
        const users = data.users || [];
        console.log('Extracted users:', users);
        console.log('Number of matching users:', users.length);

        // Filtrer les valeurs null
        const validUsers = users.filter((user): user is UserInfoResponse => user !== null);
        console.log('Valid users after filtering:', validUsers);

        setMatchingUsers(validUsers);
      } catch (err) {
        console.error('Error fetching recommended colloc:', err);
        console.error('Error details:', JSON.stringify(err, null, 2));
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingLikes();
  }, []);

  const renderUserItem = ({ item }: { item: UserInfoResponse }) => {
    const bgColor = getRandomColor();

    return (
      <Pressable
        style={styles.userItem}
        onPress={() => {
          // Navigation vers le profil de l'utilisateur si nécessaire
          // navigation.navigate('UserProfile', { userId: item.id });
        }}>
        <View style={styles.userContent}>
          <View style={[styles.avatarContainer, { backgroundColor: bgColor }]}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{getInitials(item.firstname, item.lastname)}</Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {item.firstname} {item.lastname}
            </Text>
            <Text style={styles.userAge}>{calculateAge(item.birthdate)} years</Text>
          </View>
        </View>
        <Ionicons name="home-outline" size={24} color={colors.textPrimary} />
      </Pressable>
    );
  };

  if (loading) {
    return <Loader loading={true} />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matching Likes</Text>
      </View>
      <FlatList
        data={matchingUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No matching likes yet</Text>
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
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    userContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatarContainer: {
      width: 56,
      height: 56,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarInner: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    userAge: {
      fontSize: 14,
      color: colors.textSecondary,
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
    errorText: {
      fontSize: 16,
      color: '#ef4444',
    },
  });
