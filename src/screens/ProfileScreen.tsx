import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import ProfilePicture from '@components/ProfilePicture';
import { SharedStackScreenProps } from '@navigation/Types';
import { useSelector } from 'react-redux';

export default function ProfileScreen({ navigation, route }: SharedStackScreenProps<'Profile'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);

  if (authState.userId == route.params.userId) {
    // console.log('My profile');
  }

  // Tkt frerot pose pas de questions
  const age = Math.floor((Date.now() - new Date(authState.birthdate).getTime()) / 3.15576e10);

  return (
    <View style={styles.container}>
      <ProfilePicture size={250} imageUri={authState.profilePicture} borderRadius={50} />
      <Text style={styles.title}>{authState.firstName}</Text>
      <Text style={styles.title}>{authState.lastName}</Text>
      <Text style={styles.title}>{age}</Text>
      <Button
        title="Contact"
        onPress={() => navigation.navigate('DirectMessage', { userId: route.params.userId })}
      />
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      paddingTop: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });
