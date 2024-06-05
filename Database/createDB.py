import sqlite3
db = sqlite3.connect('bookshop.sqlite')

db.execute('DROP TABLE IF EXISTS customer')
db.execute(
    '''CREATE TABLE customer(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        shippingAddress TEXT NOT NULL
    )'''
)

db.execute(
    '''CREATE TABLE book(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bookName TEXT NOT NULL,
        bookDes TEXT NOT NULL,
        price DOUBLE,
        imgLink TEXT NOT NULL
    )'''
)

db.execute(
    '''CREATE TABLE cart(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cusID INTEGER,
        bookID INTEGER,
        quantity INTEGER
    )'''
)

db.execute(
    '''CREATE TABLE orders(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cusID INTEGER,
        bookID INTEGER,
        quantity INTEGER,
        status INTEGER,
        shippingAddress TEXT NOT NULL
    )'''
)

db.execute('''
    INSERT INTO orders (cusID,bookID,quantity,status,shippingAddress)
    VALUES (1,1,1,1,'Max house')
''')

db.execute('''
    INSERT INTO orders (cusID,bookID,quantity,status,shippingAddress)
    VALUES (2,2,2,1,'Lewis house')
''')

db.execute('''
    INSERT INTO customer(username,password,email,phone,shippingAddress)
    VALUES('max33','abc123','mv33@gmail.com','011-1234567','Max house')
''')

db.execute('''
    INSERT INTO customer(username,password,email,phone,shippingAddress)
    VALUES('lewis44','123abc','lh44@gmail.com','011-1234567','Lewis house')
''')

db.execute('''
    INSERT INTO book(bookName,bookDes,price,imgLink)
    VALUES ('Peter&Jane','A very good book, suitable for children aged 3-9',15.99,'../bookImg/p1.jpg')
''')

db.execute('''
    INSERT INTO book(bookName,bookDes,price,imgLink)
    VALUES ('Upin&Ipin','A very good book, suitable for children aged 3-9',11.99,'../bookImg/p2.jpg')
''')

db.execute('''
    INSERT INTO book(bookName,bookDes,price,imgLink)
    VALUES ('Tom&Jerry','A very good book, suitable for children aged 3-9',21.99,'../bookImg/p3.jpg')
''')

db.execute('''
    INSERT INTO book(bookName,bookDes,price,imgLink)
    VALUES ('Mickey Mouse','A very good book, suitable for children aged 3-9',21.99,'../bookImg/p3.jpg')
''')

db.execute('''
    INSERT INTO book(bookName,bookDes,price,imgLink)
    VALUES ('Toy Story','A very good book, suitable for children aged 3-9',15.99,'../bookImg/p3.jpg')
''')

db.execute('''
    INSERT INTO book(bookName,bookDes,price,imgLink)
    VALUES ('Captain Malaysia','A very good book, suitable for children aged 3-9',15.99,'../bookImg/p3.jpg')
''')

db.execute('''
    INSERT INTO book(bookName,bookDes,price,imgLink)
    VALUES ('Family guy','A very good book, suitable for children aged 3-9',20.99,'../bookImg/p3.jpg')
''')

db.commit()
db.close()
