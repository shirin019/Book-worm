const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pasportLocalMongoose = require('passport-local-mongoose');



const UserSchema = new Schema({
    name : String,
    mobile : Number,
    username: String,
    address :  String
})

UserSchema.plugin(pasportLocalMongoose);
module.exports = mongoose.model('User',UserSchema);

// username  and password provided by passspport 