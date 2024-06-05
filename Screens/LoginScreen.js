import React, { useState } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from "react-native";
import { getDBConnection } from '../Database/db-service'; // Import the required methods from dbService
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation,cus_id_Login,updateCus_ID_Login }) => {
const [input, setInput] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {
    // Validate the form fields
    if (input.trim() === "" || password.trim() === "") {
    alert("Please enter a username.");
    return;
    }

    try {

    // ***Connect to database here***

    // Open the database connection
    const db = await getDBConnection();

    // Query to retrieve user data based on username, email, or phone number
    const query = `SELECT * FROM customer WHERE username = ? `;

    // Execute the query with the input as parameters
    const result = await db.executeSql(query, [input]);
    console.log(result[0].rows.item(0))
    // Check if any rows were returned
    if (result[0].rows.length > 0) {
        // Get the user object
        const user = result[0].rows.item(0);


        // Get the password associated with the username
        const storedPassword=user.password;

        // Check if the entered password matches the stored password
        if (password === storedPassword) {
            console.log('cus_id:'+ user.id)
            //Upon successful login, store customer id 
            await AsyncStorage.setItem('cus_id', user.id.toString());
            // Redirect the user to the main app screen
            navigation.navigate("Main2");
        } else {
        alert("Invalid password.");
        }
    } else {
        alert("User not found.");
    }
    } catch (error) {
    console.error(error);
    alert("Failed to authenticate user.");
    }

    // Reset the form fields
    setInput("");
    setPassword("");
};

return (
    <View style={styles.container}>
    <TextInput
        style={styles.input}
        placeholder="username, email, or phone number"
        onChangeText={text => setInput(text)}
        value={input}
    />
    <TextInput
        style={styles.input}
        placeholder="password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
    />
    <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
    </TouchableOpacity>
    </View>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
},
input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
},
button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    width: "30%"
},
buttonText: {
    color: "#fff",
    fontSize: 18,
},
});

export default Login;
