import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, ScrollView } from "react-native";
import { getDBConnection, signUp } from '../Database/db-service'; // Import the signUp method

const SignUpScreen =({navigation})=>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");

    const isValidEmail = (email) => {
        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailFormat.test(email);
    }
    const handleSignUp = async () => {

        // Validations 
        if (!username.trim()) {
            console.error("Username is required");
            return; //Stop execution if validation fails
        };

        if (!email.trim()) {
            console.error("Email is required");
            return;
        }
        
        else if (!isValidEmail(email)){
            console.error("Invalid email format");
            return;
        };

        if (!password.trim()) {
            console.error("Password is required");
            return;
        };

        if (!confirmPassword.trim()) {
            console.error("Confirm password is required");
            return;
        };

        if (!contactNumber.trim()) {
            console.error("Contact number is required");
            return;
        };

        if (!shippingAddress.trim()) {
            console.error("Shipping address is required");
            return;
        };

        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }

        try {
            // Open the database connection
            const db = await getDBConnection(); 
            
            // Call signUp method
            await signUp(db,  
                username, 
                password, 
                email, 
                contactNumber, 
                shippingAddress 
            ); 

            // Display successful sign-up message
            console.log("Signed up successfully");

            navigation.navigate("Login");

        } catch (error) {
            console.error("Failed to sign up");
            }
    }
    

    return(
        <ScrollView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={contactNumber}
                onChangeText={(text) => setContactNumber(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder="Shipping Address"
                value={shippingAddress}
                onChangeText={(text) => setShippingAddress(text)}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.buttonWord}>Already have an account? Log in</Text>
            </TouchableOpacity>
    </ScrollView>
    );
};
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
            padding: 20,
        },
        inputContainer: {
            marginBottom: 20,
        },
        input: {
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            padding: 10,
            fontSize: 16,
        },
        button: {
            backgroundColor: "#007AFF",
            borderRadius: 5,
            padding: 10,
            alignItems: "center",
            alignSelf: "center",
            width: "30%"
        },
            buttonText: {
            color: "#fff",
            fontSize: 18,
        },
            buttonStyle:{
            padding: 10,
            alignItems: "center",
        },
            buttonWord:{
            color: "#494651",
            fontSize: 16,
        }
    });

export default SignUpScreen;