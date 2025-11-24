import { AuthState } from '@app/definitions';
import ProfilePicture from './ProfilePicture';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { ColorTheme } from '@app/Colors';

type HeaderMessageInfoProps = {
  userInfo?: AuthState;
  onPress?: () => void;
};

export default function HeaderMessageInfo({ userInfo, onPress }: HeaderMessageInfoProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  if (!userInfo) {
    userInfo = {
      firstName: 'Loading',
      lastName: '...',
      profilePictureUri: null,
    } as AuthState;
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ProfilePicture
        size={50}
        imageUri={userInfo.profilePictureUri}
        firstName={userInfo.firstName}
        lastName={userInfo.lastName}
        borderRadius={100}
      />

      <Text style={styles.text}>
        {userInfo.firstName} {userInfo.lastName}
      </Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    text: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginLeft: 10,
    },
  });
