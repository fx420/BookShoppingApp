import React, { useState,useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Button, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { getDBConnection,deleteUserByid, updateUserData,getUserByID,getAddressByID, updateUserAddressByID } from '../Database/db-service';
import AsyncStorage from '@react-native-async-storage/async-storage';



const AccountScreen = ({ navigation,route }) => {
    const{userData1}=route.params;
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [userData, setUserData] = useState(userData1);
    const [address, setAddress] = useState('');

    const getDeliveryAddress = async (props,setAddress)=>{
        const {id} = props;
        setAddress(await getAddressByID(await getDBConnection(),id))
    
    };

    useEffect(() => {
        getDeliveryAddress({ id:userData1.id }, setAddress);
    }, []);

    const toggleProfileModal = () => {
        setIsProfileModalVisible(!isProfileModalVisible);
    };

    const toggleAddressModal = () => {
        setIsAddressModalVisible(!isAddressModalVisible);
    };

    const handleChangeUsername = async () => {
        try {
            // Update the user data in the database
            await updateUserData(await getDBConnection(), userData); // Pass the userData object directly
            toggleProfileModal();
            console.log('Profile updated successfully');

            const userDataFromDB = await getUserByID(await getDBConnection(), userData1.id); // Assuming you want to fetch user with id 1
            setUserData(userDataFromDB); // Update state with fetched user data
            console.log("-------new user data-----------");
            console.log(userData);

        } catch (error) {
            console.error('Failed to update profile: ', error);
            // Handle error
        }
    };

    const handleAddresse = async () => {
        try {
            // Update the user data in the database
            await updateUserAddressByID(await getDBConnection(),userData1.id,address); 
            toggleAddressModal();
            console.log('Address updated successfully');
            getDeliveryAddress({ id:userData1.id }, setAddress);
        } catch (error) {
            console.error('Failed to update address: ', error);
            // Handle error
        }
    };

    const handleExit = () => {
        toggleProfileModal();
    };

    const handleAddressExit = () => {
        toggleAddressModal();
    };

    

    const handleLogout = async() => {
        await AsyncStorage.setItem('cus_id', '0');
        navigation.navigate('StartUp2');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity style={styles.settingItem} onPress={toggleProfileModal}>
                    <View style={styles.iconContainer}>
                        <Icon name="person-circle" size={50} color="blue" />
                    </View>
                    <Text style={styles.settingText}>User Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={toggleAddressModal}>
                    <View style={styles.iconContainer}>
                        <EntypoIcon name="address" size={50} color="blue" />
                    </View>
                    <Text style={styles.settingText}>Shipping Address</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={isProfileModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new username"
                            onChangeText={(text) => setUserData({ ...userData, username: text })}
                            value={userData.username}
                        />
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new password"
                            secureTextEntry={false}
                            onChangeText={(text) => setUserData({ ...userData, password: text })}
                            value={userData.password}
                        />
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new email"
                            onChangeText={(text) => setUserData({ ...userData, email: text })}
                            value={userData.email}
                        />
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new phone number"
                            onChangeText={(text) => setUserData({ ...userData, phone: text })}
                            value={userData.phone}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Exit" onPress={handleExit} />
                            <Button title="Save" onPress={handleChangeUsername} />
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={isAddressModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Shipping Address</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setAddress(text)}
                            value={address}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Exit" onPress={handleAddressExit} />
                            <Button title="Save" onPress={handleAddresse} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 20
    },
    content: {
        flex: 1
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray'
    },
    iconContainer: {
        marginRight: 10
    },
    settingText: {
        fontSize: 18
    },
    footer: {
        marginBottom: 20
    },
    logoutButton: {
        backgroundColor: 'red',
        paddingVertical: 15,
        borderRadius: 5
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%'
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
        color: 'black'
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: 'blue'
    },
    user: {
        fontSize: 16,
        marginBottom: 5,
        color: 'red'
    },
    address: {
        fontSize: 16,
        marginBottom: 5,
        color: 'blue'
    },
    input: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    }
});

export default AccountScreen;