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
        const add = await roomBathType.save()
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

    const edit = await RoomBathType.findOneAndUpdate({_id:id},data,{returnOriginal:false})
    res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomBathType
module.exports.Delete = async (req,res) => {
    try {
        await RoomBathType.findOneAndDelete({_id:req.params.id},null)
        res.status(200).send('ลบข้อมูลประเภทห้องอาบน้ำสำเร็จ')
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}