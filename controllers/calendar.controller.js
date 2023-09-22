const {Booking }= require('../models/booking.schema');
const {Room} = require('../models/room.schema');

module.exports.getBookingDetails = async (req,res) =>{
    try {

        const pipeline =[
            {
                "$unwind":{
                    path:"$rooms"
                }
            },
            {
                "$match":{"$and":[
                    {"hotel_id":req.params.id}
                ]}
            },
            {
                "$group":{
                    "_id":"$rooms.room.type.name_th",
                    
                    "booking_on":{"$push":{date_check_in:"$date_from",date_check_out:"$date_to"}},
                    
                    
                }
            },
            {
                "$sort":{"_id":1}
            }
           
           
        ]

        const calendar = await Booking.aggregate(pipeline);

        const rooms = await Room.find({hotel_id:req.params.id},{type:1,quota:1});

        console.log(rooms);

        const quota_collection = [];
        const selected_year = parseInt(req.query.year,10);
        const selected_month = parseInt(req.query.month,10);
        const now = new Date(selected_year,selected_month,1);
   
        const last_date_of_month = new Date(selected_year,selected_month+1,0).getDate();

        for( id of calendar){

            const collection = [];
            for(let i=1; i<=last_date_of_month;i++){
                const currentdate = new Date(now.getFullYear(),now.getMonth(),i);
                const container = {
                    date:currentdate,
                    // quota:rooms.find(el=>el.type.name_th === id._id).quota,
                    // used_quota:id.booking_on.filter(el=> currentdate>=new Date(el.date_check_in) && currentdate<new Date(el.date_check_out)).length,
                    remainding_quota:(rooms.find(el=>el.type.name_th === id._id).quota-id.booking_on.filter(el=> currentdate>=new Date(el.date_check_in) && currentdate<new Date(el.date_check_out)).length)
                };
                collection.push(container);
            }
            quota_collection.push({id:id._id,collection});
        }

        return res.status(200).send(quota_collection)
        
    } catch (error) {

        console.error(error.message);
        return res.status(500).send(error.message)
    }
    

    
}