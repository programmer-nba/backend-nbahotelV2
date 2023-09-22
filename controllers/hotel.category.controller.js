const Category = require('../models/hotel.category.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const category = await Category.find();
        if(category){
            return res.status(200).send(category);
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
        const category = new Category(data);
        category.save((err,result)=>{
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

       Category.findOneAndUpdate({_id:id},data,{returnOriginal:false},(err,result)=>{
            if(err){
                return res.status(500).send({message:err.message});
            }

                res.send(result);
            
        })
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete Category
module.exports.Delete = async (req,res) => {
    try {
      Category.findOneAndDelete({_id:req.params.id},null,((err,result) =>{
            if(err){
                return res.status(500).send({message:err.message});
            }
            res.status(200).send(result);
        }))
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}