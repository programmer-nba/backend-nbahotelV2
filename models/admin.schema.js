const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const adminSchema = new mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true ,unique: true },
  roles:[{type: mongoose.Schema.Types.ObjectId,ref:"Role"}],
  token:{type:String},
  signature:{type:String}
},
{timestamps:true});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;