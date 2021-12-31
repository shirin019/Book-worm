const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const book = require('./bookStore');
const user = require('./userSchema');


// const OrderSchema = new Schema({
//     customer: Object,
//     book: Object,
//     orderStatus:String,
//     time : {type: Date, default: Date.now},
// });

const OrderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'book'
    },
    orderStatus:String,
    time : {type: Date, default: Date.now},
    
});



module.exports = mongoose.model('Order',OrderSchema);
