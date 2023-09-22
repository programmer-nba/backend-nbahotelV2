const {Task }= require('../models/task.schema');

function CreateTask({
    title,
    subtitle,
    description,
    hotel_id,
    global
}){

    const task = new Task({
        title:title,
        subtitle:subtitle,
        description:description,
        hotel_id:hotel_id,
        global:global
        
    })

    task.save((err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log('new task created',result._id);
        }
    });
}

module.exports = CreateTask;