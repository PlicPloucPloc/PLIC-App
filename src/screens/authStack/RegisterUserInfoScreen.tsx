import React, { useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import * as AuthActions from '@app/redux/slices/AuthStateSlice';
import store, { RootState } from '@app/redux/Store';
import { showBirthdatePicker } from '@app/utils/Auth';
import AuthStackButton from '@components/AuthStackButton';
import BackgroundBuildings from '@components/BackgroundBuildings';
import { AuthStackScreenProps } from '@navigation/Types';

export default function RegisterUserInfoScreen({
  navigation,
}: AuthStackScreenProps<'RegisterUserInfo'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);

  const [firstName, setFirstName] = useState(authState.firstName ?? '');
  const [lastName, setLastName] = useState(authState.lastName ?? '');
  const [birthdate, setBirthdate] = useState(
    authState.birthdate ? new Date(authState.birthdate) : null,
  );

  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);

  function handleNext() {
    if (!firstName || !lastName || !birthdate) {
      return Alert.alert('Error', 'Please fill in all fields.');
    }

    navigation.navigate('RegisterPicture');
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Register - About you</Text>
          <TextInput
            ref={firstNameInputRef}
            placeholder="First Name"
            placeholderTextColor={colors.textSecondary}
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            autoCorrect={false}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            autoFocus={true}
            onSubmitEditing={() => lastNameInputRef.current?.focus()}
            onBlur={() => store.dispatch(AuthActions.setFirstName(firstName.trim()))}
          />
          <TextInput
            ref={lastNameInputRef}
            placeholder="Last Name"
            placeholderTextColor={colors.textSecondary}
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            autoCorrect={false}
            autoComplete="family-name"
            textContentType="familyName"
            returnKeyType="next"
            onBlur={() => store.dispatch(AuthActions.setLastName(lastName.trim()))}
          />
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              showBirthdatePicker(birthdate, setBirthdate);
            }}
            style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              placeholder="Date of birth"
              placeholderTextColor={colors.textSecondary}
              editable={false}
              value={birthdate?.toLocaleDateString()}
              pointerEvents="none"
            />
          </TouchableOpacity>

          <AuthStackButton title="Next" onPress={handleNext} />
        </View>

        <BackgroundBuildings />
      </View>
    </TouchableWithoutFeedback>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    buttonContainer: {
      flex: 3,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
      paddingHorizontal: 20,
    },
    input: {
      width: '100%',
      padding: 12,
      borderWidth: 1,
      borderColor: colors.contrast,
      borderRadius: 10,
      fontSize: 16,
      color: colors.textPrimary,
    },
  });
