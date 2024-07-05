import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/core';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        if (user.email.endsWith('@gmail.com')) {
          if (user.email === 'admin@gmail.com') {
            navigation.replace("AdminHome");
          } else {
            navigation.replace("MainContainer");
          }
        } else {
          setError('Please use a @gmail.com email address.');
          auth.signOut(); 
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleSignUp = () => {
    setLoading(true);
    if (!email.endsWith('@gmail.com')) {
      setError('Please use a @gmail.com email address.');
      setLoading(false);
      return;
    }
    if (password.toLowerCase().endsWith('php') || password.toLowerCase().endsWith('html')) {
      setError('Password cannot end with "php" or "html".');
      setLoading(false);
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        if (user.email === 'admin@gmail.com') {
          navigation.replace("AdminHome");
        } else {
          navigation.replace("MainContainer");
        }
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  };

  const handleLogin = () => {
    setLoading(true);
    if (!email.endsWith('@gmail.com')) {
      setError('Please use a @gmail.com email address.');
      setLoading(false);
      return;
    }
    if (password.toLowerCase().endsWith('php') || password.toLowerCase().endsWith('html')) {
      setError('Password cannot end with "php" or "html".');
      setLoading(false);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        if (user.email === 'admin@gmail.com') {
          navigation.replace("AdminHome");
        } else {
          navigation.replace("MainContainer");
        }
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.logoContainer}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
        {error ? <ErrorMessage error={error} /> : null}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignUp} style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const ErrorMessage = ({ error }) => (
  <Text style={styles.errorText}>{error}</Text>
);

export default LoginScreen;

const styles = StyleSheet.create({
  container: 
  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: 
  { width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  inputContainer: 
  { width: '80%', marginBottom: 20 },
  input:
   { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5 },
  buttonContainer: 
  { width: '60%', justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  button: 
  { backgroundColor: 'green', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonOutline: 
  { backgroundColor: 'white', marginTop: 5, borderColor: '#r25995c', borderWidth: 2 },
  buttonText: 
  { color: 'white', fontWeight: '700', fontSize: 16 },
  buttonOutlineText: 
  { color: 'green', fontWeight: '700', fontSize: 16 },
  logo: 
  { width: 250, height: 250, marginBottom: 20, borderRadius: 7 },
  errorText:
   { color: 'red', marginTop: 10 },
});
