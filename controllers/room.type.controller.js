const RoomType = require('../models/room.type.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roomType = await RoomType.find();
        if(roomType){
            return res.status(200).send(roomType);
        }
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//ceate Catetory
module.exports.Create= async (req,res) =>{
    try {
        
        const data = {
            name_th: req.body.name_th,
            name_en: req.body.name_en,
            description : req.body.description
        }
        const roomType = new RoomType(data);
        roomType.save((err,result)=>{
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
            name_th: req.body.name_th,
            name_en: req.body.name_en,
            description : req.body.description
        }

       RoomType.findOneAndUpdate({_id:id},data,{returnOriginal:false},(err,result)=>{
            if(err){
                return res.status(500).send({message:err.message});
            }

                res.send(result);
            
        })
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomType
module.exports.Delete = async (req,res) => {
    try {
      RoomType.findOneAndDelete({_id:req.params.id},null,((err,result) =>{
            if(err){
                return res.status(500).send({message:err.message});
            }
            res.status(200).send(result);
        }))
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}