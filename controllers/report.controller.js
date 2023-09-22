const {Booking} = require('../models/booking.schema');
const dayjs = require('dayjs');
//get all report
module.exports.GetAll =  async (req,res) =>{
    const hotel_id = req.params.id

    try {

        const projection = {

            _id:1,
            customer_name:1,
            createdAt:1,
            date_from:1,
            date_to:1,
            total_price:1,
            total_cost:1,
            status:1,  
        }
        
        const booking = await Booking.find({

            $and:[
                {hotel_id:hotel_id},
                {confirm:'confirmed'}
            ]
            
        },projection);

   
        const last7days = booking.filter(el=>dayjs(el.createdAt).isAfter(Date.now()-7*24*60*60*1000))
   

        const this_year = booking.filter(el=>dayjs(el.date_to).format('YYYY') === dayjs(Date.now()).format('YYYY'));
        const next_year = booking.filter(el=>dayjs(el.date_to).format('YYYY') === dayjs(Date.now()).add(1,'y').format('YYYY'));
        const last_year = booking.filter(el=>dayjs(el.date_to).format('YYYY') === dayjs(Date.now()).add(2,'y').format('YYYY'));


        var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


        const count = []
        const count_next =[]
        const count_last = []

        for (month of mL){
      

          count.push(this_year.filter(el=> mL[new Date(el.date_to).getMonth()]===month ).length)

          count_next.push(next_year.filter(el=> mL[new Date(el.date_to).getMonth()]===month ).length)

          count_last.push(last_year.filter(el=> mL[new Date(el.date_to).getMonth()]===month ).length)

        }

        //count last 7 day booking
        const count_last_7day = [];

        const now = new Date();
        const today = now;

        for(let date=6; date>=0 ;date--){
            const i= new Date(today.getFullYear(), today.getMonth(), today.getDate()-date);
            count_last_7day.push({
                count:last7days.filter(el=> dayjs(el.createdAt).format('DD/MM/YYYY')===dayjs(i).format("DD/MM/YYYY")).length,
                i:i,
                now:new Date().toISOString(),
                day:new Date(i.getTime()),
                income:booking.filter(el=> 
                    dayjs(el.date_to).format('DD/MM/YYYY')===dayjs(i).format("DD/MM/YYYY")
                    && el.status[el.status.length-1].name==='เช็คเอาท์').reduce((total,item)=>total+item.total_cost,0),
                checkin:last7days.filter(el=>
                    dayjs(el.date_from).format('DD/MM/YYYY')===dayjs(i).format("DD/MM/YYYY")).length,
            })
        }

        res.status(200).send({year:count,next_year:count_next,last_year:count_last,last7day:count_last_7day,new_booking:booking});

        
    } catch (error) {
        return res.status(500).send(error.message);
    }

}