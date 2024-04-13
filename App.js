import { Alert, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OTPComponent from './src/OTPComponent';
import Home from './src/Home';
import QRComponent from './src/QRComponent';
import { deleteUser, onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from './Firebase';
import { useEffect, useState } from 'react';
import UserHome from './src/user/UserHome';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [user, setUser] = useState()
  const [anonymousUser, setanonymousUser] = useState()

  onAuthStateChanged(firebaseAuth, (user) => {
    if (user?.isAnonymous) {
      setanonymousUser(user)
    } else if (!user?.isAnonymous) {
      if (anonymousUser) {
        deleteUser(anonymousUser)
      }

      setUser(user)
    }
  })


  return (
    <NavigationContainer>
      {user ?
        <Stack.Navigator initialRouteName='home'>
          <Stack.Screen name='home' component={UserHome}></Stack.Screen>
        </Stack.Navigator>
        :
        <Stack.Navigator initialRouteName='home'>
          <Stack.Screen name='home' component={Home}></Stack.Screen>
          <Stack.Screen name='otp' component={OTPComponent}></Stack.Screen>
          <Stack.Screen name='qr' component={QRComponent}></Stack.Screen>
        </Stack.Navigator>}
    </NavigationContainer>
  );
}

