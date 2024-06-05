import React, { useState,useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

import StartUp from './Screens/StartUpScreen';
import Main from './Screens/Main';
import Login from './Screens/LoginScreen';
import SignUp from './Screens/SignUpScreen';
import Home from './Screens/HomeScreen';


const Stack = createStackNavigator();

const App = (navigation,route) => {
  // State variable to track user login status
  const[cus_id,setCus_ID] = useState(0);

  useEffect(() => {
    // Function to retrieve cus_id from AsyncStorage
    const retrieveCusID = async () => {
      try {
        // Retrieve cus_id from AsyncStorage
        const storedCusID = await AsyncStorage.getItem('cus_id');
        if (storedCusID !== null) {
          // Set the cus_id state with the retrieved value
          setCus_ID(parseInt(storedCusID));
        }
      } catch (error) {
        // Handle AsyncStorage errors
        console.error('Error retrieving cus_id:', error);
      }
    };

    // Call retrieveCusID when the component mounts
    retrieveCusID();
  }, []);

  // Render Sign Up screen if user is not logged in, otherwise render Home screen
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {(cus_id!==0)?(<Stack.Screen name="Main" component={Main} options={{ headerShown: false } } cus_id_Login={cus_id}/>):(<Stack.Screen name="StartUp" component={StartUp} options={{ headerShown: false }}/>)}
        <Stack.Screen name="Login" component={Login} cus_id_Login={cus_id} updateCus_ID_Login={setCus_ID}/>
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Main2" component={Main} options={{ headerShown: false }}/>
        <Stack.Screen name="StartUp2" component={StartUp} options={{ headerShown: false }}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;