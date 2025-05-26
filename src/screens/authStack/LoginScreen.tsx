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

import { RootEnum } from '@app/definitions';
import { setRoot } from '@app/redux/slices';
import store from '@app/redux/Store';
import { Images } from '@assets/index';
import PasswordInput from '@components/PasswordInput';
import { AuthStackScreenProps } from '@navigation/Types';
import Loader from 'components/Loader';

export default function LoginScreen(_: AuthStackScreenProps<'Login'>) {
  const passwordInputRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (email === 'rdoulaud@gmail.com' && password === 'test') {
        store.dispatch(setRoot(RootEnum.ROOT_INSIDE));
      } else {
        Alert.alert('Invalid Credentials', 'The email or password you entered is incorrect.');
      }
    }, 1500);
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password recovery is not implemented yet.');
  };

  return (
    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Loader loading={loading} />
        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Welcome back</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="next"
            autoFocus={true}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />

          <PasswordInput
            ref={passwordInputRef}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.button, loading && { opacity: 0.6 }]}>
            <Text style={styles.buttonText}>Log In</Text>
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
    fontSize: 34,
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
  forgotText: {
    color: '#007BFF',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'white',
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
  },
  buildingsContainer: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
  },
});
