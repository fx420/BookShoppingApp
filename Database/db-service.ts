import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';

const databaseName = 'bookshop.sqlite';

// Enable promise for SQLite
enablePromise(true);

export const getDBConnection = async() => {
    return openDatabase(
        {name: `${databaseName}`, createFromLocation: `~${databaseName}`},
        //{name: databaseName},
        openCallback,
        errorCallback,
    );
}
const openCallback = () => {
    console.log('database open success');
}

const errorCallback = (err: any) => {
    console.log('Error in opening the database: ' + err);
}

//------------------------------------------------customer-------------------------------------------------------

export const getAddressByID= async( db: SQLiteDatabase , id:any ): Promise<any> => {
    try{
        
        const query = `SELECT shippingAddress FROM customer WHERE id = ?`;
        
        let result = await db.executeSql(query,[id]);
        console.log("address retrieved")
        if (result[0].rows.length > 0) {
            return result[0].rows.item(0).shippingAddress;
        } else {
            return null;
        }
        

    } catch (error) {
        console.error(error);
        
    }
}

// Get id using username, if username not found, returns id=0
export const loginGetID = async( db: SQLiteDatabase , username:String ): Promise<any> => {
    try{
        let id = 0;
        const query = `SELECT id FROM customer WHERE username = ?`;
        let result = await db.executeSql(query,[username]);
        if (result[0].rows.length > 0) {
            // username found, return id
            return result[0].rows.item(0);
        } else {
            // username not found, return id = 0
            return id;
        }
    } catch (error) {
        console.error(error);
        throw Error('Failed to get user id !!!');
    }
}
/*
// Get Password using username, to verify password entered
export const loginGetPassword = async( db: SQLiteDatabase , username:String ): Promise<any> => {
    try{
        const query = `SELECT password FROM customer WHERE username = ?`;
        let result = await db.executeSql(query,[username]);
        return result[0].rows.item(0);
    } catch (error) {
        console.error(error);
        throw Error('Failed to get user id !!!');
    }
}
*/
export const getUserByID= async( db: SQLiteDatabase , id:any ): Promise<any> => {
    try{
        const query = `SELECT * FROM customer WHERE id = ?`;
        const result = await db.executeSql(query, [id]);
        
        return result[0].rows.item(0)

    } catch (error) {
        console.error(error);
        throw Error('Failed to get user  !!!');
    }
}


//method  insert record during sign up
export const signUp = async(db: SQLiteDatabase , username:any,password:any,email:any,contactNumber:any,shippingAddress:any)=>{
    try{
        const query = 'INSERT INTO customer (username, password, email, phone, shippingAddress) VALUES (?, ?, ?, ?, ?)';
        const parameters = [username,password,email,contactNumber,shippingAddress]
        await db.executeSql(query,parameters);
    } catch (error) {
        console.error(error);
        throw Error('Failed to insert customer !!!');
    }
}

export const updateUserData = async(db: SQLiteDatabase , userData:any ): Promise<any> =>{
    try {
        const query = `UPDATE customer SET username = ?, password = ?, email = ? , phone=?, shippingAddress=? WHERE id = ?`;
        await db.executeSql(query, [userData.username,userData.password,userData.email,userData.phone,userData.shippingAddress,userData.id]);
        console.log(`User updated successfully!`);
    } catch (error) {
        console.error('Failed to update user:', error);
        throw new Error('Failed to update user!');
    }
}

export const updateUserAddressByID = async(db: SQLiteDatabase , id:any, address:any)=>{
    try {
        const query = `UPDATE customer SET shippingAddress=? WHERE id = ?`;
        await db.executeSql(query, [address,id]);
        console.log(`User shipping address updated successfully!`);
    } catch (error) {
        console.error('Failed to update user:', error);
        throw new Error('Failed to update user!');
    }
}
//------------------------------------------------book-------------------------------------------------------

//Get all books
//  [
//    { id: 1, name: 'Book 1', price: 10.99 },
//    { id: 2, name: 'Book 2', price: 19.99 }
//  ]
export const getBooks = async( db: SQLiteDatabase ): Promise<any> => {
    try{
        const books : any = [];
        const query = `SELECT * FROM book`;
        const results = await db.executeSql(query);
        results.forEach(result => {
            (result.rows.raw()).forEach(( item:any ) => {
                books.push(item);
            })
        });
        console.log('books loaded');
        return books;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get books !!!');
    }
}


// Search book base on bookName
export const getBookByName= async( db: SQLiteDatabase , bookName:String ): Promise<any> => {
    try{
        const books : any = [];
        const query = `SELECT * FROM book WHERE bookName = ?`;
        let results = await db.executeSql(query,[bookName]);

        if (results[0].rows.length > 0) { //book found
            results.forEach(result => {
                (result.rows.raw()).forEach(( item:any ) => {
                    books.push(item);
                })
            });
        }

        return books;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get searched book  !!!');
    }
}

// Search book base on id
export const getBookByID= async( db: SQLiteDatabase , id:any ): Promise<any> => {
    try{
        
        const query = `SELECT * FROM book WHERE id = ?`;
        
        let result = await db.executeSql(query,[id]);

        return result;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get searched book  !!!');
    }
}



//------------------------------------------------cart-------------------------------------------------------

export const checkCart = async( db: SQLiteDatabase , cusID:any ,bookID:any  ): Promise<any> => {
    try{
        let notInCart = true;
        const query = `SELECT id FROM cart WHERE cusID = ? AND bookID=?`;
        let result = await db.executeSql(query,[cusID,bookID]);
        if (result[0].rows.length > 0) {
            // bookName found, return id
            return notInCart=false;
        } else {
            // bookName not fun
            return notInCart;
        }
    } catch (error) {
        console.error(error);
        throw Error('Failed to check cart !!!');
    }
}

//insert order to orders table
export const insertCart = async( 
    db: SQLiteDatabase,
    cusID:number,
    bookID:number,
    

) => {
    try{
        const query = 'INSERT INTO cart(cusID,bookID,quantity) VALUES(?,?,?)';
        const parameters = [cusID,bookID,1]
        await db.executeSql(query,parameters);
    } catch (error) {
        console.error(error);
        throw Error('Failed to insert cart !!!');
    }
}

export const getCart = async( db: SQLiteDatabase, cusID:any ): Promise<any> => {
    try{
        const books : any = [];
        const query = `SELECT bookID FROM cart WHERE cusID = ?`;
        const results = await db.executeSql(query,[cusID]);
        results.forEach(result => {
            (result.rows.raw()).forEach(( item:any ) => {
                books.push(item);
            })
        });
        console.log('books loaded');
        return books;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get books from cart !!!');
    }
}

//when user selects pay in check out screen, remove books in cart using cus & book id
export const removeCart = async( 
    db: SQLiteDatabase,
    cusID: number,
    bookID:number
    ) => {
    try{
        const query = 'DELETE FROM cart WHERE cusID = ? AND bookID = ?' ;
        await db.executeSql(query,[cusID,bookID]);
        console.log("remove successful");
        
    } catch (error) {
        console.error(error);
        throw Error('Failed to remove book !!!');
    }
}


//------------------------------------------------orders-------------------------------------------------------

//insert order to orders table
export const insertOrder = async( 
    db: SQLiteDatabase,
    cusID:number,
    bookID:number,
    quantity:number,
    shippingAddress:String

) => {
    try{
        const query = 'INSERT INTO orders(cusID,bookID,quantity,status,shippingAddress) VALUES(?,?,?,?,?)';
        const parameters = [cusID,bookID,quantity,0,shippingAddress]
        await db.executeSql(query,parameters);
    } catch (error) {
        console.error(error);
        throw Error('Failed to insert order !!!');
    }
}

export const getOrder = async( db: SQLiteDatabase, cusID:any ): Promise<any> => {
    try{
        const books : any = [];
        const query = `SELECT * FROM orders WHERE cusID = ?`;
        const results = await db.executeSql(query,[cusID]);
        results.forEach(result => {
            (result.rows.raw()).forEach(( item:any ) => {
                books.push(item);
            })
        });
        console.log('orders loaded');
        return books;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get orders !!!');
    }
}

export const getOrdertest = async( db: SQLiteDatabase ): Promise<any> => {
    try{
        const books : any = [];
        const query = `SELECT * FROM orders`;
        const results = await db.executeSql(query);
        results.forEach(result => {
            (result.rows.raw()).forEach(( item:any ) => {
                books.push(item);
            })
        });
        console.log('orders loaded');
        return books;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get orders !!!');
    }
}