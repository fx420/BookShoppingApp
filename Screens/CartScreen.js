import React, { useState,useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Alert, Image,ToastAndroid } from "react-native";
import { getDBConnection,getCart,getBooks, removeCart } from "../Database/db-service";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Cart = ({ navigation }) => {
    const [refresh, setRefresh] = useState(false);
    const[cus_id,setCus_id]=useState(0); // get by async storage
    const [total, setTotal] = useState(0);

    const [items, setItems] = useState([]); //final


    const loadItems=async()=>{

        const dbConnection = await getDBConnection();
        
        const cartList = await getCart(dbConnection, cus_id);
        const BookList = await getBooks(dbConnection);
        
        const tempArr = BookList
            .filter(item =>  cartList.some(cartItem=>cartItem.bookID===item.id))
            .map(book =>({id: book.id, name: book.bookName,price: book.price, quantity: 1, selected:false}));
        setItems(tempArr);

        setTotal(0);
        

    };

    useEffect(() => {
        const fetchData = async () => {
            const storedCusID = await AsyncStorage.getItem('cus_id');
            setCus_id(parseInt(storedCusID));
        };
    
        fetchData();
    }, []);
    

    useEffect(() => {
        loadItems();
    }, [cus_id,refresh]); 

    useFocusEffect(
        React.useCallback(() => {
        // Refresh the screen when it comes into focus
        setRefresh(prevRefresh => !prevRefresh);
        }, [])
    );
    

    const handleSelectedItem = (itemId) => {
        let updatedItems = items;
        updatedItems = updatedItems.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
        );
        setTotal(calculateTotal(updatedItems));
        setItems(updatedItems);
    };

    const handleQuantityChange = (itemId, change) => {
        let updatedItems = [...items];
        updatedItems = updatedItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + change } : item
        );

        if (change < 0 && updatedItems.find((item) => item.id === itemId).quantity === 0) {
        // If quantity is decreased to 0, prompt the user for confirmation
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item from your cart?",
            [
            { text: "Cancel", style: "cancel" },
            {
                text: "OK",
                onPress: () => removeItem(itemId)
            }
            ]
        );
        } else {
        setTotal(calculateTotal(updatedItems));
        setItems(updatedItems);
        }
    };

    const removeItem = async(itemId) => {

        await removeCart(await getDBConnection(),cus_id,itemId)

        let updatedItems = items.filter((item) => item.id !== itemId);

        setTotal(calculateTotal(updatedItems));
        setItems(updatedItems);
    };

    const calculateTotal = (updatedItems) => {
        let total = 0;
        updatedItems.forEach((item) => {
        if (item.selected) {
            total += item.price * item.quantity;
        }
        });
        return total.toFixed(2);
    };

    const Checkout = () => {
        
        const selectedItems = items.filter(item => item.selected);


        if (selectedItems.length===0) {
            ToastAndroid.show('No item selected', ToastAndroid.LONG);
        } else {
            navigation.navigate("CheckOut", {
                selectedItems:selectedItems,
                subTotal:total
            });
        }
        
    };


    return (
        <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
            {items.map((item) => (
            <View
                key={item.id}
                style={{
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%"
                }}
            >
                <TouchableOpacity onPress={() => handleSelectedItem(item.id)}>
                <View
                    style={{
                    width: 20,
                    height: 20,
                    borderWidth: 1,
                    borderRadius: 3,
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "gray",
                    marginLeft: 20
                    }}
                >
                    {item.selected && (
                    <View
                        style={{
                        width: 12,
                        height: 12,
                        backgroundColor: "green"
                        }}
                    />
                    )}
                </View>
                </TouchableOpacity>
                <Image
                    source={require('../bookImg/bookcover.jpg')}
                    style={{ width: 70, height: 100 }}
                />
                <View>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {item.name}
                </Text>
                <View
                    style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5
                    }}
                >
                    <TouchableOpacity
                    onPress={() => handleQuantityChange(item.id, -1)}
                    >
                    <Text style={{ fontSize: 20 }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, marginHorizontal: 10 }}>
                    {item.quantity}
                    </Text>
                    <TouchableOpacity
                    onPress={() => handleQuantityChange(item.id, 1)}
                    >
                    <Text style={{ fontSize: 20 }}>+</Text>
                    </TouchableOpacity>
                </View>
                </View>
                <Text style={{ fontSize: 20, marginRight: 10 }}>RM {item.price}</Text>
            </View>
            ))}
        </View>
        
        <View
            style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingBottom: 20,
            borderTopWidth: 1,
            borderTopColor: "#ccc"
            }}
        >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Total</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            RM {total}
            </Text>
            <TouchableOpacity
            style={{
                backgroundColor: "#2F58CD",
                padding: 15,
                alignItems: "center",
                width: "40%",
                height:"100%",
            }}
            onPress={Checkout}
            >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                Checkout
            </Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

export default Cart;