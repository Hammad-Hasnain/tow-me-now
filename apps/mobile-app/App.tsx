// import React, { useState } from 'react';
// import LoginScreen from './src/screens/auth/loginScreen';
// import {RegisterScreen} from './src/screens/auth/registrationScreen';

// export default function App() {
//   const [currentScreen, setCurrentScreen] = useState<'Login' | 'Register'>('Login');

//   const navigation = {
//     navigate: (screenName: 'Login' | 'Register') => {
//       setCurrentScreen(screenName);
//     },
//   };

//   if (currentScreen === 'Register') {
//     return <RegisterScreen navigation={navigation} />;
//   }

//   return <LoginScreen navigation={navigation} />;
// }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from './src/screens/auth/loginScreen';
import { RegisterScreen } from './src/screens/auth/registrationScreen';
import UserHomeScreen from './src/screens/user/UserHomeScreen';
import DriverHomeScreen from './src/screens/driver/DriverHomeScreen';
import AvailableDriversScreen from './src/screens/user/AvailableDriversScreen';
import DriverStatusScreen from './src/screens/user/DriverStatusScreen';
import DriverEnrouteScreen from './src/screens/driver/DriverEnrouteScreen';
import Toast from 'react-native-toast-message';
import AccountSettingsScreen from './src/screens/user/AccountSettingsScreen';
import VehicleAccountSettScreen from './src/screens/driver/VehicleAccountSettScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="UserHomeScreen" component={UserHomeScreen} />
        <Stack.Screen name="AvailableDrivers" component={AvailableDriversScreen} />
        <Stack.Screen name="DriverStatus" component={DriverStatusScreen} />
        <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />





        <Stack.Screen name="DriverHomeScreen" component={DriverHomeScreen} />
        <Stack.Screen name="DriverEnrouteScreen" component={DriverEnrouteScreen} />
        <Stack.Screen name="VehicleAccountSettings" component={VehicleAccountSettScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

