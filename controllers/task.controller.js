const {Task} = require ('../models/task.schema')
module.exports.getTask = async (req,res) =>{
    try {
        
    
    const task = await Task.find({hotel_id:req.params.id},{hotel_id:0,global:0});

    if(!task){
        return res.status(404).send('task not found');
    }

    return res.status(200).send(task);

} catch (error) {
  
    return res.status(500).send({message:error.message});
        
    }
}
//done task
module.exports.doneTask = async (req,res) => {

    try {
        const result = await Task.findByIdAndUpdate(req.body.task_id,{done:true},{returnDocument:'after'});
        if(!result){
            return res.status(404).send(`task ${req.body.task_id} not found`);
        }
        return res.status(200).send({status:'ok',message:`${result.title} was done successfully`});
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({message:error.message});
    }
}

module.exports.deleteTask = async (req,res) =>{



    try {

        const result = await Task.findByIdAndDelete(req.body.task_id,{returnDocument:'before'})
           
        if(!result){
            return res.status(404).send({message:'task not found'});
        }
        else{

            return res.status(200).send({status:'ok',message:`${result._id} was successfully deleted`});
        }
        
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({error:error.message});
    }
}