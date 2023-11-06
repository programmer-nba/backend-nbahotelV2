const AirconditionType = require('../models/aircondition.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const airconditionType = await AirconditionType.find();
        if(airconditionType){
            return res.status(200).send(airconditionType);
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
        const airconditionType = new AirconditionType(data);
        const add = await airconditionType.save()
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

    const edit = await AirconditionType.findOneAndUpdate({_id:id},data,{returnOriginal:false})
    return res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete AirconditionType
module.exports.Delete = async (req,res) => {
    try {
    await AirconditionType.findOneAndDelete({_id:req.params.id})
    return res.status(200).send('ลบข้อมูล air สำเร็จ')
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}