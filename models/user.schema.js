const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const UserSchema = new mongoose.Schema({
  firstname:{ type: String},
  lastname:{ type: String},
  password: { type: String, required: true },
  email: { type: String},
  telephone: {type: String, required: true,unique: true},
  telephone_inviter:{type: String,},
  roles:[{type: mongoose.Schema.Types.ObjectId,ref:"Role",required:true}],
  service_name:{ type: String},
  service_id:{ type: String},
  approved:{type:Boolean,default:false}
});


const User = mongoose.model('User', UserSchema);

module.exports = User;