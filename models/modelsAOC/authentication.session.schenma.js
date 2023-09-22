const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const authSessionSchema = new mongoose.Schema({
    tokenname:{type:String,unique: true},
    accessToken:{type:String,require:true},
    tokenType: {type:String,require:true},
    expires: {type:String,require:true},
    isError: {type:Boolean,require:true},

},
{timestamps:true});

const AuthSessionSchema = mongoose.model('AuthSessionSchema', authSessionSchema);

module.exports = {AuthSessionSchema};