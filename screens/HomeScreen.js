import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, FlatList, Dimensions, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth, database } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { onValue, ref } from 'firebase/database';

const HomeScreen = () => {
  const [fontsLoaded] = useFonts({
    'Ubuntu-Regular': require('../assets/fonts/Ubuntu-Regular.ttf'),
  });
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const fetchNodes = () => {
      const nodesRef = ref(database, 'sensor_data');
      onValue(nodesRef, (snapshot) => {
        const data = snapshot.val();
        const nodesArray = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        })) : [];
        setNodes(nodesArray);
        setLoading(false);
      });
    };

    const fetchUser = () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email);
      }
    };

    fetchNodes();
    fetchUser();
  }, []);

  // Check if fonts are loaded
  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const screenWidth = Dimensions.get('window').width;
  const slideWidth = screenWidth - 20; // Subtracting margins

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch(error => alert(error.message));
  };

  const handleNodePress = (node) => {
    navigation.navigate('NodeDetails', { node });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleNodePress(item)}>
      <View style={[styles.slide, { width: slideWidth }]}>
        <Image source={require('../assets/microcontroller.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.deviceInfo}>
          <Text style={[styles.slideText, { fontFamily: 'Ubuntu-Regular' }]}>
            {item.id}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.widget}>
        <FlatList
          data={nodes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={[styles.widget, styles.secondWidget]}>
        <Text style={styles.welcomeText}>
          {`Hello ${userEmail}, welcome to Botanitech, your personalized assistant for plant care and gardening. Let's cultivate your green space together!`}
        </Text>
        <TouchableOpacity onPress={handleSignOut} style={[styles.button, { backgroundColor: 'white' }]}>
          <Text style={[styles.buttonText, { color: 'green' }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 20, // Adjust spacing as needed
  },
  buttonText: {
    color: 'green',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Ubuntu-Regular',
  },
  widget: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden', // Clip content to widget boundaries
  },
  secondWidget: {
    backgroundColor: 'green',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: 20,
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'left',
    color: 'white',
    fontFamily: 'Ubuntu-Regular',
  },
  slide: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  slideText: {
    marginLeft: 10,
    fontSize: 32,
    textAlign: 'left',
    fontFamily: 'Ubuntu-Regular',
  },
  logo: {
    width: 200, // Increase the width as needed
    height: 200, // Increase the height as needed
    marginRight: 10,
  },
  deviceInfo: {
    flex: 1,
    flexDirection: 'column',
  },
});
