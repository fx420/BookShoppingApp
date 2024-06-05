import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const BookDetails = ({ book }) => {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require('../bookImg/bookcover.jpg')} style={styles.bookImage} />
            </View>
            <View style={styles.bookDetails}>
                <Text style={styles.bookName}>{book.bookName}</Text>
                <Text style={styles.bookPrice}>Price: RM{book.price}</Text>
                <Text style={styles.bookDescription}>{book.bookDes}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    bookImage: {
        width: 200,
        height: 300,
        resizeMode: 'contain',
        borderRadius: 5,
    },
    bookDetails: {
        alignItems: 'center',
    },
    bookName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bookPrice: {
        fontSize: 18,
        marginBottom: 10,
    },
    bookDescription: {
        fontSize: 16,
        textAlign: 'center',
    },
    
});

export default BookDetails;