const User = require('../models/user.schema');
const {Hotel} = require('../models/hotel.schema');
const Session = require('../models/session.schema');
const jwt = require('jsonwebtoken');

module.exports.getAll = async (req,res)=>{

    try {
        const user = await User.find();
        if(!user){
            return res.status(404).send('No User');
        }
        return res.status(200).send({status:true,data:user});
        
    } catch (error) {
        return res.status(500).send({status:error,error:error.message})
    }
}

module.exports.Me = async (req,res) => {

    try {
   
    const token = req.headers['token'];
    if(!token){
        return res.status(403).send({status:false,message:'Not authorized'});
    }

    //decode token
    jwt.verify(token,process.env.SECRET_KEY,(err,decodded)=>{
        if(err){
            return res.status(500).send({status:false,error:err.message});
        }
        const dataResponse = {
            user_id:decodded.id,
            username:decodded.username,
            email:decodded.email,
            service_name:decodded.service_name,
            service_id:decodded.service_id,
            approved:decodded.approved
        }
        return res.status(200).send({status:true,data:dataResponse});
    })
        } catch (error) {
            console.log(error);
                return res.status(500).send({status:false,error:error.message});
        }
}


//get User by id
module.exports.getById = async (req,res)=>{
    const id = req.params.id;

    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(404).send('No User');
        }
        const dataresponse = {
            firstname:user.firstname,
            lastname:user.lastname,
            service_id:user.service_id,
            service_name:user.service_name,
            email:user.email,
            telephone:user.telephone,
            telephone_inviter:user.telephone_inviter,
            approved:user.approved
        }
        return res.status(200).send({status:true,data:dataresponse});
    } catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
}

//approve partner
module.exports.Approved = async (req,res)=>{
    const id = req.params.id;
   
    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(404).send({status:false,message:'No User'});
        }

        //update data
        const body = {
            approved:req.body.approved
        }

        console.log(body);

        User.findByIdAndUpdate(id,body,{returnOriginal:false},(err,result)=>{
            if(err){
                return res.status(500).send({status:false,error:err.message});
            }
            Hotel.findOneAndUpdate({host_id:id},body,{returnOriginal:false},(err,result)=>{
                if(err){
                    return res.status(500).send({status:false,error:err.message});
                }
            })
                
            return res.status(200).send({status:true,data:result});
        });


        
    } catch (error) {
        return res.status(500).send({status:false,error:error});
    }
}



//approve partner
module.exports.Update = async (req,res)=>{
    const id = req.params.id;
   
    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(404).send({status:false,message:'No User'});
        }

        //update data
        const body = {
            email: req.body.email?req.body.email:user.email,
            password: req.body.password?req.body.password:user.password,
            firstname:req.body.firstname?req.body.firstname:user.firstname,
            lastname:req.body.lastname?req.body.lastname:user.lastname,    
        }
        
        findByIdAndUpdate(id,body,{returnOriginal:false},(err,result)=>{
            if(err){
                return res.status(500).send({status:false,error:err.message});
            }
            return res.status(200).send({status:true,data:result});
        })
    } catch (error) {
        return res.status(500).send({status:false,error:error});
    }
}

//create userservice
module.exports.CreateUserService = async (req,res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
    if(!user){
        return res.status(404).send(`User id ${id} does not exist`);
    }

    const dataUpdate = {
       
        service_name:req.body.service_name,
        service_id: req.body.service_id
    }

    const result = await User.findByIdAndUpdate(id,dataUpdate,{returnOriginal:false});
    return res.send(result);
    } catch (error) {
        return res.status(500).send({status:false,error:error});
    }
}

module.exports.SignOut = async (req, res) => {
    const sessionId = req.cookies['connect.sid'];
    try {
    Session.findByIdAndUpdate(sessionId,{expires:(new Date())},{returnOriginal:false},(err,data)=>{
        if(err){ 
            console.log('err',err);
            return res.status(500).send({status:false,error:err})
        }

        req.session.destroy((err,data)=>{
            if(err){
                console.log(err);
            }

            return res.status(200).send(data);
        })
        
    });

} catch (error) {

        return res.status(500).send({status:false,error:error});
    }
}