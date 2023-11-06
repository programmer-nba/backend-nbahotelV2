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
        const add = await roomAmenitiesType.save()
        return res.status(200).send(add)
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

        const edit = await RoomAmenitiesType.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        return res.status(200).send(edit);
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomAmenitiesType
module.exports.Delete = async (req,res) => {
    try {
        await RoomAmenitiesType.findOneAndDelete({_id:req.params.id})
        return res.status(200).send('ลบข้อมูลสิ่งอำนวยความสะดวกภายในห้อง');
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}