const mongoose = require('mongoose');

const prePaymentSchema = new mongoose.Schema({

    payment_number:{type:String, required:true,unique:true},
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    hotel_name: { type: String, required:true},
    partner_id: { type: mongoose.Schema.Types.ObjectId,ref: 'Partner', required: true },
    partner_name: { type: String, required:true},
    total_amount: { type: Number, required: true },
    payment_date: { type: String},
    payment_status: { type: String, enum: ['รอดำเนินการ', 'โอนเรียบร้อย'],require:true, default: 'รอดำเนินการ' },
    detail: { type:[{
      booking_id:{type:String},
      ref_number:{type:String},
      check_out_date:{type:Date},
      partner_id:{type:String},
      total:{type:Number}
    }],required: true},
    slip_image:{type:String}
  },
  {timestamps:true}
  );
  
  const PrePayment = mongoose.model('PrePayment', prePaymentSchema);

  module.exports = {PrePayment};