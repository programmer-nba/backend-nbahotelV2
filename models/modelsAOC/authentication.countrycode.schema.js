const mongoose = require('mongoose');

const countryCodeSchema  = new mongoose.Schema({
    Code:{type:String,require: true},
    Language:{type:String,require: true},
    Name:{type:String},
    Alpha3:{type:String}

});

const CountryCode = mongoose.model('CountryCode', countryCodeSchema);
module.exports = CountryCode;