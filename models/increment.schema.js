const mongoose = require('mongoose');

// Define the schema for the Hotel entity
const incrementSchema = new mongoose.Schema({
    inc:{type:Number},
    name:{type:String}
   
});

const Increment = mongoose.model('Increment', incrementSchema);

module.exports = Increment;