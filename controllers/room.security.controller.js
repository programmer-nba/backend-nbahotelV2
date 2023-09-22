const RoomSecurity = require('../models/room.security.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roomSecurity = await RoomSecurity.find();
        if(roomSecurity){
            return res.status(200).send(roomSecurity);
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
        const roomSecurity = new RoomSecurity(data);
        roomSecurity.save((err,result)=>{
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

       RoomSecurity.findOneAndUpdate({_id:id},data,{returnOriginal:false},(err,result)=>{
            if(err){
                return res.status(500).send({message:err.message});
            }

                res.send(result);
            
        })
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomSecurity
module.exports.Delete = async (req,res) => {
    try {
      RoomSecurity.findOneAndDelete({_id:req.params.id},null,((err,result) =>{
            if(err){
                return res.status(500).send({message:err.message});
            }
            res.status(200).send(result);
        }))
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}