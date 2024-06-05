import React, { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection,getUserByID } from "../Database/db-service";


const ProfileScreen = ({ navigation, route }) => {
    const [refresh, setRefresh] = useState(false);
    
    const [userData,setUserData]=useState([]);

    const loadUserData =async()=>{
        const storedCusID = await AsyncStorage.getItem('cus_id');
        const dbConnection = await getDBConnection(); // Assuming you have a function to get DB connection
        const userDataFromDB = await getUserByID(dbConnection, parseInt(storedCusID)); // Assuming you want to fetch user with id 1
        setUserData(userDataFromDB); // Update state with fetched user data
    }
    
    useEffect(() => {
        loadUserData();
    }, [refresh]); 

    console.log(userData);

    useFocusEffect(
        React.useCallback(() => {
        // Refresh the screen when it comes into focus
        setRefresh(prevRefresh => !prevRefresh);
        }, [])
    );


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileInfo}>
                    <Icon name="person-circle" size={50} color="blue" />
                    <Text style={styles.username}>{userData ? userData.username : 'Loading...'}</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Order')}
                >
                    <FontAwesomeIcon name="shopping-cart" size={30} color="blue" />
                    <Text style={styles.buttonText}>My Order</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Account',{userData1:userData})}
                >
                    <Icon name="people" size={30} color="blue" />
                    <Text style={styles.buttonText}>Account Setting</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    header: {
        marginBottom: 20
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    username: {
        fontSize: 24,
        marginLeft: 10
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
        width: 200,
        marginBottom: 50,
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        textAlign: 'center',
        marginLeft: 10
    }
});

export default ProfileScreen;