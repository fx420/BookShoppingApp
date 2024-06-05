import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ScrollView } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDBConnection, getBooks, checkCart ,insertCart} from '../Database/db-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen =({navigation, route})=>{
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const[BookList,setBookList]=useState([]);
    const[cus_id,setCus_id]=useState(0);

    const loadBooks=async()=>{
        setCus_id(parseInt(await AsyncStorage.getItem('cus_id')))
        setBookList(await getBooks(await getDBConnection()));
    };

    useEffect(() => {loadBooks();},[]);

    const handleSearch = () => {
        if (searchText.trim() === '') {
            setSearchResults([]);
        } else {
            const results = BookList.filter(book => book.bookName.toLowerCase().includes(searchText.toLowerCase()));
            setSearchResults(results);
        }
    };

    const handleBookPress = (book) => {
        navigation.navigate('SearchBook', { book });
    };

    const addToCart = async(book) => {
        if (await checkCart(await getDBConnection(),cus_id,book.id)) {
            await insertCart(await getDBConnection(),cus_id,book.id,);
            console.log("item added to cart");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.bookList}>
                    {searchText.trim() === '' && BookList.map((book) => (
                        <TouchableOpacity key={book.id} style={styles.bookItem} onPress={() => handleBookPress(book)}>
                            <Image source={require('../bookImg/bookcover.jpg')} style={styles.bookImage} />
                            <View style={styles.bookDetails}>
                                <Text style={styles.bookName}>{book.bookName}</Text>
                                <Text style={styles.bookDescription}>{book.bookDes}</Text>
                            </View>
                            <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(book)}>
                                <MaterialCommunityIcon name="cart-plus" size={20} color="black" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}

                    {searchText.trim() !== '' && searchResults.map((book) => (
                        <TouchableOpacity key={book.id} style={styles.bookItem} onPress={() => handleBookPress(book)}>
                            <Image source={require('../bookImg/bookcover.jpg')} style={styles.bookImage} />
                            <View style={styles.bookDetails}>
                                <Text style={styles.bookName}>{book.bookName}</Text>
                                <Text style={styles.bookDescription}>{book.bookDes}</Text>
                            </View>
                            <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(book)}>
                                <MaterialCommunityIcon name="cart-plus" size={20} color="black" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchBar: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    searchButton: {
        backgroundColor: 'lightblue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    searchButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    bookList: {
        flex: 1,
    },
    bookItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    bookImage: {
        width: 80,
        height: 120,
        marginRight: 10,
    },
    bookDetails: {
        flex: 1,
    },
    bookName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    bookDescription: {
        fontSize: 16,
    },
    addToCartButton: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 5,
    },
});
export default SearchScreen;