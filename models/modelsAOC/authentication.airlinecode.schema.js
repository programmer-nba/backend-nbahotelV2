const mongoose = require('mongoose');

const airlineCodeSchema = new mongoose.Schema({
    imageUrl:{type: String},
    Code:{type:String,require: true},
    Language:{type:String},
    Name: {type:String},
    Nameth: {type:String}
});

const AirlineCode = mongoose.model('AirlineCode', airlineCodeSchema);
module.exports = AirlineCode;