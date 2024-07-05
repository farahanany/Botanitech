import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase'; 
import * as Font from 'expo-font'; 

import statusIcon from '../assets/icons/status.png';
import humidityIcon from '../assets/icons/humid.png';
import lightStatusIcon from '../assets/icons/light.png';
import pumpStateIcon from '../assets/icons/waterpump.png';
import soilMoistureIcon from '../assets/icons/soilmoisture.png';
import temperatureIcon from '../assets/icons/temp.png';

const NodeDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { node } = route.params;

  const [nodeData, setNodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [soilMoisture, setSoilMoisture] = useState(0);

  useEffect(() => {
    const fetchNodeData = () => {
      const nodeRef = ref(database, `sensor_data/${node.id}`);
      onValue(nodeRef, (snapshot) => {
        const data = snapshot.val();
        setNodeData(data);
        setSoilMoisture(data.soil_moisture); 
        setLoading(false);
      });
    };

    fetchNodeData();
  }, [node]);

  useEffect(() => {
    if (soilMoisture < 20) {
      Alert.alert(
        "Low Soil Moisture",
        "The soil moisture level is below 20%. The plant needs watering."
      );
    } else if (soilMoisture > 60) {
      Alert.alert(
        "High Soil Moisture",
        "The soil moisture level is above 60%. The plant is overwatered."
      );
    }
  }, [soilMoisture]);

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.nodeTitle, { fontFamily: 'ubuntu-regular' }]}>Node ID: {node.id}</Text>

      <View style={styles.detailContainer}>
        <Image source={statusIcon} style={styles.icon} />
        <Text style={[styles.detailLabel, styles.statusLabel]}>Status:</Text>
        <Text style={[styles.detailValue, styles.statusValue]}>{nodeData.node_status}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Image source={humidityIcon} style={styles.icon} />
        <Text style={[styles.detailLabel, styles.humidityLabel]}>Humidity:</Text>
        <Text style={[styles.detailValue, styles.humidityValue]}>{nodeData.humidity} %</Text>
      </View>

      <View style={styles.detailContainer}>
        <Image source={lightStatusIcon} style={styles.icon} />
        <Text style={[styles.detailLabel, styles.lightStatusLabel]}>Light Status:</Text>
        <Text style={[styles.detailValue, styles.lightStatusValue]}>{nodeData.light_status}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Image source={pumpStateIcon} style={styles.icon} />
        <Text style={[styles.detailLabel, styles.pumpStateLabel]}>Pump State:</Text>
        <Text style={[styles.detailValue, styles.pumpStateValue]}>{nodeData.pump_state}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Image source={soilMoistureIcon} style={styles.icon} />
        <Text style={[styles.detailLabel, styles.soilMoistureLabel]}>Soil Moisture:</Text>
        <Text style={[styles.detailValue, styles.soilMoistureValue]}>{nodeData.soil_moisture} %</Text>
      </View>

      <View style={styles.detailContainer}>
        <Image source={temperatureIcon} style={styles.icon} />
        <Text style={[styles.detailLabel, styles.temperatureLabel]}>Temperature:</Text>
        <Text style={[styles.detailValue, styles.temperatureValue]}>{nodeData.temperature} °C</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  nodeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'ubuntu-regular',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 45,
    height: 45,
    marginRight: 15,
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'ubuntu-regular',
  },
  detailValue: {
    fontSize: 18,
    fontFamily: 'ubuntu-regular',
  },
  statusLabel: {
    color: 'black',
  },
  statusValue: {
    color: 'black',
  },
  humidityLabel: {
    color: 'black',
  },
  humidityValue: {
    color: 'black',
  },
  lightStatusLabel: {
    color: 'black',
  },
  lightStatusValue: {
    color: 'black',
  },
  pumpStateLabel: {
    color: 'black',
  },
  pumpStateValue: {
    color: 'black',
  },
  soilMoistureLabel: {
    color: 'black',
  },
  soilMoistureValue: {
    color: 'black',
  },
  temperatureLabel: {
    color: 'black',
  },
  temperatureValue: {
    color: 'black',
  },
});

export default NodeDetailsScreen;
