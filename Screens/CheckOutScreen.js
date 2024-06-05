import React, {useEffect, useState} from "react";
import { Text, View, Image,TouchableHighlight , FlatList,StyleSheet,ToastAndroid} from "react-native";
import {Picker} from '@react-native-picker/picker';
import { TextInput } from "react-native-gesture-handler";


import { getDBConnection,getAddressByID,removeCart,insertOrder,getOrdertest, getCart } from "../Database/db-service";

import { CheckOutItem } from "../UI";

import AsyncStorage from '@react-native-async-storage/async-storage';

import io from 'socket.io-client';



var socket1 = io('http://10.0.2.2:5001/shipping', {
    transports: ['websocket'],
});

var socket2 = io('http://10.0.2.2:5002/fee', {
    transports: ['websocket'],
});

var socket3 = io('http://10.0.2.2:5003/discount', {
    transports: ['websocket'],
});

const CheckOutScreen =({navigation,route})=>{

    
    const { selectedItems, subTotal } = route.params;
    const[cus_id,setCus_id]=useState(0);
    const[payment,setPayment]=useState('');
    const[address,setAddress]=useState('');//get from database

    const[shipping,setShipping]=useState(0); //API
    const[fee,setFee]=useState(0);//API
    const[discount,setDiscount]=useState(0)

    const calculateTotalQuantity = () => {
        let totalQuantity = 0; 
        selectedItems.map((item) => {
            totalQuantity += item.quantity;
        });
        return totalQuantity;
    };

    const calculateSubTotal = () => {
        let sub = 0; 
        selectedItems.map((item) => {

            sub += (item.price*item.quantity);
        });
        return sub;
    };

    const getShipping =()=>{
        let totalQty = calculateTotalQuantity();

        socket1.on('connect', () => {
            console.log(socket1.id); // undefined
            socket1.emit('client_connected', {connected: true});
            
        });
    
        // Handle connection error
        socket1.on('error', error => {
            ToastAndroid.show('Failed to connect to server', ToastAndroid.LONG);
        });

        socket1.emit('client_send',{quantity: totalQty});

        socket1.on('server_send',data=>{
            let result = JSON.parse(data);
            setShipping(result.shipping);
        });
    };

    const getFee =()=>{
        let totalQty = calculateTotalQuantity();

        socket2.on('connect', () => {
            console.log(socket2.id); // undefined
            socket2.emit('client_connected', {connected: true});
            
        });
    
        // Handle connection error
        socket2.on('error', error => {
            ToastAndroid.show('Failed to connect to server', ToastAndroid.LONG);
        });

        socket2.emit('client_send',{quantity: totalQty});

        socket2.on('server_send',data=>{
            let result = JSON.parse(data);
            setFee(result.fee);
        });
    };

    const getDiscount =()=>{
        
        let subTotal2=calculateSubTotal();

        socket3.on('connect', () => {
            console.log(socket3.id); // undefined
            socket3.emit('client_connected', {connected: true});
            
        });
    
        // Handle connection error
        socket3.on('error', error => {
            ToastAndroid.show('Failed to connect to server', ToastAndroid.LONG);
        });

        socket3.emit('client_send',{amount: subTotal2});

        socket3.on('server_send',data=>{
            let result = JSON.parse(data);
            setDiscount(result.discount);
        });
    };

    const loadID =async()=>{
        const storedCusID = await AsyncStorage.getItem('cus_id');
        setCus_id(parseInt(storedCusID));
    };

    const getDeliveryAddress = async (props,setAddress)=>{
        const {id} = props;
        setAddress(await getAddressByID(await getDBConnection(),id))
    
    };
    
    useEffect(() => {
        loadID(); // Load cus_id from AsyncStorage
        getShipping();
        getFee();
        getDiscount();
    }, []);
    
    useEffect(() => {
        getDeliveryAddress({ id: cus_id }, setAddress);
    }, [cus_id]);


    const updateDB =async(props)=>{
        const {cus_id,book_id,quantity}=props;

        await removeCart(await getDBConnection(), cus_id, book_id);
        await insertOrder(await getDBConnection(), cus_id, book_id, quantity, address);
    };
    
    const pay = async () =>{
        
        await Promise.all(selectedItems.map(book => {
            return updateDB({ cus_id, book_id: book.id, quantity: book.quantity });
        }));

        navigation.navigate('Cart');
    };

    let paymentMethods=[
        {
            key: '111',
            value: 'Credit/Debit Card',
        },
        {
            key: '222',
            value: 'E-wallet',
        },
        {
            key: '333',
            value: 'Cash On Delivery',
        },
    
    ]
    
    return(
        <View>
            <Text style={{fontWeight:900, fontSize:15}}>Payment Method:</Text>
            <View>
                <Picker
                    style={styles.picker} // mode={'dropdown'}
                    prompt={'Select Payment Method'}
                    selectedValue={payment}
                    onValueChange={(itemValue) => {
                        setPayment(itemValue);
                        console.log (itemValue); //return the key
                    }}
                    >
                    {paymentMethods.map ((item) => {
                        return <Picker.Item label={item.value} value={item.key} key={item.key}/>;
                    })}
                </Picker>
            </View>

            <Text style={{fontWeight:900, fontSize:15}}>Shipping Address:</Text>
            <TextInput
                onChangeText={(input)=>{
                    setAddress(input);
                }}
                value={address}
                style={{backgroundColor:'white',borderWidth:2, width:'90%', margin:10}}

            />
            {/* Item list */}
            <FlatList style={styles.ItemList}
                        data={selectedItems}
                        renderItem={({ item }) => <CheckOutItem item={item} />} // Render each item using CheckOutItem component
                        keyExtractor={(item, index) => index.toString()}
                    />

            <View style={{flexDirection:'row',backgroundColor:'white', paddingTop:10, paddingBottom:10}}>
                <View>
                    <Text>Sub-Total:</Text>
                    <Text>Discount:</Text>
                    <Text>Shipping Fee:</Text>
                    <Text>Tranasction Fee:</Text>
                    <Text style={{fontSize:22, color:'#2F58CD',fontWeight:'900'}}>Total: </Text>
                </View>
                <View style={{marginLeft:100}}>
                    <Text>RM{parseFloat(subTotal).toFixed(2)}</Text>
                    <Text>RM{discount.toFixed(2)}</Text>
                    <Text>RM{shipping.toFixed(2)}</Text>
                    <Text>RM{fee.toFixed(2)}</Text>
                    <Text style={{fontSize:22, color:'#2F58CD',fontWeight:'900'}}>RM{(shipping+fee+parseFloat(subTotal)-discount).toFixed(2)}</Text>
                </View>
            </View>
            <View style={styles.ComfirmPay}>

                    <TouchableHighlight
                        onPress={()=>{navigation.navigate('Cart')}}
                        
                        style={{backgroundColor:'white',height:40,
                        width:'50%',height:70,justifyContent:'center',
                        alignItems:'center',}}
                    >
                            <Text style={{fontWeight:900, fontSize:15}}>Cancel</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={()=>{pay()}}

                        style={{backgroundColor:'#2F58CD',height:40,
                        width:'50%',height:70,justifyContent:'center',
                        alignItems:'center',}}
                    >
                            <Text style={{color:'white', fontWeight:900, fontSize:15}}>Pay</Text>
                    </TouchableHighlight>

                    
            </View>


        </View>
    );
};


const styles = StyleSheet.create({

    ItemList:{
        width:'100%',
        height:250,
        borderTopWidth:2,
        

    },
    ComfirmPay:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    picker: {
        color: 'white',
        margin: 10,
        backgroundColor:'#3282B8',
        width:'90%'
        
    },
    
});

export default CheckOutScreen;