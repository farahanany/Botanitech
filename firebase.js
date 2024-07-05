import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage, ref, uploadBytes } from 'firebase/storage'; // Import ref and uploadBytes for Firebase Storage
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "enter ur api here",
  authDomain: "ull finde it in fireabse,
  databaseURL: "also firebase",
  projectId: "======",
  storageBucket: "=====",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Get Firebase services
const database = getDatabase(app);
const fireStorage = getStorage(app);

// Export Firebase services
export { auth, database, fireStorage, ref, uploadBytes }; 