import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebase'; 
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const ControlScreen = () => {
  const navigation = useNavigation();
  const [node3State, setNode3State] = useState('OFF');

  useEffect(() => {
    const fetchData = () => {
      const node3Ref = ref(database, `sensor_data/node3`);

      onValue(node3Ref, (snapshot) => {
        const nodeData = snapshot.val();
        setNode3State(nodeData.pump_state || 'OFF');
        checkSoilMoisture(nodeData.soil_moisture, 'node3');
      });
    };

    fetchData();

    const registerForPushNotificationsAsync = async () => {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    
    };

    registerForPushNotificationsAsync();

    return () => {
      
    };
  }, []);

  const checkSoilMoisture = (soilMoisture, node) => {
    if (soilMoisture < 20 && node3State === 'OFF') {
      togglePump(node, 'ON');
      sendPushNotification(`The water pump is turned on because the plant needs watering. Node: ${node}`);
    } else if (soilMoisture > 60 && node3State === 'ON') {
      togglePump(node, 'OFF');
      sendPushNotification(`Attention, the plant is overwatered. Node: ${node}`);
    }
  };

  const togglePump = (node, newState) => {
    const nodeRef = ref(database, `sensor_data/${node}/pump_state`);

    set(nodeRef, newState)
      .then(() => {
        setNode3State(newState);
      })
      .catch((error) => {
        console.error('Error updating pump state:', error);
      });
  };

  const sendPushNotification = async (message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Smart Farming System',
        body: message,
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.nodeContainer}>
        <View style={styles.widget}>
          <Image source={require('../assets/pumping.png')} style={styles.image} />
        </View>
        <View style={styles.widget}>
          <Text style={styles.statusText}>Node 3 Pump Status: {node3State === 'ON' ? 'On' : 'Off'}</Text>
        </View>
        <View style={styles.widget}>
          <TouchableOpacity
            style={[styles.button, styles.turnButton, node3State === 'ON' ? styles.disabledButton : styles.activeButtonGreen]}
            onPress={() => togglePump('node3', 'ON')}
            disabled={node3State === 'ON'}>
            <Text style={styles.buttonText}>Turn On</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.widget}>
          <TouchableOpacity
            style={[styles.button, styles.turnButton, node3State === 'OFF' ? styles.disabledButton : styles.activeButtonRed]}
            onPress={() => togglePump('node3', 'OFF')}
            disabled={node3State === 'OFF'}>
            <Text style={styles.buttonText}>Turn Off</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  nodeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  widget: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  statusText: {
    fontSize: 30,
    fontFamily: 'Ubuntu-Regular',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  turnButton: {
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  activeButtonGreen: {
    backgroundColor: 'green',
  },
  activeButtonRed: {
    backgroundColor: 'red',
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
});

export default ControlScreen;
