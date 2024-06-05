import React from "react";
import { Button, Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const StartUpPage = ({ navigation}) => {
    
return (
    
    <View style={styles.container}>
        <Image
            style={styles.logo}
            source={require("../img/shopLogo.png")}
        />
        <Text style={styles.title}>Welcome to ABC Book Shop!</Text>
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
        >
            <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("SignUp")}
        >
            <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        
        
    </View>
    
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
},
logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
},
title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
},
button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
},
buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
},
});

export default StartUpPage;