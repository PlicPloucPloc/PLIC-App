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

import store, { RootState } from '@app/redux/Store';
import { Images } from '@assets/index';
import PasswordInput from '@components/PasswordInput';
import { RegisterStackScreenProps } from '@navigation/Types';
import { useSelector } from 'react-redux';
import { setRoot, useRegisterMutation } from '@app/redux/slices';
import { RootEnum } from '@app/definitions';

export default function RegisterPasswordScreen(_: RegisterStackScreenProps<'Password'>) {
  const [register, { data, isLoading, isError, error }] = useRegisterMutation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const authState = useSelector((state: RootState) => state.authState);

  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleRegister = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }

    if (password.length < 8) {
      return Alert.alert('Error', 'Password must be at least 8 characters long.');
    }
    var regex = /^(.*[0-9].*)$/;
    if (!regex.test(password)) {
      return Alert.alert('Error', 'Password must contain at least one number.');
    }
    var regex = /^(.*[-!@#$%_^&*].*)$/;
    if (!regex.test(password)) {
      return Alert.alert('Error', 'Password must contain at least one special character.');
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
      console.log('Registering user with data');

      const userInfo = {
        ...authState,
        password,
      };

      console.log('User Info:', userInfo);

      const result = await register(userInfo).unwrap();
      console.log('Register successful:', result);
      alert('Registration Successful');
      // store.dispatch(setRoot(RootEnum.ROOT_INSIDE));
    } catch (err) {
      console.error('Register failed:', err);
    }
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
