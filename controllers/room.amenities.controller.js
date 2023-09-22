const RoomAmenitiesType = require('../models/room.amenities.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roomAmenitiesType = await RoomAmenitiesType.find();
        if(roomAmenitiesType){
            return res.status(200).send(roomAmenitiesType);
        }
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//ceate Catetory
module.exports.Create= async (req,res) =>{
    try {
        
        const data = {
            name: req.body.name,
            description : req.body.description
        }
        const roomAmenitiesType = new RoomAmenitiesType(data);
        roomAmenitiesType.save((err,result)=>{
            if(err){
               return res.status(500).send({message:err.message});
            }
            return res.status(200).send(result);
        })

    } catch (error) {
        return res.status(500).send({message:err.message});
        
    }
    
}

//update Catetory
module.exports.Update = async (req,res) => {
    const id = req.params.id;
    try {
        const data = {
            name: req.body.name,
            description : req.body.description
        }

       RoomAmenitiesType.findOneAndUpdate({_id:id},data,{returnOriginal:false},(err,result)=>{
            if(err){
                return res.status(500).send({message:err.message});
            }

              return  res.send(result);
            
        })
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomAmenitiesType
module.exports.Delete = async (req,res) => {
    try {
      RoomAmenitiesType.findOneAndDelete({_id:req.params.id},null,((err,result) =>{
            if(err){
                return res.status(500).send({message:err.message});
            }
          return  res.status(200).send(result);
        }))
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}