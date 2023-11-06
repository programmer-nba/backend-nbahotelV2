const mongoose = require('mongoose');
const Joi = require('joi');
const {roomSchema} = require('../models/room.schema');

// Define the schema for the Booking entity
const bookingSchema = new mongoose.Schema({
   member_id:{type:String,require:true},
   hotel_id:{type:String,require:true},
   booking_date:{type:Date,require:true},
  status:[],
  payment_id:{type:Date,require:true}
  },
  {timestamps:true}
  );
  
  const Booking = mongoose.model('Booking', bookingSchema);

  module.exports = Booking;