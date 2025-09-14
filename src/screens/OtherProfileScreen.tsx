import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { SharedStackScreenProps } from '@navigation/Types';
import { useSelector } from 'react-redux';

export default function OtherProfileScreen({
  navigation,
  route,
}: SharedStackScreenProps<'OtherProfile'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);

  if (authState.userId == route.params.userId) {
    console.log('My profile');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile of user: {route.params.userId}</Text>
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
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });
