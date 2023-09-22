const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
    user_id:{type:String, required:true},
    hotel_id:{ type:String, required:true},
})

const Host = mongoose.model('Host',hostSchema);

module.exports = Host;
