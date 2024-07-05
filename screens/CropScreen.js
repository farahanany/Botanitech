import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import axios from 'axios';


const icons = {
  N: require('../assets/nitrogen.jpeg'),
  P: require('../assets/phosphor.jpg'),
  k: require('../assets/potassium.png'),
  Temperature: require('../assets/temp.jpg'),
  Humidity: require('../assets/humid.jpg'),
  PH: require('../assets/ph_2024.png'),
  RainFall: require('../assets/rainfall.png'),
};

const CropScreen = () => {
  const [prediction, setPrediction] = useState(null);
  const [inputs, setInputs] = useState({
    N: '',
    P: '',
    k: '',
    Temperature: '',
    Humidity: '',
    PH: '',
    RainFall: '',
  });

  const handlePrediction = async () => {
    try {
      //enter ur own ip
      const response = await axios.post('http://192.xxx.x.xx:5000/predict', {
        N: parseFloat(inputs.N),
        P: parseFloat(inputs.P),
        k: parseFloat(inputs.k),
        Temperature: parseFloat(inputs.Temperature),
        Humidity: parseFloat(inputs.Humidity),
        PH: parseFloat(inputs.PH),
        RainFall: parseFloat(inputs.RainFall),
      });
  
      console.log('Prediction response:', response.data); // Log response data
  
      if (response.data && response.data.prediction !== undefined) {
        setPrediction(response.data.prediction);
      } else {
        setPrediction('No prediction available');
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
      Alert.alert('Prediction Error', 'Failed to fetch prediction. Please try again later.');
    }
  };

  const handleInputChange = (key, value) => {
    setInputs({
      ...inputs,
      [key]: value,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Crop Prediction</Text>
        <View style={styles.inputContainer}>
          {Object.keys(inputs).map((key) => (
            <View key={key} style={styles.inputRow}>
              <Image source={icons[key]} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder={key}
                onChangeText={(text) => handleInputChange(key, text)}
                keyboardType="numeric"
              />
            </View>
          ))}
        </View>
        <Button title="Predict Crop" onPress={handlePrediction} />
        {prediction !== null && (
          <Text style={styles.prediction}>Predicted Crop: {prediction}</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  prediction: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default CropScreen;
