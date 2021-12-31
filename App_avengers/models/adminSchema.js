const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pasportLocalMongoose = require('passport-local-mongoose');



const AdminSchema = new Schema({
    username : String
})

AdminSchema.plugin(pasportLocalMongoose);
module.exports = mongoose.model('Admin',AdminSchema);

// username  and password provided by passspport 