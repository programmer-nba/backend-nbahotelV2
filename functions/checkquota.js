//methond

async function checkQuota(ref_number,check_in_date){
    try {
        
        console.log(ref_number,check_in_date);

        const now = new Date();
        const new_date_check_in = new Date(check_in_date);

        if(new Date(new_date_check_in.getFullYear(),new_date_check_in.getMonth(),new_date_check_in.getDate())<= new Date(now.getFullYear(),now.getMonth(),now.getDate())){

            return {message:'ไม่สามารถเปลี่ยนวันเช็คอินก่อนวันปัจุบัน'}

        }
        
        //get current booking
        const current_booking = await Booking.findOne({ref_number:ref_number},{hotel_id:1,date_from:1,date_to:1,total_day:1,rooms:1,status:1});

        // console.log(current_booking);

        if(!current_booking) {
            return {message:'ไม่มี Booking ตาม ref_number'};
        }


        if(current_booking && current_booking.status[current_booking.status.length - 1].name !== 'จองแล้ว'){
            return {message:'ไม่อยู่ในสถาณะจอง'}
        }

        if(new Date(current_booking.date_to) <= new Date(now.getFullYear(),now.getMonth(),now.getDate()+3)){
            return {message:'ไม่สามารถเปลี่ยนวันเช็คอินได้เนื่องจากเกินระยะเวลาที่กำหนด'};
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
            return {message:'ไม่พบห้องของโรงแรม ณ ปัจจุบัน'}
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
                return {message:'ห้องไม่ว่าง',data:mismatch }
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

        return {message:'ห้องว่าง',data:match}
        
    } catch (error) {
        console.error(error.message);
        return error.message
    }
}


module.exports = checkQuota