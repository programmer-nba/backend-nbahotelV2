const mongoose = require('mongoose');
const Joi = require('joi');
const {roomSchema} = require('../models/room.schema');

// Define the schema for the Booking entity
const bookingSchema = new mongoose.Schema({
    ref_number: { type: String, required: true,unique: true},
    hotel_id: { type:String, required: true },
    partner_id: { type: String, required: true},
    customer_name: { type:String, required: true },
    customer_tel: { type:String, required: true },
    num_guess: { type: Number},
    rooms: { type:[{
      room:{type:roomSchema, required:true,default:{}},
      amount:{type:Number,required:true},
      room_current_price:{type:Number,required:true},
      room_current_cost:{type:Number,required:true}      
    }], required: true },
    price_per_day: { type: Number, required: true },
    total_day:{type:Number,required: true},
    total_price: { type: Number, required: true },
    total_cost: { type: Number, required: true},
    date_from: { type: Date, required: true },
    date_to: { type: Date, required: true },
    check_in_date: { type: Date},
    check_out_date: { type: Date },
    cutoff_status: { type: Boolean, default: false },
    confirm:{type:String,required:true, enum:['booking','confirmed','cancel'],default:'booking'},
    note:{type:String},
    status:{type:[
      {
        name:{type:String,required:true,enum:['รอโรงแรมรับการจอง','จองแล้ว','เช็คอิน','เช็คเอาท์','โรงแรมปฏิเสธการจอง']},
        date:{type:Date,default:new Date()}
      },
      
    ],required:true,default:[{
      name:'รอโรงแรมรับการจอง',
      date:new Date()
    }]}
  },
  {timestamps:true}
  );
  
  const Booking = mongoose.model('Booking', bookingSchema);

  const validate_Booking = (data)=>{

    const schema = Joi.object({

    hotel_id: Joi.string().required().label('กรุณาระบุ รหัสโรงแรม'),
    partner_id: Joi.string().required().label('ไม่พบ partner id'),
    customer_name: Joi.string().required().label('กรุณากรอก ชื่อลูกค้า'),
    customer_tel: Joi.string().required().label('กรุณากรอก เบอร์โทรลูกค้า'),
    adult:Joi.number().max(100).allow(''),
    rooms: Joi.array().required().label('กรุณาระบุ รายละเอียดห้องพัก'),
    date_check_in: Joi.date().greater('now').raw().required().label('กรุณาระบุวันที่เริ่มต้นเข้าพัก'),
    date_check_out: Joi.date().greater('now').raw().required().label('กรุณาระบุวันสุดท้ายที่ต้องการพัก'),

    });

    return schema.validate(data);
}

const validate_SearchData = (data) => {

  const schema = Joi.object({

    province: Joi.string().required().allow(''),
    district: Joi.string().required().allow(''),
    subdistrict: Joi.string().required().allow(''),
    hotel_name: Joi.string().required().allow(''),
    date_check_in: Joi.date().greater('now').raw().required().label('วันที่เช็คอินไม่ถูกต้อง'),
    date_check_out: Joi.date().greater('now').raw().required().label('วันที่เช็คเอาท์ไม่ถูกต้อง'),
    adult: Joi.number().required().allow(''),
    room_amount: Joi.number().required().allow(''),

  })

  return schema.validate(data);
}

  module.exports = {Booking,validate_Booking,validate_SearchData};