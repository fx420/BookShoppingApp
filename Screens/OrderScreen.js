import React, { useState,useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { OrderItem } from '../UI';
import { getDBConnection,getBooks, getOrder } from '../Database/db-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderScreen = () => {
    const [refresh, setRefresh] = useState(false);

    const[BookList,setBookList]=useState([]);

    const loadItems=async()=>{
        const storedCusID = await AsyncStorage.getItem('cus_id');

        const dbConnection = await getDBConnection();
        
        const order = await getOrder(dbConnection, storedCusID);

        
        const book = await getBooks(dbConnection);
        
        const tempArr = order.map(orderItem => {
            const matchedBook = book.find(bookItem => bookItem.id === orderItem.bookID);
            return {
                id: orderItem.id,
                quantity: orderItem.quantity,
                status: orderItem.status,
                bookName: matchedBook ? matchedBook.bookName : 'Unknown',
                price: matchedBook ? matchedBook.price : null
            };
        });
        setBookList(tempArr);
        

    };

    useEffect(() => {
        loadItems();

    }, [refresh]); 

    useFocusEffect(
        React.useCallback(() => {
        // Refresh the screen when it comes into focus
        setRefresh(prevRefresh => !prevRefresh);
        }, [])
    );

    const [activeTab, setActiveTab] = useState('toReceive');

    const switchTab = (tab) => {
        setActiveTab(tab);
    };

    const renderContent = () => {
        if (activeTab === 'toReceive') {
            const toReceiveBooks = BookList.filter(book => book.status === 0);
            return (
                <View style={styles.contentContainer}>
                    {toReceiveBooks.map((book) => (
                        <OrderItem key={book.id} book={book} /> 
                    ))}
                </View>
            );
        } else if (activeTab === 'toComplete') {
            const toCompleteBooks = BookList.filter(book => book.status === 1);
            return (
                <View style={styles.contentContainer}>
                    {toCompleteBooks.map((book) => (
                        <OrderItem key={book.id} book={book} />
                    ))}
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'toReceive' && styles.activeTab]}
                    onPress={() => switchTab('toReceive')}
                >
                    <Text style={styles.tabText}>To Receive</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'toComplete' && styles.activeTab]}
                    onPress={() => switchTab('toComplete')}
                >
                    <Text style={styles.tabText}>To Complete</Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView>
                {renderContent()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 'auto',
        fontSize: 18,
        fontWeight: 'bold',
    },
    tabButton: {
        padding: 10,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'blue',
    },
    tabText: {
        fontSize: 18,
    },
    contentContainer: {
        flex: 1,
    },
});

export default OrderScreen;