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

import { Images } from '@assets/index';
import PasswordInput from '@components/PasswordInput';
import { RegisterStackScreenProps } from '@navigation/Types';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux/store';

export default function RegisterPasswordScreen(_: RegisterStackScreenProps<'Password'>) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const authState = useSelector((state: RootState) => state.authState);

  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleRegister = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    Alert.alert(
      'Success',
      `Account created for ${authState.firstName} ${authState.lastName}\nBirth: ${authState.birth}\nEmail: ${authState.email}`,
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Register - Password</Text>
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
          />

          <PasswordInput
            ref={confirmPasswordInputRef}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            onSubmitEditing={handleRegister}
          />

          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
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
