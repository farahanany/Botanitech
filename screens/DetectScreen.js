import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { fireStorage, ref, uploadBytes } from '../firebase'; // Ensure correct Firebase imports

const DetectScreen = () => {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false); // State to track saving status

  useEffect(() => {
    requestPermission(); // Request camera permissions on component mount
  }, [requestPermission]);

  const handleSavePhoto = async () => {
    if (photo) {
      try {
        setSaving(true); // Set saving state to true
        const response = await fetch(photo.uri);
        const blob = await response.blob(); // Convert fetched photo to blob
        const uniqueId = Date.now().toString(); // Generate a unique ID for the image
        const storageRef = ref(fireStorage, `images/${uniqueId}`); // Construct storage reference
        await uploadBytes(storageRef, blob); // Upload the image blob to Firebase Storage
        console.log('Image uploaded to Firebase Storage successfully!');
      } catch (error) {
        console.error('Error saving photo to Firebase Storage:', error);
      } finally {
        setSaving(false); // Reset saving state
      }
    }
  };

  const handleDiscardPhoto = () => {
    setPhoto(null); // Clear the photo state to discard the image
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={async () => {
            const photoData = await cameraRef.current?.takePictureAsync();
            setPhoto(photoData); // Set captured photo data
          }}
        >
          <Ionicons name="camera" size={32} color="white" />
        </TouchableOpacity>
      </CameraView>

      {/* Save, Cloud, and Discard icons */}
      {photo && (
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={[styles.iconButton, saving && styles.saving]}
            onPress={handleSavePhoto}
            disabled={saving}
          >
            <Ionicons name="save" size={40} color={saving ? 'white' : 'green'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, saving && styles.saving]}
            onPress={handleSavePhoto} // Handle saving to Firebase Storage
            disabled={saving}
          >
            <Ionicons name="cloud" size={40} color={saving ? 'white' : 'green'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleDiscardPhoto}
          >
            <Ionicons name="close" size={40} color="red" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  captureButton: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center icons horizontally
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
    padding: 10,
    marginHorizontal: 10, // Add some horizontal margin between icons
  },
  saving: {
    opacity: 0.6,
  },
});

export default DetectScreen;
