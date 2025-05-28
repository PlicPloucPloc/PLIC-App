import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import * as AuthActions from '@app/redux/slices/app/AuthStateSlice';
import store, { RootState } from '@app/redux/Store';
import { Images } from '@assets/index';
import { RegisterStackScreenProps } from '@navigation/Types';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';

export default function RegisterUserInfoScreen({
  navigation,
}: RegisterStackScreenProps<'UserInfo'>) {
  const authState = useSelector((state: RootState) => state.authState);

  const [firstName, setFirstName] = useState(authState.firstName ?? '');
  const [lastName, setLastName] = useState(authState.lastName ?? '');
  const [birth, setBirth] = useState(authState.birth ? new Date(authState.birth) : null);

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
        store.dispatch(AuthActions.setBirth(selectedDate.toISOString()));
      },
      mode: 'date',
      maximumDate: maxDate,
      minimumDate: new Date(1900, 0, 1, 1), // Set to 1900
    });
  };

  const handleNext = () => {
    if (!firstName || !lastName || !birth) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    navigation.navigate('Password');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Register - About you</Text>
          <TextInput
            ref={firstNameInputRef}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            autoCorrect={false}
            returnKeyType="next"
            autoFocus={true}
            onSubmitEditing={() => lastNameInputRef.current?.focus()}
            onBlur={() => store.dispatch(AuthActions.setFirstName(firstName))}
          />
          <TextInput
            ref={lastNameInputRef}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            autoCorrect={false}
            returnKeyType="next"
            onBlur={() => store.dispatch(AuthActions.setLastName(lastName))}
          />
          <TouchableOpacity onPress={showDatePicker} style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              placeholder="Date of birth"
              editable={false}
              value={birth?.toLocaleDateString()}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buildingsContainer}>
          <Image source={Images.backgroundBuildings} style={{ width: '100%' }} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
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
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#EE5622',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    padding: 3,
    borderRadius: 100,
    borderWidth: 2,
    elevation: 3,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  buildingsContainer: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
  },
});
