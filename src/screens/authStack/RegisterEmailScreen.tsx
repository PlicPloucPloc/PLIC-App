import React, { useState } from 'react';
import {
  ActivityIndicator,
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

import * as AuthActions from '@app/redux/slices/AuthStateSlice';
import store, { RootState } from '@app/redux/store';
import { Images } from '@assets/index';
import { RegisterStackScreenProps } from '@navigation/Types';
import { useSelector } from 'react-redux';

export default function RegisterEmailScreen({ navigation }: RegisterStackScreenProps<'Email'>) {
  const authState = useSelector((state: RootState) => state.authState);

  const [email, setEmail] = useState(authState.email ?? '');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (email === 'rdoulaud@gmail.com') {
        Alert.alert('Email Exists', 'This email is already in use.');
      } else {
        navigation.navigate('UserInfo');
      }
    }, 100);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Register - Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            editable={!loading}
            onSubmitEditing={handleNext}
            onBlur={() => store.dispatch(AuthActions.setEmail(email))}
          />
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <TouchableOpacity onPress={handleNext} style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          )}
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
