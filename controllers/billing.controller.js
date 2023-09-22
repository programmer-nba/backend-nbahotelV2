const {Booking} = require('../models/booking.schema');
const {Hotel} = require('../models/hotel.schema');
const {Partner} = require('../models/partner.schema');
const {PrePayment}  = require('../models/prepayment.schema')

module.exports.GetBilling = async (req,res) => {
    try {

       const pipeline = [
       
        {
            "$match":{$and:[
                {"hotel_id":req.params.id},
              
                {"confirm":"confirmed"}
                    ]
                }
            },
           
        {
            "$unset":[
                "rooms",
                "hotel_id",
                "partner_id",
                "customer_tel",
                "createdAt",
                "updatedAt",
                "price_per_day",
                "total_day",
                "date_from",
                "suspend",
                "num_guess",
                "customer_name",
                "payment_plan",
                "payment_method",
                "payment_reference_number"
            ]
        }
        
    ]
        
        const booking = await Booking.aggregate(pipeline);

        
        if(booking){
            
            console.log('booking',booking);

        const this_year = booking.filter(el=>new Date(el.date_to).getFullYear() === new Date().getFullYear() && el.status[el.status.length-1].name==='เช็คเอาท์');
        const last_year = booking.filter(el=>new Date(el.date_to).getFullYear() === (new Date().getFullYear()-1) && el.status[el.status.length-1].name==='เช็คเอาท์');

        
        //estimated
        const this_year_estimate = booking.filter(el=>new Date(el.date_to).getFullYear() === new Date().getFullYear());
        console.log(this_year_estimate);

            var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            const count = []
            const count_estimate = []
            const count_last = []
    
            for (month of mL){
          
    
              count.push({month:month,total:this_year.filter(el=> new Date(el.date_to).toLocaleDateString('en-TH',{month:'long'})===month ).reduce((total,item)=>total+item.total_cost,0) } );
              count_estimate.push({month:month,total:this_year_estimate.filter(el=> new Date(el.date_to).toLocaleDateString('en-TH',{month:'long'})===month ).reduce((total,item)=>total+item.total_cost,0) } );
              count_last.push({month:month,total:last_year.filter(el=> new Date(el.date_to).toLocaleDateString('en-TH',{month:'long'})===month  ).reduce((total,item)=>total+item.total_cost,0)});

            }

        //count last 7 day booking
        const count_last_7day = [];

       const now = new Date();
      
       for(let i=0;i<7;i++){
         const currentdate = new Date(now.getFullYear(),now.getMonth(),now.getDate()-i);
         count_last_7day.push({
            date:currentdate,
            income:booking.filter(el=>el.status[el.status.length-1].name === 'เช็คเอาท์' 
            && new Date(el.date_to).toLocaleDateString('th-TH',{year:'numeric',month:'2-digit',day:'numeric'})===new Date(currentdate).toLocaleDateString('th-TH',{year:'numeric',month:'2-digit',day:'numeric'})).reduce((total,item)=>total+item.total_cost,0)
        });
       }

       //count last month
       const count_last_month = []

       const last_day_of_month = new Date(now.getFullYear(),now.getMonth()+1,0).getDate();

       for(let i=1;i<=last_day_of_month;i++){
        const currentdate = new Date(now.getFullYear(),now.getMonth(),i);
        count_last_month.push({
            date:currentdate,
            income:booking.filter(el=>el.status[el.status.length-1].name==='เช็คเอาท์' 
            && new Date(el.date_to).toLocaleDateString('th-TH',{year:'numeric',month:'2-digit',day:'numeric'})===new Date(currentdate).toLocaleDateString('th-TH',{year:'numeric',month:'2-digit',day:'numeric'})).reduce((total,item)=>total+item.total_cost,0)
       
        })
       }

       

       //moving everage
       const last_90_days_income = [];
       const moving_everage = []

       const period = 14;
       for(let i=1;i<=period ;i++){
        const currentdate = new Date(now.getFullYear(),now.getMonth(),(now.getDate()-period)+i);

       last_90_days_income.push({

        date:currentdate,
          income: booking.filter(el=>el.status[el.status.length-1].name==='เช็คเอาท์' 
           && new Date(el.date_to).toLocaleDateString('th-TH',{year:'numeric',month:'2-digit',day:'numeric'})===new Date(currentdate).toLocaleDateString('th-TH',{year:'numeric',month:'2-digit',day:'numeric'})).reduce((total,item)=>total+item.total_cost,0)
        } 
     
       )

       }

   

       for(let i=7;i<last_90_days_income.length;i++){
        
           var sum = 0;
            for(let j=0;j<7;j++){
                sum+=last_90_days_income[i-j].income
            }

            moving_everage.push({
                date:last_90_days_income[i].date,
                income:last_90_days_income[i],
                moving_everage:(sum/7)
            })
            
        }


        //count previous month
       const count_previous_month = []
       const last_day_of_last_month = new Date(now.getFullYear(),now.getMonth(),0).getDate();

       for(let i=1;i<=last_day_of_last_month;i++){
        const currentdate = new Date(now.getFullYear(),now.getMonth()-1,i);
        const container = booking.filter(el=>el.status[el.status.length-1].name==="เช็คเอาท์"
            && new Date(el.date_to).toLocaleDateString('th-TH',{year:'numeric',month:'2-digit',day:'numeric'})===new Date(currentdate).toLocaleDateString('th-TH',{year:'numeric',month:'2-digit',day:'numeric'})
            ).map((el)=>({date:el.date_to,ref_number:el.ref_number,total_cost:el.total_cost}))

            if(container && container.length>0){

              for(let el of container){

                  count_previous_month.push(el)
              } 
            }
       }

       //project last month bookings
    
       const firstDate = new Date(now.getFullYear(),now.getMonth(),1)
       const lastDate = new Date(now.getFullYear(),now.getMonth()+1,0);

       const query ={ $and:[

        {"hotel_id":req.params.id},
        {"confirm":"confirmed"},
        {"date_to":{$gte:firstDate}},
        {"date_to":{$lte:lastDate}},

            ]};

        const projection = {
            date_to:1,
            total_cost:1,
            status:1,
            ref_number:1

        }


       
       const lastmonth_booking = await Booking.find(query,projection);
 
       const lastmonth_billing = lastmonth_booking.filter(el=>el.status[el.status.length-1].name==='เช็คเอาท์').map(el=>({
        date:el.date_to,
        ref_number:el.ref_number,
        total_cost:el.total_cost
       }))

            return res.status(200).send({
                this_year:count,
                this_year_estimate:count_estimate,
                last_year:count_last,
                last7day:count_last_7day,
                lastmonth:count_last_month,
                lastmonth_billing:lastmonth_billing ,
                movingeverage:moving_everage,
                previous_month:count_previous_month,
            });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
}

//get billing summary
module.exports.getBillingSummary= async (req,res) => {
    try {
        
        const pipeline = [
            {
                "$unwind":{path:"$status"}
            },
       
            {
                "$match":{
                    $and:[
                        {"hotel_id":req.params.id},
                        {"status.name":"เช็คเอาท์"},
                        {"confirm":"confirmed"}

                            ]
                    }
            },
          {
            "$group":{
                "_id":"$date_to",
                "booking":{$push:{id:"$_id",ref_number:"$ref_number",total:"$total_cost",status:"$status.name"}},
                "total":{"$sum":"$total_cost"},
              
            }
          },
          {
            "$set":{
                "date":"$_id"
            }
          },
          {
            "$unset":[
                "_id"
            ]
          },
          {
            "$sort":{"date":1}
          }

    ]

        const booking = await Booking.aggregate(pipeline);
        const now = new Date();
        const this_year = booking.filter(el=>new Date(el.date).getFullYear() === now.getFullYear())
        const collection = [];

        const month = [
            "มกราคม", 
            "กุมภาพันธ์", 
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม"
        ]

        for(let i=0 ; i<11 ; i++) {

        

            const container = this_year.filter(el=>new Date(el.date).getMonth() === i).map(el=>el.booking);

            const value = [];

            for (let i of container){
                value.push(...i);
            } 

         
            const total = value.reduce((total,item)=>total+item.total,0);
 
            
            collection.push(
                {
                    month:month[i],
                    booking:value,
                    total:total
                    }
                );
        }
        return res.status(200).send({period_day:booking.reverse(),period_month:collection});
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error.message);
    }
}

//get billing by partner
module.exports.getAllBilling = async (req,res) => {

        const date = new Date(req.body.year,req.body.month,1);
  
        const start_date = new Date(date.getFullYear(), date.getMonth(),1);
        const end_date = new Date(date.getFullYear(),date.getMonth()+1,0);

        console.log(start_date,end_date);

        const pipeline = [
            {
                "$unwind":{path:"$status"}
            },
            {
                "$match":{
                    $and:[
                        {"date_to":{$gte:start_date}},
                        {"date_to":{$lte:end_date}},
                        {"status.name":"เช็คเอาท์"},
                        {"confirm":"confirmed"}
                    ]
                }
            },
            {
                "$group":{
                    "_id":{hotel:"$hotel_id",partner:"$partner_id"},
                    "booking":{$push:{booking_id:"$_id",ref_number:"$ref_number",total:"$total_cost",status:"$status.name",check_out_date:"$date_to",partner_id:"$partner_id"}},
                    "total":{"$sum":"$total_cost"}, 
                }
            }
        ]
        try {
            const booking = await Booking.aggregate(pipeline);
            const hotel = await Hotel.find({},{_id:1,name:1,address:1,tambon:1,apmphure:1,province:1,phone_number:1});
            const partner = await Partner.find({},{_id:1,companyname:1});

            console.log(booking);

            const response = booking.map(el=>({
                hotel:hotel.find(hotel=> hotel._id == el._id.hotel),
                partner:partner.find(partner=>partner._id==el._id.partner),
                booking:el.booking.map(booking=>({
                    booking_id:booking.booking_id,
                    ref_number:booking.ref_number,
                    total:booking.total,
                    status:booking.status,
                    check_out_date:booking.check_out_date,
                    partner:partner.find(partner=>partner._id==booking.partner_id)
                })), 
                total:el.total,
            
            }))

            return res.status(200).send(response);

        } catch (error) {
            console.error(error.message);
            return res.status(500).send(error.message);
        }
}

