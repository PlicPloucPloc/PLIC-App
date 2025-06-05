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

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import * as AuthActions from '@app/redux/slices/app/AuthStateSlice';
import store, { RootState } from '@app/redux/Store';
import AuthStackButton from '@components/AuthStackButton';
import BackgroundBuildings from '@components/BackgroundBuildings';
import { RegisterStackScreenProps } from '@navigation/Types';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';

export default function RegisterUserInfoScreen({
  navigation,
}: RegisterStackScreenProps<'UserInfo'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);

  const [firstName, setFirstName] = useState(authState.firstName ?? '');
  const [lastName, setLastName] = useState(authState.lastName ?? '');
  const [birth, setBirth] = useState(authState.birthdate ? new Date(authState.birthdate) : null);

  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13); // 13 years old minimum to register

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: birth || new Date(),
      onChange: (_, selectedDate) => {
        if (!selectedDate) return;

        setBirth(selectedDate);
        store.dispatch(AuthActions.setBirthdate(selectedDate.toISOString().split('T')[0]));
      },
      mode: 'date',
      maximumDate: maxDate,
      minimumDate: new Date(1900, 0, 1, 1), // Set to 1900
    });
  };

  function handleNext() {
    if (!firstName || !lastName || !birth) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    navigation.navigate('Password');
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
            returnKeyType="next"
            autoFocus={true}
            onSubmitEditing={() => lastNameInputRef.current?.focus()}
            onBlur={() => store.dispatch(AuthActions.setFirstName(firstName.trim()))}
            selectionColor={colors.contrast}
            cursorColor={colors.contrast}
          />
          <TextInput
            ref={lastNameInputRef}
            placeholder="Last Name"
            placeholderTextColor={colors.textSecondary}
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            autoCorrect={false}
            returnKeyType="next"
            onBlur={() => store.dispatch(AuthActions.setLastName(lastName.trim()))}
            selectionColor={colors.contrast}
            cursorColor={colors.contrast}
          />
          <TouchableOpacity onPress={showDatePicker} style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              placeholder="Date of birth"
              placeholderTextColor={colors.textSecondary}
              editable={false}
              value={birth?.toLocaleDateString()}
              pointerEvents="none"
              selectionColor={colors.contrast}
              cursorColor={colors.contrast}
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
    buildingsContainer: {
      flex: 2,
      width: '100%',
      alignItems: 'center',
      paddingTop: 20,
    },
  });
