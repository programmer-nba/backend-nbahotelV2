const Booking  = require('../models/booking.schema');
const { Room } = require('../models/room.schema');
const { Hotel } = require('../models/hotel.schema');
const { Partner } = require('../models/partner.schema')
const Member = require('../models/member.schema')
const Payment = require('../models/prepayment.schema')

const dayjs = require('dayjs');
const CreateTask = require('../functions/task');
const ValidateDate = require('../functions/datemangement')
const jwt = require('jsonwebtoken');



// //get booking by range
// module.exports.getBookingByRange = async (req, res) => {
//     const id = req.params.id;
//     try {
//         var booking = await Booking.find({
//             $and: [
//                 { hotel_id: id },
//                 { confirm: 'confirmed' },
//                 {
//                     $or: [
//                         {
//                             $and: [

//                                 { date_from: { $gte: new Date(req.body.date_check_in) } },
//                                 { date_to: { $lte: new Date(req.body.date_check_out) } }
//                             ]
//                         },
//                         {
//                             $and: [

//                                 { date_from: { $lte: new Date(req.body.date_check_in) } },
//                                 { date_to: { $gt: new Date(req.body.date_check_in) } }
//                             ]
//                         },
//                         {
//                             $and: [

//                                 { date_from: { $gte: new Date(req.body.date_check_in) } },
//                                 { date_to: { $lte: new Date(req.body.date_check_out) } }
//                             ]
//                         }
//                     ]
//                 },

//             ]
//         });

//         if (!booking) {
//             return res.status(404).send({ message: 'booking not found' });
//         }

//         const collection = []

//         for (let book of booking) {

//             for (let item of book.rooms) {


//                 collection.push({
//                     id: book._id,
//                     room_id: item.room._id.toString(),
//                     amount: item.amount,
//                 })

//             }
//         }

//         //count
//         const quota = {}

//         for (let i of collection) {
//             quota[i.room_id] = collection.filter(el => el.room_id == i.room_id).reduce((total, item) => total + item.amount, 0);
//         }


//         return res.status(200).send(quota);

//     } catch (error) {
//         return res.status(500).send({ message: error.message });
//     }
// }

// //get Booking by hotel id
// module.exports.getBookingByHotelId = async (req, res) => {
//     try {

//         const hotel = await Hotel.findById(req.params.id);
//         if (!hotel) {
//             return res.status(400).send({ message: 'id โรงแรมไม่ถูกต้อง' });
//         }

//         const booking = await Booking.find({
//             $and: [
//                 { hotel_id: req.params.id },
//                 { confirm: 'confirmed' },
//             ]

//         });

//         if (booking) {
//             const data = booking.map(el => ({
//                 hotel: hotel.name,
//                 booking_id: el._id,
//                 date: el.createdAt,
//                 ref_number: el.ref_number,
//                 customer_name: el.customer_name,
//                 check_in_date: el.date_from,
//                 check_out_date: el.date_to,
//                 total_price: el.total_price,
//                 total_cost: el.total_cost,
//                 cutoff_status: el.cutoff_status,
//                 status: el.status
//             }))
//             return res.status(200).send(data);
//         }
//     } catch (error) {
//         return res.status(500).send({ message: error.message });
//     }
// }

// //get Booking by id

// module.exports.getBookingById = async (req, res) => {

//     try {
//         const booking = await Booking.findOne({
//             $and: [
//                 { _id: req.params.bookingId },
//                 { hotel_id: req.params.id }
//             ]
//         });
//         if (booking) {
//             return res.status(200).send(booking);
//         }
//     } catch (error) {
//         return res.status(500).send({ message: error.message });
//     }
// }

// //update change booking date
// module.exports.Update = async (req, res) => {
//     const id = req.params.id;
//     try {
//         const data = {
//             date_from: req.body.date_from,
//             date_to: req.body.date_to,
//         }

//         const booking = await Booking.findOne({ _id: id });
//         if (!booking) {
//             return res.status(404).send({ message: 'booking not found' });
//         };
//         const edit = await Booking.findOneAndUpdate({ _id: id }, data, { returnOriginal: false })
//         return res.send(edit)
//     } catch (error) {
//         return res.status(500).send({ message: error.message });
//     }
// }



// //accept booking
// module.exports.Accept = async (req, res) => {

//     const id = req.params.bookingId;

//     try {

//         const booking = await Booking.findById(id);
//         const hotel = await Hotel.findById(booking.hotel_id);

//         if (!booking) {
//             return res.status(404).send({ message: 'Booking not found' });
//         }

//         const updatedata = booking.status;

//         if (updatedata[updatedata.length - 1].name !== 'รอโรงแรมรับการจอง') {
//             return res.status(400).send({ message: 'This booking is already accepting' });
//         }

//         updatedata.push({
//             name: req.body.statusname,
//             date: new Date()
//         })

//         const edit = await Booking.findByIdAndUpdate(id, { status: updatedata }, { returnOriginal: false })

//         //send message ส่งข้อความไปยืนยัน
//         var axios = require('axios');
//         var config = {
//             method: 'post',
//             url: 'https://portal-otp.smsmkt.com/api/send-message',
//             headers: {
//                 "Content-Type": "application/json",
//                 "api_key": process.env.MESSAGE_API_KEY,
//                 "secret_key": process.env.MESSAGE_API_SECRET,
//             },
//             data: JSON.stringify({
//                 "message": `
//                         ทางโรงแรม ${hotel.name} ได้ทำการตอบรับการจอง
//                         รหัสการจองของท่านคือ : ${booking.ref_number}
//                         เบอร์โทรศัทพ์ของท่าน : ${booking.customer_tel}
//                         กรุณาแสดงข้อมูลการจองของท่านต่อเจ้าหน้าที่เมื่อเข้าเช็คอิน`,
//                 "phone": booking.customer_tel,
//                 "sender": "NBAService",
//             })
//         };
//         await axios(config).then(function (response) {
//             console.log(JSON.stringify(response.data));
//         }).catch(function (error) {
//             console.log(error);
//         })
//         //ใส่ค่าให้พาร์ทเนอร์
//         const partner = await Partner.findById(booking.partner_id)
//         const url = partner.webhook
//         const data = {
//             ref_number: booking.ref_number,
//             status:'accepted',
//             message:'โรงแรมรับการจอง'
//         }
//         await axios.post(url,data).then((res)=>{}).catch(err =>{
//             console.log(err);
//         })
//         return res.status(200).send(accepted)
                 
            

//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ message: error.message });
//     }
// }


// //rejected
// module.exports.Reject = async (req, res, next) => {
//     const booking_id = req.params.bookingId; //booking id

//     try {
//         if (!req.body.reason) {
//             return res.status(400).send({ message: 'please send reject reason request' });
//         }
//         const current_booking = await Booking.findById(booking_id);
//         if (!current_booking) {
//             return res.status(404).send({ message: 'not found this booking id' });
//         }

//         //update booking collection
//         let status = current_booking.status;

//         if (status[status.length - 1].name !== 'รอโรงแรมรับการจอง') {
//             return res.status(400).send({ message: 'This booking is already accepting' });
//         }

//         status.push({
//             name: 'โรงแรมปฏิเสธการจอง',
//             date: new Date()
//         })

//         await Booking.findOneAndUpdate({ _id: booking_id }, { status: status, note: req.body.reason }, { returnDocument: 'after' })
//         // callback  ส่งข้อความ
//         var axios = require('axios');
//         const partner = await Partner.findById(current_booking.partner_id);

//         if (!partner) {
//             return res.status(400).send({ message: 'Partner not found' });
//         }
//         const url = partner.webhook;
//         const data = {
//             ref_number: result.ref_number,
//             status: 'rejected',
//             message: `โรงแรมปฏิเสธการจอง เนื่องจาก ${req.body.reason}`
//         }
//         await axios.post(url, data).then((res) => { }).catch(err => {
//         console.log(err);
//         })
//         //end callback
//         return res.status(200).send({
//             _id: result._id,
//             message: 'rejected successfully'
//         });
//     } catch (error) {
//         return res.status(500).send({ message: error.message });
//     }
// }

//สร้างข้อมูลการจอง
module.exports.addbooking = async(req,res)=>{
    try{
        const member_id = req.body.member_id
        const hotel_id = req.body.hotel_id
        const room_id = req.body.room_id
        const date_from = req.body.date_from
        const date_to = req.body.date_to
        const price = req.body.price
        //เช็คว่ารับค่ามาหรือเปล่า
        if(!member_id||!hotel_id||!room_id||!date_from||!date_to||!price){
            res.status(400).send({message:'กรุณากรอกข้อมูลให้ครบ'})
        }
        //เช็คว่ามีข้อมูลใน member hotel room data หรือเปล่า
        const member = await Member.findOne({id:member_id})
        if(!member){
            res.status(400).send({message:'หาข้อมูล member ไม่เจอ'})
        }
        const hotel = await Hotel.findOne({id:member_id})
        if(!hotel){
            res.status(400).send({message:'หาข้อมูล hotel ไม่เจอ'})
        }
        const room = await Room.findOne({id:room_id})
        if(!room){
            res.status(400).send({message:'หาข้อมูล room ไม่เจอ'})
        }
        const booking = new Booking({
            member_id: member_id,
            hotel_id : hotel_id,
            room_id: room_id,
            date_from:date_from,
            date_to:date_to,
            price:price
        })
        const add = await booking.save()
        res.status(200).send(add)

    }catch(error){
        res.status(500).send({message:error.message})
    }
}

//เรียกข้อมูลทั้งหมด
module.exports.GetAll = async (req, res) => {
    try {
        const booking = await Booking.find();
        return res.status(200).send(booking);
        
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
//เรียกข้อมูลการจองตาม id
module.exports.GetByid = async (req, res) => {
    try {
        const id = req.params.id
        const booking = await Booking.find({id:id});
        return res.status(200).send(booking);
        
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

//เรียกข้อมูลการจองตาม hotel_id
module.exports.GetByhotel = async (req, res) => {
    try {
        const hotel_id = req.params.id
        const booking = await Booking.find({hotel_id:hotel_id});
        return res.status(200).send(booking);
        
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
//เรียกข้อมูลการจองตาม room_id
module.exports.GetByroom = async (req, res) => {
    try {
        const room_id = req.params.id
        const booking = await Booking.find({room_id:room_id})
        return res.status(200).send(booking);
        
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}
//เรียกข้อมูลการจองตาม member
module.exports.GetBymember = async (req, res) => {
    try {
        const member_id = req.params.id
        const booking = await Booking.find({member_id:member_id})
        return res.status(200).send(booking);
        
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

//partner อนุมัติการจองห้อง
module.exports.AcceptBooking = async (req,res) =>{
    try{
        const id = req.params.id
        const newStatus = {
            statusbooking: 'รอชำระเงิน',
            timestamps: new Date()
          };
        const edit = await Booking.findByIdAndUpdate({_id:id},{$push:{status:newStatus}},{new:true})
        if(!edit){
            return res.status(404).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล Booking"})
        }
        return res.status(200).send({status:true,message:`ข้อมูล ${edit.id} ได้รับการอนุมัติแล้ว รอการชำระเงิน`,update:edit})
    }catch (error){
        return res.status(500).send({message: error.message})
    }
    
}

