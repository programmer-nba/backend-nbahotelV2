const mongoose = require('mongoose');
const Joi = require('joi');
const {roomSchema} = require('../models/room.schema');

// Define the schema for the Booking entity
const bookingSchema = new mongoose.Schema({
   member_id:{type:String,require:true},
   hotel_id:{type:String,require:true},
   room_id : {type:String,require:true},
   date_from: { type: Date, required: true },
   date_to: { type: Date, required: true },
   price:{type:Number,required:true},
  status:{
   type: [
     {
       statusbooking: { type: String},
       timestamps: { type: Date }
     }
   ],
   default: [{ statusapprove: 'รออนุมัติห้อง', timestamps: new Date()}]
 },
  payment_id:{type:String},
  payment_type:{type:String}
  },
  {timestamps:true}
  );
  
  const Booking = mongoose.model('Booking', bookingSchema);

  module.exports = Booking;