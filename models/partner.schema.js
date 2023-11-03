const mongoose = require('mongoose')
const Joi = require('joi')

// Define the schema for the Booking entity
const partnerSchema = new mongoose.Schema({
  telephone: {type: String, required: true,unique: true},
  password:{type: String , required:true},
  name: {type: String,required:true},
  companyname: {type: String,required: true},
  level:{type:String,required:true}, 
  token: {type: String,required: false,default:''},
  webhook: {type: String,required: false,default:''},
  status:{type:Boolean,default: false},
  approve :{type:String,default:'รออนุมัติ'}
},
  {timestamps: true})
  const Partner = mongoose.model('Partner', partnerSchema)

module.exports = Partner
