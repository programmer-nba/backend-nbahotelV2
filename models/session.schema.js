const mongoose = require('mongoose');

// Define the schema for the Room entity
const sessionsSchema = new mongoose.Schema({
    _id:{type:String, required:true},
    expires:{type:Date,required:true},
    session:{type:String,required:true}

})

const Sessions = mongoose.model('Sessions', sessionsSchema);

module.exports = Sessions;