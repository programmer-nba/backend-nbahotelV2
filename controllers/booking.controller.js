const { Booking, validate_Booking } = require('../models/booking.schema');
const { Room } = require('../models/room.schema');
const { Hotel } = require('../models/hotel.schema');
const { Partner } = require('../models/partner.schema');

const dayjs = require('dayjs');
const CreateTask = require('../functions/task');
const ValidateDate = require('../functions/datemangement')
const jwt = require('jsonwebtoken');

module.exports.GetAll = async (req, res) => {
    try {
        const booking = await Booking.find({ $and: [{ confirm: 'confirmed' }] }, { _id: 1, createdAt: 1, ref_number: 1, hotel_id: 1, customer_name: 1, date_from: 1, date_to: 1, total_price: 1, cutoff_status: 1, status: 1 });
        const hotel = await Hotel.find({}, { _id: 1, name: 1 });
        if (!hotel) {
            return res.status(404).send({ message: 'Hotel not found' });
        }

        if (booking) {
            const data = booking.map(el => ({
                booking_id: el._id,
                date: el.createdAt,
                ref_number: el.ref_number,
                hotel_id: el.hotel_id,
                hotel_name: (hotel.find(hotel => hotel._id == el.hotel_id).name),
                customer_name: el.customer_name,
                check_in_date: el.date_from,
                check_out_date: el.date_to,
                total_price: el.total_price,
                cutoff_status: el.cutoff_status,
                status: el.status
            }))
            return res.status(200).send(data);
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

//get booking by range
module.exports.getBookingByRange = async (req, res) => {
    const id = req.params.id;
    try {
        var booking = await Booking.find({
            $and: [
                { hotel_id: id },
                { confirm: 'confirmed' },
                {
                    $or: [
                        {
                            $and: [

                                { date_from: { $gte: new Date(req.body.date_check_in) } },
                                { date_to: { $lte: new Date(req.body.date_check_out) } }
                            ]
                        },
                        {
                            $and: [

                                { date_from: { $lte: new Date(req.body.date_check_in) } },
                                { date_to: { $gt: new Date(req.body.date_check_in) } }
                            ]
                        },
                        {
                            $and: [

                                { date_from: { $gte: new Date(req.body.date_check_in) } },
                                { date_to: { $lte: new Date(req.body.date_check_out) } }
                            ]
                        }
                    ]
                },

            ]
        });

        if (!booking) {
            return res.status(404).send({ message: 'booking not found' });
        }

        const collection = []

        for (let book of booking) {

            for (let item of book.rooms) {


                collection.push({
                    id: book._id,
                    room_id: item.room._id.toString(),
                    amount: item.amount,
                })

            }
        }

        //count
        const quota = {}

        for (let i of collection) {
            quota[i.room_id] = collection.filter(el => el.room_id == i.room_id).reduce((total, item) => total + item.amount, 0);
        }


        return res.status(200).send(quota);

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

//get Booking by hotel id
module.exports.getBookingByHotelId = async (req, res) => {
    try {

        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(400).send({ message: 'id โรงแรมไม่ถูกต้อง' });
        }

        const booking = await Booking.find({
            $and: [
                { hotel_id: req.params.id },
                { confirm: 'confirmed' },
            ]

        });

        if (booking) {
            const data = booking.map(el => ({
                hotel: hotel.name,
                booking_id: el._id,
                date: el.createdAt,
                ref_number: el.ref_number,
                customer_name: el.customer_name,
                check_in_date: el.date_from,
                check_out_date: el.date_to,
                total_price: el.total_price,
                total_cost: el.total_cost,
                cutoff_status: el.cutoff_status,
                status: el.status
            }))
            return res.status(200).send(data);
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

//get Booking by id

module.exports.getBookingById = async (req, res) => {

    try {
        const booking = await Booking.findOne({
            $and: [
                { _id: req.params.bookingId },
                { hotel_id: req.params.id }
            ]
        });
        if (booking) {
            return res.status(200).send(booking);
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

//update change booking date
module.exports.Update = async (req, res) => {
    const id = req.params.id;
    try {
        const data = {
            date_from: req.body.date_from,
            date_to: req.body.date_to,
        }

        const booking = await Booking.findOne({ _id: id });
        if (!booking) {
            return res.status(404).send({ message: 'booking not found' });
        };
        const edit = await Booking.findOneAndUpdate({ _id: id }, data, { returnOriginal: false })
        return res.send(edit)
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}



//accept booking
module.exports.Accept = async (req, res) => {

    const id = req.params.bookingId;

    try {

        const booking = await Booking.findById(id);
        const hotel = await Hotel.findById(booking.hotel_id);

        if (!booking) {
            return res.status(404).send({ message: 'Booking not found' });
        }

        const updatedata = booking.status;

        if (updatedata[updatedata.length - 1].name !== 'รอโรงแรมรับการจอง') {
            return res.status(400).send({ message: 'This booking is already accepting' });
        }

        updatedata.push({
            name: req.body.statusname,
            date: new Date()
        })

        const edit = await Booking.findByIdAndUpdate(id, { status: updatedata }, { returnOriginal: false })

        //send message ส่งข้อความไปยืนยัน
        var axios = require('axios');
        var config = {
            method: 'post',
            url: 'https://portal-otp.smsmkt.com/api/send-message',
            headers: {
                "Content-Type": "application/json",
                "api_key": process.env.MESSAGE_API_KEY,
                "secret_key": process.env.MESSAGE_API_SECRET,
            },
            data: JSON.stringify({
                "message": `
                        ทางโรงแรม ${hotel.name} ได้ทำการตอบรับการจอง
                        รหัสการจองของท่านคือ : ${booking.ref_number}
                        เบอร์โทรศัทพ์ของท่าน : ${booking.customer_tel}
                        กรุณาแสดงข้อมูลการจองของท่านต่อเจ้าหน้าที่เมื่อเข้าเช็คอิน`,
                "phone": booking.customer_tel,
                "sender": "NBAService",
            })
        };
        await axios(config).then(function (response) {
            console.log(JSON.stringify(response.data));
        }).catch(function (error) {
            console.log(error);
        })
        //ใส่ค่าให้พาร์ทเนอร์
        const partner = await Partner.findById(booking.partner_id)
        const url = partner.webhook
        const data = {
            ref_number: booking.ref_number,
            status:'accepted',
            message:'โรงแรมรับการจอง'
        }
        await axios.post(url,data).then((res)=>{}).catch(err =>{
            console.log(err);
        })
        return res.status(200).send(accepted)
                 
            

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}


//rejected
module.exports.Reject = async (req, res, next) => {
    const booking_id = req.params.bookingId; //booking id

    try {
        if (!req.body.reason) {
            return res.status(400).send({ message: 'please send reject reason request' });
        }
        const current_booking = await Booking.findById(booking_id);
        if (!current_booking) {
            return res.status(404).send({ message: 'not found this booking id' });
        }

        //update booking collection
        let status = current_booking.status;

        if (status[status.length - 1].name !== 'รอโรงแรมรับการจอง') {
            return res.status(400).send({ message: 'This booking is already accepting' });
        }

        status.push({
            name: 'โรงแรมปฏิเสธการจอง',
            date: new Date()
        })

        await Booking.findOneAndUpdate({ _id: booking_id }, { status: status, note: req.body.reason }, { returnDocument: 'after' })
        // callback  ส่งข้อความ
        var axios = require('axios');
        const partner = await Partner.findById(current_booking.partner_id);

        if (!partner) {
            return res.status(400).send({ message: 'Partner not found' });
        }
        const url = partner.webhook;
        const data = {
            ref_number: result.ref_number,
            status: 'rejected',
            message: `โรงแรมปฏิเสธการจอง เนื่องจาก ${req.body.reason}`
        }
        await axios.post(url, data).then((res) => { }).catch(err => {
        console.log(err);
        })
        //end callback
        return res.status(200).send({
            _id: result._id,
            message: 'rejected successfully'
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

