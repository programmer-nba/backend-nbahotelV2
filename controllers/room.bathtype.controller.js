const RoomBathType= require('../models/room.bathtype.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roomBathType= await RoomBathType.find();
        if(roomBathType){
            return res.status(200).send(roomBathType);
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
        const roomBathType= new RoomBathType(data);
        roomBathType.save((err,result)=>{
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

       RoomBathType.findOneAndUpdate({_id:id},data,{returnOriginal:false},(err,result)=>{
            if(err){
                return res.status(500).send({message:err.message});
            }

                res.send(result);
            
        })
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomBathType
module.exports.Delete = async (req,res) => {
    try {
      RoomBathType.findOneAndDelete({_id:req.params.id},null,((err,result) =>{
            if(err){
                return res.status(500).send({message:err.message});
            }
            res.status(200).send(result);
        }))
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}