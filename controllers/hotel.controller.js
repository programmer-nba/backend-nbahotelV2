const dayjs = require('dayjs');
const Category = require('../models/hotel.category.schema');
const Amenities = require('../models/hotel.amenities.schema');
const Highlights = require('../models/hotel.highlight.schema');
const Certificates = require('../models/hotel.certificate.schema');
const Member = require('../models/member.schema');
const {Hotel} = require('../models/hotel.schema');


//get all
module.exports.GetAll = async (req,res) =>{
    try {
        const hotel = await Hotel.find();
        if(hotel){
            return res.status(200).send(hotel)
        } 
    } catch (error) {
        return res.status(500).send({message:error});
    }
}

//get by id
module.exports.GetById = async (req,res) =>{
    try {
        const hotel = await Hotel.find();
        if(hotel){
            return res.status(200).send(hotel)
        } 
        
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}


// admin create hotel on first state
module.exports.Create = async (req,res)=>{
    try {

        const category = await Category.findById(req.body.category_id);
        if(!category){
            return res.status(404).send({message:'no category'});
        }

        const hotel = new Hotel({
            host_id:req.body.host_id,
            name: req.body.name,
            category: category,
            phone_number: req.body.phone_number,
            description: req.body.description,
            address: req.body.address,
            tambon: req.body.tambon,
            amphure: req.body.amphure,
            province : req.body.province,
            country: req.body.country,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            rating: 0,
            total_rate: 0,
            image_url: [] , //เริ่มต้นค่าว่าง
            amenities: [], //สิ่งอำนวยความสะดวก
            highlight : [], //เริ่มต้นค่าว่าง
            special_service:[],//เริ่มต้นค่าว่าง
            nearly_place: [],
            parking : req.body.parking,
            property_policies: req.body.property_policies,
            other_information : req.other_information
        })
        const add = await Hotel.save()
       
        //update user service
        userService = {
            service_name:'hotel',
            service_id:add._id,
        }
        //รอทำต่อครับ
        updateservice = await Member.findByIdAndUpdate(req.body.host_id,userService,{returnOriginal:false})
        return res.status(200).send({status:true,data:add,service:updateservice})


    } catch (error) {
        return res.status(500).send({message:error});
    }
}

module.exports.Update = async (req,res) =>{

    const id = req.params.id;
    console.log(req.body);

    try {

    const hotel = await Hotel.findById(id);

    if(!hotel){
        return res.status(404).send({message:`Hotel id ${id} not found`});
    }

    //hotel amenities
    var amenities = [];
    if(req.body.amenities){

       for(let id of req.body.amenities){

           const container = await Amenities.findById(id);
           if(container){
               amenities.push(container);
               
            }
        }
        
    }
    else{
        amenities = hotel.amenities;
    }

    //hotel highlight
    var highlights =[];
    if(req.body.highlight){

      for(let id of req.body.highlight){

          const container = await Highlights.findById(id);
          if(container){
              highlights.push(container);
              
            }
        }
       
    }
    else{
        highlights = hotel.highlight;
    }
  

    //hotel certificates
    var certificates = [];
    if(req.body.certificate){

             for(let id of req.body.certificate){

                 const container = await Certificates.findById(id);
                 if(container){
                     certificates.push(container);
                     
                    }
                }
    }
    else{
        certificates = hotel.certificate;
    }
   

    let category = await Category.findById(req.body.category_id);

    if(!category){
        category = hotel.category;
    }
  
        const data = {
            name: req.body.name?req.body.name:hotel.name,
            category: category,
            phone_number: req.body.phone_number?req.body.phone_number:hotel.phone_number,
            description: req.body.description?req.body.description:hotel.description,
            address: req.body.address?req.body.address:hotel.address,
            tambon: req.body.tambon?req.body.tambon:hotel.tambon,
            amphure: req.body.amphure?req.body.amphure:hotel.amphure,
            province : req.body.province?req.body.province:hotel.province,
            country: req.body.country?req.body.country:hotel.country,
            latitude: req.body.latitude?req.body.latitude:hotel.latitude,
            longitude: req.body.longitude?req.body.longitude:hotel.longitude,
            amenities: amenities, //สิ่งอำนวยความสะดวก
            highlight : highlights,
            certificate:certificates,
            nearly_place: req.body.nearly_place?req.body.nearly_place:hotel.nearly_place,
            parking : req.body.parking?req.body.parking:hotel.parking,
            property_policies: req.body.property_policies?req.body.property_policies:hotel.property_policies,
            other_information : req.body.other_information?req.body.other_information:hotel.other_information
        }

        console.log(data);
        
        Hotel.findByIdAndUpdate(id,data,{returnOriginal:false},(error,result)=>{
            if(error){
                return res.send({message:error.message});
            }
            return res.status(200).send(result);
        })
        
    } catch (error) {

        return res.status(500).send({message:error});
        
    }
}

module.exports.Delete = async (req,res) =>{
    try {
        const id = req.params.id;
        const hotel = await Hotel.findById(id);
        if(!hotel){
            return res.status(404).send({message:`Hotel id ${id} not found`});
        }
        hotel.remove((err,result)=>{
            if(err){
                return res.status(500).send({message:err});
            }
            return res.send(result);
        })
    } catch (error) {
        return res.status(500).send({message:error});
    }
}

