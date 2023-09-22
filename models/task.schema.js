const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
        },
    subtitle:{type: String},
    description:{type: String},
    hotel_id:{type: String},
    global:{type:Boolean,default:false},
    done:{type:Boolean,default:false}
    },
{timestamps:true}
);

const Task = mongoose.model('Task', taskSchema);

module.exports = {Task};