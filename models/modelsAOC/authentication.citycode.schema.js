const mongoose = require('mongoose');

const cityCodeSchema  = new mongoose.Schema({
    Code:{type:String,require: true},
    Language:{type:String,require: true},
    Name:{type:String},
    CountryCode:{type:String}

});

const CityCode = mongoose.model('CityCode', cityCodeSchema);
module.exports = CityCode;