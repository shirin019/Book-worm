
const mongoose = require('mongoose');
const Book = require('../models/bookStore');
const books = require('./books');


mongoose.connect('mongodb://localhost:27017/book-worm',{
    useNewUrlParser: true,
   // useCreateIndex: false,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

const seedDB = async()=>{
books.forEach((data)=>{
    const tempBook = new Book(data);
    await tempBook.save();
})
 }

 
 seedDB().then(() =>
 {db.close();}
 )