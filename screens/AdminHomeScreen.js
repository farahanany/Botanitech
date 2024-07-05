import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getAuth, deleteUser, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; 

const AdminHomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [deleteUserIdentifier, setDeleteUserIdentifier] = useState('');
  const [addUserEmail, setAddUserEmail] = useState('');
  const [addUserPassword, setAddUserPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      setAdminEmail(currentUser.email);
    }
  }, []);

 

  const handleAddUser = async () => {
    setLoading(true);

    try {
      const authInstance = getAuth(); // Get the Auth instance

      const userCredential = await createUserWithEmailAndPassword(authInstance, addUserEmail, addUserPassword);


      Alert.alert('Success', `User with email ${addUserEmail} added successfully!`);
      setAddUserEmail('');
      setAddUserPassword('');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch(error => Alert.alert('Error', error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome Admin: {adminEmail}
      </Text>
     
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New User Email"
          value={addUserEmail}
          onChangeText={text => setAddUserEmail(text)}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={addUserPassword}
          onChangeText={text => setAddUserPassword(text)}
          secureTextEntry
        />
        <Button
          title="Add User"
          onPress={handleAddUser}
          disabled={loading || !addUserEmail || !addUserPassword}
        />
      </View>
      <Button
        title="Sign Out"
        onPress={handleSignOut}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default AdminHomeScreen;
