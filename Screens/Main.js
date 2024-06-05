import React from "react";
import { Text, View } from "react-native";

import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import HomeScreen from './HomeScreen';
import BookScreen from "./BookScreen";

import SearchScreen from "./SearchScreen";
import SearchBookScreen from "./SearchBookScreen";

import CartScreen from "./CartScreen";
import CheckOutScreen from "./CheckOutScreen";

import ProfileScreen from "./ProfileScreen";
import AccountScreen from "./AccountScreen";
import MyOrderScreen from "./OrderScreen";



const Tab = createBottomTabNavigator ();
const Stack = createStackNavigator();

const Main = ({navigation,route}) => {

    
    return(
        
        <Tab.Navigator
            initialRouteName={'Home'}
            screenOptions={({ route }) => ({
                headerShown:false,
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor:'grey',
                tabBarLabelStyle:{fontSize:12},
                tabBarStyle:{paddingBottom:10,height:70},
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;
        
                if (route.name === '-Home-') {
                    iconName = focused ? 'home' : 'home-outline';
                }else if (route.name === '-Search-'){
                    iconName = focused ? 'search' : 'search-outline';
                }else if (route.name === '-Cart-'){
                    iconName = focused ? 'cart' : 'cart-outline';
                }
                else if (route.name === '-Profile-'){
                    iconName = focused ? 'person' : 'person-outline';
                }
        
                
                return <Ionicons name={iconName} size={30} color={color} />;
                },
                
            })}
            
        >
            <Tab.Screen name="-Home-" component={HomeStack} />
            <Tab.Screen name="-Search-" component={SearchStack} />
            <Tab.Screen name="-Cart-" component={CartStack} />
            <Tab.Screen name="-Profile-" component={ProfileStack} />
            
        </Tab.Navigator>
        
    );
};

const HomeStack = () => {
    return (
        
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} initialParams={{ initialLoad: true }}/>
            <Stack.Screen name="Book" component={BookScreen} options={{tabBarVisible: false}} />
        </Stack.Navigator>
    
    );
};

const SearchStack = () => {
    return (
        
        <Stack.Navigator>
            <Stack.Screen name="Search" component={SearchScreen} options={{headerShown:false}} initialParams={{ initialLoad: true }}/>
            <Stack.Screen name="SearchBook" component={SearchBookScreen} options={{tabBarVisible: false}} />
        </Stack.Navigator>
    
    );
};

const CartStack = () => {
    return (
        
        <Stack.Navigator>
            <Stack.Screen name="Cart" component={CartScreen} options={{headerShown:false}} initialParams={{ initialLoad: true }}/>
            <Stack.Screen name="CheckOut" component={CheckOutScreen} options={{tabBarVisible: false}} />
        </Stack.Navigator>
    
    );
};

const ProfileStack = () => {
    return (
        
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown:false}} initialParams={{ initialLoad: true }}/>
            <Stack.Screen name="Order" component={MyOrderScreen} options={{tabBarVisible: false}} />
            <Stack.Screen name="Account" component={AccountScreen} options={{tabBarVisible: false}} />
        </Stack.Navigator>
    
    );
};



export default Main;