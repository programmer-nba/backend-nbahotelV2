const RoleType = require('../models/role.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roleType = await RoleType.find();
        if(roleType){
            return res.status(200).send(roleType);
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
        }
        const roleType = new RoleType(data);
        const add = await roleType.save()
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
        }
        const edit = await RoleType.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        return res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoleType
module.exports.Delete = async (req,res) => {
    try {
        await RoleType.findOneAndDelete({_id:req.params.id})
        return res.status(200).send('ลบข้อมูลroleสำเร็จ')
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}