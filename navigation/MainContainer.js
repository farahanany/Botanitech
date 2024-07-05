import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from 'react-native'; 

// Screens
import HomeScreen from '../screens/HomeScreen';
import CropScreen from '../screens/CropScreen';
import DetectScreen from '../screens/DetectScreen';
import ControlScreen from '../screens/ControlScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import NodeDetailsScreen from '../screens/NodeDetailsScreen';

const Tab = createBottomTabNavigator();

// MainContainer to handle all screens
function MainContainer() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { fontSize: 10 }, 
        tabBarStyle: { display: 'flex' }
      }}>

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: color, fontSize: 10 }}>{focused ? 'Home' : 'Home'}</Text> // Adjusted fontSize
          )
        }}
      />
      <Tab.Screen
        name="Crop"
        component={CropScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: color, fontSize: 10 }}>{focused ? 'Crop' : 'Crop'}</Text> // Adjusted fontSize
          )
        }}
      />
      <Tab.Screen
        name="Detect"
        component={DetectScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: color, fontSize: 10 }}>{focused ? 'Detect' : 'Detect'}</Text> // Adjusted fontSize
          )
        }}
      />
      <Tab.Screen
        name="Control"
        component={ControlScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: color, fontSize: 10 }}>{focused ? 'Control' : 'Control'}</Text> // Adjusted fontSize
          )
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: color, fontSize: 10 }}>{focused ? 'Statistics' : 'Statistics'}</Text> // Adjusted fontSize
          )
        }}
      />
      <Tab.Screen
        name="NodeDetails"
        component={NodeDetailsScreen}
        options={{ tabBarButton: () => null, tabBarVisible: false }}
      />
    </Tab.Navigator>
  );
}

export default MainContainer;
