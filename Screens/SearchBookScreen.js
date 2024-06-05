import React from 'react';
import { View, StyleSheet } from 'react-native';
import BookDetails from './BookDetails';

const SearchBookScreen = ({ route }) => {
    const { book } = route.params;

    return (
        <View style={styles.container}>
            <BookDetails book={book} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});

export default SearchBookScreen;