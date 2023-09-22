const RoomEntertainmentType = require('../models/room.entertainment.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roomEntertainmentType = await RoomEntertainmentType.find();
        if(roomEntertainmentType){
            return res.status(200).send(roomEntertainmentType);
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
            description : req.body.description,
            service_time : req.body.service_time
        }
        const roomEntertainmentType = new RoomEntertainmentType(data);
        roomEntertainmentType.save((err,result)=>{
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
            description : req.body.description,
            service_time : req.body.service_time
        }

       RoomEntertainmentType.findOneAndUpdate({_id:id},data,{returnOriginal:false},(err,result)=>{
            if(err){
                return res.status(500).send({message:err.message});
            }

              return  res.send(result);
            
        })
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomEntertainmentType
module.exports.Delete = async (req,res) => {
    try {
      RoomEntertainmentType.findOneAndDelete({_id:req.params.id},null,((err,result) =>{
            if(err){
                return res.status(500).send({message:err.message});
            }
          return  res.status(200).send(result);
        }))
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}