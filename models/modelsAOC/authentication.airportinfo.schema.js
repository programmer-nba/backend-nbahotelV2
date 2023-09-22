const mongoose = require('mongoose');

const airportInfoSchema = new mongoose.Schema({
    AirportCode:{type: String},
    CityCode:{type:String},
    Latitude:{type:String},
    Longitude:{type:String},
    CountryCode:{type:String}
})

const AirportInfo = mongoose.model('AirpostInfo', airportInfoSchema);
module.exports = AirportInfo;