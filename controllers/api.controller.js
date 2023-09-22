const {Room} = require('../models/room.schema');
const {Booking ,validate_Booking,validate_SearchData} = require('../models/booking.schema');
const {Hotel} = require('../models/hotel.schema');
const dayjs = require('dayjs');
const CreateTask = require('../functions/task');
const checkQuota = require('../functions/checkquota');

const jwt = require('jsonwebtoken');

 //search hotel for partner api
 module.exports.Search = async (req,res) => {

    try {

        console.log(new Date(req.body.date_check_out).toLocaleDateString('th-TH'));

    const {error} = validate_SearchData({...req.body});

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
        
    const searchResult = [];

    const page=req.query.page;
    let limit = 200;
    limit = req.query.limit?req.query.limit:limit;

    if(limit>200 || limit <0){
        limit = 200;
    }

    let data = null;
    const hotels = await Hotel.find({},{host_id:0,phone_number:0,approved:0} ).skip(page).limit(limit);

    if(!hotels){
        return res.status(404).send({message:`hotel not found`});
    }

    data = hotels;
    if(req.body.province){
       data = data.filter(el=>el.province === req.body.province);
    }
    if(req.body.district){
        data = hotels.filter(el=>el.amphure === req.body.district)
    }

    if(req.body.subdistrict){
        data = hotels.filter(el=>el.tambon === req.body.subdistrict);
    }

    if(req.body.hotel_name){
        data = hotels.filter(el=>el.name.includes(req.body.hotel_name) );
    }

    for(let hotel of data) {
        const init_room = await Room.find({hotel_id:hotel._id},{cost:0,hotel_id:0,approved:0});
        const room = init_room.filter(el=>el.status.name === 'เปิดรับจอง')
        const booking = await Booking.find({
            $and:[
                {hotel_id:hotel._id},
                {confirm:'confirmed'},
                {
                    $or:[
                        {
                        $and:[

                            {date_from:{$gte:new Date(req.body.date_check_in)}},
                            {date_to:{$lte:new Date(req.body.date_check_out)}}
                        ]
                    },
                    {
                        $and:[

                            {date_from:{$lte:new Date(req.body.date_check_in)}},
                            {date_to:{$gt:new Date(req.body.date_check_in)}}
                        ] 
                    },
                    {
                        $and:[

                            {date_from:{$gte:new Date(req.body.date_check_in)}},
                            {date_to:{$lte:new Date(req.body.date_check_out)}}
                        ] 
                    }
                    ]
                },

        ]
            
        },
      
        );


        const collection = [];

        for(let book of booking){
          
          for(let item of book.rooms){
          
            collection.push({
                id:book._id,
                room_id:item.room._id.toString(),
                amount:item.amount,
            })
          }
        }

        //count
        const quota={}

        for(let i of collection){
            quota[i.room_id]=collection.filter(el=>el.room_id == i.room_id).reduce((total,item)=>total+item.amount,0);
        }

        if(room){

       
            
            const roomfilter = room.filter(el=>
                (
          
                (el.quota - (quota[el._id]?quota[el._id]:0))>0 
                && (el.quota - (quota[el._id]?quota[el._id]:0))>=(Math.ceil(req.body.adult/el.max_person).toFixed(0)) 
                && ((el.quota - (quota[el._id]?quota[el._id]:0))>= req.body.room_amount && req.body.room_amount*el.max_person >= req.body.adult)

                )
        
                )

                const response = []

                for(let r of roomfilter){
                   
                    const room = {};
                    
                    room['remainding_quota']=(r.quota - (quota[r._id]?quota[r._id]:0))
                    room['detail'] = r;
                  
                    response.push(room);
                }
          
                if(response.length>0){
                    
                const container = { hotel:hotel,room:response}
                searchResult.push(container);
            }
        }
    }

 
    if(searchResult.length>0){
       return res.status(200).send({status:true,data:searchResult});
    }else{
        return res.status(400).send({status:false,data:'No room match your condition!'})
    }

    

} catch (error) {
        return res.status(500).send(error.message);
}
}

//create Booking by quota
module.exports.CreateBooking = async (req,res) => {
    
    try {
        const token = req.headers['token'];
        const decoded = jwt.verify(token,process.env.SECRET_KEY);

        const req_body= {
            ...req.body,
            partner_id:decoded.partner_id
        }
 

        const {error} = validate_Booking(req_body);
            
        if(error){
        
            return res.status(400).send(error.details[0].message);
        }


        const id = req.body.hotel_id;

        
        const checkin = new Date(dayjs(req.body.date_check_in).format('YYYY-MM-DD'));
        const checkout = new Date(dayjs(req.body.date_check_out).format('YYYY-MM-DD'));

    

        if(checkin < new Date()){
            return res.status(400).send({message:"จองก่อนวันปัจจุบัน"})
        }
        else if(checkin >= checkout){
       
            return res.status(400).send({message:'กำหนดวันเช็คเอาท์ก่อนวันเช็คอิน'})
        }
        
        //check valid room in hotel

        const currentbooking = await Booking.find({
            $and:[
                {hotel_id:id},
                {confirm:'confirmed'},
                {
                    $or:[
                        {
                        $and:[

                            {date_from:{$gte:checkin}},
                            {date_to:{$lte:checkout}}
                        ]
                    },
                    {
                        $and:[

                            {date_from:{$lte:checkin}},
                            {date_to:{$gt:checkin}}
                        ] 
                    },
                    {
                        $and:[

                            {date_from:{$gte:checkin}},
                            {date_to:{$lte:checkout}}
                        ] 
                    }
                    ]
                },

            ]
        });
        
   
        const collection = [];

        for(let book of currentbooking){
          
          for(let item of book.rooms){
          
            collection.push({
                id:book._id,
                room_id:item.room._id.toString(),
                amount:item.amount,
            })
          }
        }

        //count
        const quota={}

        for(let i of collection){
            quota[i.room_id]=collection.filter(el=>el.room_id == i.room_id).reduce((total,item)=>total+item.amount,0);
        }
        
        const hotelroom = await Room.find({hotel_id:req.body.hotel_id});
        const count = await Booking.aggregate([{ $group: { _id: 0, count: { $sum: 1 } } }]);

   if(hotelroom.length <=0){
    return res.status(400).send({message:'ไม่พบห้อง'});
   }

   const bookingRoom = [];

   for(let i of req.body.rooms){
 
    const container = hotelroom.find(el=>el._id==i.room_id);

    // console.log(container);

    if(!container){
        return res.status(400).send({message:'ไม่พบห้อง',data:`ไม่มีห้อง id ${i.room_id}`})
    }

    console.log('quota',container.quota,' quota check ',quota[i.room_id]+i.amount)

    if( (quota[i.room_id]+i.amount)>container.quota || i.amount<=0 ){
        console.log('quota exceeded');
      return res.status(200).send({code:'001',message:'เกินโควต้า',data:`ห้อง id ${i.room_id} เกินโควต้า`});
    }
    else{

        bookingRoom.push({room:container,amount:i.amount,room_current_price:container.price,room_current_cost:container.cost});
    }
    
   }

   console.log('test')
   const price_per_day = bookingRoom.reduce(
    (accumulator, currentValue) => accumulator + currentValue.room_current_price*currentValue.amount, 0
  );

  const cost_per_day = bookingRoom.reduce(
    (accumulator, currentValue) => accumulator + currentValue.room_current_cost*currentValue.amount, 0
  );

   //total night
   async function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());
  
    const dates = [];
  
    while (date < endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
  
    return dates.length;
  }
  const total_day = await getDatesInRange(new Date(req.body.date_check_in), new Date(req.body.date_check_out))
   const total_price = total_day*price_per_day;
   const total_cost = total_day*cost_per_day;

   var initnumber=null;
  
   if(count.length>0){

       initnumber =count[0].count
   }
   else{
        initnumber = 0;
   }

    const ref = `B${dayjs(Date.now()).format('YYMMDD')}${initnumber.toString().padStart(5,'0')}`;

    const bookingData = {
        ref_number: ref,
        hotel_id: req.body.hotel_id,
        partner_id:decoded.partner_id,
        customer_name: req.body.customer_name,
        customer_tel: req.body.customer_tel,
        num_guess: req.body.adult,
        rooms: bookingRoom,
        price_per_day: price_per_day,
        total_day:total_day,
        total_price: total_price,
        total_cost:total_cost,
        date_from: checkin,
        date_to: checkout,
        payment_plan:req.body.payment_plan,
        payment_method:req.body.payment_method,
        payment_reference_number:req.body.payment_reference_number,
    }

    const booking = new Booking(bookingData);
    booking.save((err,booking)=>{
        if(err){
            return res.status(400).send({message:'บันทึกไม่สำเร็จ'});
        }

        //create task for booking
        CreateTask({
            title:'ใบจองใหม่',
            subtitle:`${req.body.customer_name} ได้ทำการจองห้องของคุณ`,
            description:``,
            hotel_id:req.body.hotel_id,

        })
        return res.status(202).send({ref_number:booking.ref_number,total:booking.total_price});
    })

} catch (error) {
      return res.status(500).send(error.message);  
}
}



//confirm booking

module.exports.ConfirmBooking = async (req,res) => {
    try {

        const token = req.headers['token'];

        const decoded = jwt.verify(token,process.env.SECRET_KEY);


        if(!decoded.partner_id){
            return res.status(403).send({message:'หมายเลขพาร์ทเนอร์ไม่ถูกต้อง'})
        }

        if(!req.body.ref_number){
            return res.status(400).send({message:'ref_number ไม่ถูกต้อง'})
        }

        const booking = await Booking.findOne({
            $and:[
                {ref_number:req.body.ref_number},
                {partner_id:decoded.partner_id}
            ]
            },{confirm:1,_id:1,});

        if(!booking){
            return res.status(400).send({message:'ไม่มี booking ตาม ref_number'});
        }

        if(booking.confirm==='confirmed'){
            return res.status(400).send({message:'Booking นี้ได้รับการยืนยันแล้ว'});
        }

        const updateResult = await Booking.findByIdAndUpdate(booking._id,{confirm:'confirmed'},{returnDocument:'after'});
        if(!updateResult){
            return res.status(400).send({message:'อัพเดทไม่สำเร็ํจ กรุณาลองใหม่อีกครั้ง'});
        }
        return res.status(200).send({message:'Confirm Booking สำเร็จ',data:`Booking ${updateResult.ref_number} ได้เปลี่ยนสถาณะ เป็น ${updateResult.confirm}`});
        
    } catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}

//cancel booking
module.exports.CancelBooking = async (req,res) => {
    try {

        const token = req.headers['token'];

        const decoded = jwt.verify(token,process.env.SECRET_KEY);


        if(!decoded.partner_id){
            return res.status(403).send({message:'หมายเลขพาร์ทเนอร์ไม่ถูกต้อง'})
        }

        if(!req.body.ref_number){
            return res.status(400).send({message:'ไม่ได้ส่ง ref_number'})
        }

        const booking = await Booking.findOne({
            $and:[
                {ref_number:req.body.ref_number},
                {partner_id:decoded.partner_id}
            ]
            },{_id:1,ref_number:1,confirm:1,status:1,date_from:1});

        if(!booking){
            return res.status(400).send({message:'ไม่มี booking ตาม ref_number'});
        }

        if(booking.confirm !=='confirmed'){
            return res.status(400).send({message:'Booking นี้ยังไม่ได้รับการยืนยัน'});
        }

        if(booking.status[booking.status.length - 1].name !== 'จองแล้ว'){
            return res.status(400).send({message:'โรงแรมยังไม่ได้ตอบรับการจอง'})
        }

        const now = new Date();
        const checkin = new Date(booking.date_from);

        if(new Date(now.getFullYear(),now.getMonth(),now.getDate()+3) >= new Date(checkin.getFullYear(),checkin.getMonth(),checkin.getDate())){

            return res.status(400).send({message:'ไม่สามารถยกเลิกใบจองได้เนื่องจากเกินเวลาที่กำหนด'})
        }

        const updateResult = await Booking.findByIdAndUpdate(booking._id,{confirm:'cancel'},{returnDocument:'after'});
        if(!updateResult){
            return res.status(400).send({message:'อัพเดทไม่สำเร็ํจ กรุณาลองใหม่อีกครั้ง'});
        }
        return res.status(200).send({message:'Cancel Booking สำเร็จ',data:`Booking ${updateResult.ref_number} ได้เปลี่ยนสถาณะ เป็น ${updateResult.confirm}`});

        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error.message);
    }
}


//change checkin date
module.exports.ChangeCheckinDate = async (req,res) =>{

    try {
        
        const now = new Date();
        const new_date_check_in = new Date(req.body.date_check_in);

        if(new Date(new_date_check_in.getFullYear(),new_date_check_in.getMonth(),new_date_check_in.getDate())<= new Date(now.getFullYear(),now.getMonth(),now.getDate())){

            return res.status(400).send({message:'ไม่สามารถเปลี่ยนวันเช็คอินก่อนวันปัจุบัน'})

        }
        
        //get current booking
        const current_booking = await Booking.findOne({ref_number:req.body.ref_number},{hotel_id:1,date_from:1,date_to:1,total_day:1,rooms:1,status:1});

        // console.log(current_booking);

        if(!current_booking) {
            return res.status(400).send({message:'ไม่มี Booking ตาม ref_number'});
        }


        if(current_booking && current_booking.status[current_booking.status.length - 1].name !== 'จองแล้ว'){
            return res.status(400).send({message:'ไม่อยู่ในสถาณะจอง'})
        }

        if(new Date(current_booking.date_to) <= new Date(now.getFullYear(),now.getMonth(),now.getDate()+3)){
            return res.status(400).send({message:'ไม่สามารถเปลี่ยนวันเช็คอินได้เนื่องจากเกินระยะเวลาที่กำหนด'});
        }

       

        const pipeline =[
            {
                "$unwind":{
                    path:"$rooms"
                }
            },
            {
                "$match":{"$and":[
                    {"hotel_id":current_booking.hotel_id},
                    
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

        if(calendar.length<=0){
            return res.status(400).send({message:'ไม่พบห้องของโรงแรม ณ ปัจจุบัน'})
        }
        //count qouta
        const hotel_room = await Room.find({hotel_id:current_booking.hotel_id})
      const collection = [];

      const mismatch = [];
      const match = [];

      for(let room of calendar){

        const container = [];
      

        for(let i=0; i<current_booking.total_day; i++){
            
            const current_date = new Date(new_date_check_in.getFullYear(), new_date_check_in.getMonth(), new_date_check_in.getDate()+i)

            const used_quota = room.booking_on.filter(el=> current_date >= new Date(el.date_check_in) && current_date < new Date(el.date_check_out)).length;

            const remainding_quota = hotel_room.find(el=>el.type.name_th === room._id).quota - used_quota;

            const current_room_amount = current_booking.rooms.find(el=>el.room.type.name_th === room._id).amount

            const quota_check = (hotel_room.find(el=> el.type.name_th === room._id).quota - used_quota - current_room_amount );

            
            if(quota_check<0){
                console.log('mismatch',quota_check)
                mismatch.push({
                    date:current_date,
                    data:`ห้อง ${room._id} มีโควต้าคงเหลือ ${remainding_quota} ห้อง ต้องการ ${current_room_amount} `
                })
            }else{
                match.push({
                    date:current_date,
                    data:`ห้อง ${room._id} มีโควต้าคงเหลือ ${remainding_quota} ห้อง ต้องการ ${current_room_amount} `
                });
            }


            if(mismatch.length>0){
                return res.status(200).send({message:'ห้องไม่ว่าง',data:mismatch })
            }
          
         
            container.push({
                date:current_date,
                room_amount:current_booking.rooms.find(el=>el.room.type.name_th === room._id).amount,
                remainding_quota: (hotel_room.find(el=> el.type.name_th === room._id).quota - used_quota),
                quota_check:(hotel_room.find(el=> el.type.name_th === room._id).quota - used_quota - current_booking.rooms.find(el=>el.room.type.name_th === room._id).amount)>=0,
              
            });
        }
        collection.push({id:room._id,data:container});
      }

        return res.send({message:'ห้องว่าง',data:match})
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error.message);
    }

}


//confirm change checkin date
module.exports.ConfirmChangeDate = async (req,res) =>{
    try {
   
    const ref_number = req.body.ref_number;

    const booking = await Booking.findOne({ref_number:ref_number},{_id:1,total_day:1});
    if(!booking){

        return res.status(400).send({message:'ไม่พบใบจอง'});
    }
    
    const check_quota = await checkQuota(ref_number,req.body.date_check_in);

    if(check_quota.message === 'ห้องว่าง'){

        const new_checkin = new Date(req.body.date_check_in);
        const new_checkout = new Date(new_checkin.getFullYear(),new_checkin.getMonth(),new_checkin.getDate()+booking.total_day);

        const dataUpdate = {
            date_from:dayjs(new_checkin).format('YYYY-MM-DD') ,
            date_to:dayjs(new_checkout).format('YYYY-MM-DD')
        }

      Booking.findOneAndUpdate({ref_number:ref_number},dataUpdate,{returnDocument:'after'},(err,result)=>{

        if(err){
            return res.status(400).send(err.message)
        }

            return res.status(200).send({
                message:'เปลี่ยนวันจองเรียบร้อย',
                data:{
           
                    date_check_in:result.date_from,
                    date_check_out:result.date_to
                }
            });
      
      })
       
    }else{

        
        return res.status(400).send(check_quota);
        
    }

         
} catch (error) {
    console.error(error.message);
    return res.status(500).send(error.message);
        
}
    
}



