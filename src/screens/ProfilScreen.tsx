import React from 'react';
import { Alert, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { logoutUser } from '@app/rest/UserService';
import ProfilePicture from '@components/ProfilePicture';
import { Ionicons } from '@expo/vector-icons';
import { ProfilStackScreenProps } from '@navigation/Types';
import { useSelector } from 'react-redux';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type SettingItem = {
  title: string;
  subtitle: string;
  icon: IoniconName;
  onPress: () => void;
};

type SettingsSection = {
  title: string;
  data: SettingItem[];
};

export default function ProfilScreen({ navigation }: ProfilStackScreenProps<'Profil'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);

  const settingsSections: SettingsSection[] = [
    {
      title: 'Preferences',
      data: [
        {
          title: 'Filters',
          subtitle: 'Edit filters and narrow your apartment search',
          icon: 'options-outline',
          onPress: () => navigation.navigate('Filters'),
        },
        {
          title: 'History',
          subtitle: 'View your recently viewed apartments',
          icon: 'time-outline',
          onPress: () => navigation.navigate('History'),
        },
      ],
    },
    {
      title: 'Account Managment',
      data: [
        {
          title: 'Logout',
          subtitle: 'Logout from your account',
          icon: 'log-out-outline',
          onPress: () => {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
              { text: 'Cancel' },
              { text: 'Logout', onPress: logoutUser },
            ]);
          },
        },
        {
          title: 'Delete my account',
          subtitle: 'Permanently delete your account',
          icon: 'trash-outline',
          onPress: () => Alert.alert('Not implemented', 'Account deletion is not implemented yet.'),
        },
        {
          title: 'Export data',
          subtitle: 'Request a copy of your data',
          icon: 'cloud-download-outline',
          onPress: () => Alert.alert('Not implemented', 'Data export is not implemented yet.'),
        },
      ],
    },
    {
      title: 'More',
      data: [
        {
          title: 'About Swappart',
          subtitle: 'Version, terms, privacy policy',
          icon: 'information-circle-outline',
          onPress: () => Alert.alert('Not implemented', 'About page is not implemented yet.'),
        },
        {
          title: 'Contact Us',
          subtitle: 'Get in touch with our support team',
          icon: 'mail-outline',
          onPress: () => Alert.alert('Not implemented', 'Contact page is not implemented yet.'),
        },
      ],
    },
    {
      title: 'Section to test scrolling',
      data: [
        {
          title: 'Item 1',
          subtitle: 'Subtitle 1',
          icon: 'earth-outline',
          onPress: () => {},
        },
        {
          title: 'Item 2',
          subtitle: 'Subtitle 2',
          icon: 'eye-outline',
          onPress: () => {},
        },
        {
          title: 'Item 3',
          subtitle: 'Subtitle 3',
          icon: 'shield-half-outline',
          onPress: () => {},
        },
      ],
    },
  ];

  function renderItem({ item }: { item: SettingItem }) {
    return (
      <Pressable
        onPress={item.onPress}
        android_ripple={{ color: `${colors.primary}50` }}
        unstable_pressDelay={100}
        style={styles.item}>
        <Ionicons name={item.icon} size={24} color={colors.textSecondary} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {item.subtitle}
          </Text>
        </View>
      </Pressable>
    );
  }

  const renderSectionHeader = ({ section }: { section: SettingsSection }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'OtherProfil',
            params: { userId: authState.userId },
          })
        }
        android_ripple={{ color: `${colors.primary}50` }}
        unstable_pressDelay={100}
        style={styles.headerContainer}>
        <ProfilePicture size={60} imageUri={authState.profilePicture} />
        <View style={{ flex: 1 }}>
          <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
            {authState.firstName} {authState.lastName}
          </Text>
        </View>
        <Ionicons
          name="arrow-forward"
          size={24}
          color={colors.primary}
          style={{ marginLeft: 10 }}
        />
      </Pressable>
      <SectionList
        sections={settingsSections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 15,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
      borderBottomWidth: 0.5,
      borderBottomColor: '#333',
    },
    username: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '500',
      marginLeft: 15,
    },

    sectionHeader: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '600',
      marginTop: 20,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
    },
    icon: {
      marginRight: 15,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '500',
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 13,
    },
  });
