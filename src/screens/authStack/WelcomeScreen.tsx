import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Images } from '@assets/index';
import { AuthStackScreenProps } from '@navigation/Types';

export default function WelcomeScreen({ navigation }: AuthStackScreenProps<'Welcome'>) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={Images.logo} style={[styles.logo, { justifyContent: 'space-evenly' }]} />
        <Text style={styles.title}>SwAppart</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('RegisterStack', { screen: 'Email' })}
          style={[styles.button, { backgroundColor: '#EE5622' }]}>
          <Text style={[styles.buttonText, { color: 'white' }]}>Register</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buildingsContainer}>
        <Image source={Images.backgroundBuildings} style={{ width: '100%' }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  logoContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  logo: {
    width: '50%',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },

  buttonContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
