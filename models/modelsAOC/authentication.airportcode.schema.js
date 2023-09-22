const mongoose = require('mongoose');

const airportCodeSchema = new mongoose.Schema({
    Code:{type:String,require: true},
    Language:{type:String,require: true},
    Name:{type:String},
    CountryCode:{type:String}
});

const AirportCode = mongoose.model('AirportCode', airportCodeSchema);
module.exports = AirportCode;