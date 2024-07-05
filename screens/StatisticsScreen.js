import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

const windowWidth = Dimensions.get('window').width;


import humidityIcon from '../assets/humid.jpg';
import lightStatusIcon from '../assets/light.jpg';
import soilMoistureIcon from '../assets/soil.jpg';
import temperatureIcon from '../assets/temp.jpg';

const StatisticsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const parameters = ['Humidity', 'Light Status', 'Soil Moisture', 'Temperature'];

  const handleOpenModal = (parameter) => {
    setSelectedParameter(parameter);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedParameter(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Node Statistics</Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sliderContainer}
        horizontal={true} 
        pagingEnabled={true} 
      >
        {parameters.map((parameter, index) => (
          <TouchableOpacity
            key={index}
            style={styles.parameterItem}
            onPress={() => handleOpenModal(parameter.toLowerCase().replace(/\s/g, '_'))} 
          >
            <Image
              source={
                parameter === 'Humidity'
                  ? humidityIcon
                  : parameter === 'Light Status'
                  ? lightStatusIcon
                  : parameter === 'Soil Moisture'
                  ? soilMoistureIcon
                  : temperatureIcon
              }
              style={styles.icon}
              resizeMode="cover" 
            />
            <Text style={styles.parameterText}>{parameter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedParameter ? `Welcome here, ${selectedParameter}!` : ''}</Text>

            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <View style={styles.slideInstructions}>
        <Text style={styles.slideText}>Slide to see more parameters</Text>
        <Text style={styles.slideText}>Click on a parameter to view the graph</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: 'Ubuntu-Regular', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sliderContainer: {
    paddingVertical: 10, 
    flexDirection: 'row',
  },
  parameterItem: {
    width: windowWidth, 
    height: 300, 
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
  },
  icon: {
    width: '100%', 
    height: '100%', 
  },
  parameterText: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontFamily: 'Ubuntu-Regular', 
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Ubuntu-Bold', 
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Ubuntu-Bold', 
  },
  // Slide instructions
  slideInstructions: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  slideText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'Ubuntu-Regular', 
  },
});

export default StatisticsScreen;