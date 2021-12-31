const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title : String,
    author :String,
    description : String,
    imagePath : String,
    publisher : String,
    price : Number,
    availability :  Boolean

});



module.exports = mongoose.model('Book',BookSchema);
