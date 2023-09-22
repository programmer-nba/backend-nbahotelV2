const mongoose = require('mongoose')
const Joi = require('joi')

// Define the schema for the Booking entity
const partnerSchema = new mongoose.Schema({
  companyname: {type: String,required: true},
  name: {type: String},
  tel: {type: String,unique: true},
  token: {type: String,required: false,default:''},
  webhook: {type: String,required: false,default:''},
  status:{type:Boolean,required: true,default: false},
},
  {timestamps: true})

const Partner = mongoose.model('Partner', partnerSchema)

module.exports = {Partner}
