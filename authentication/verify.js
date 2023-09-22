const User = require('../models/user.schema');

const checkDuplicateUsernameOrEmail = (req,res,next)=>{
    //check Username 
    User.findOne({telephone:req.body.telephone}).exec((err,user)=>{
        if(err){
            res.status(500).send({message:err});
            return;
        }
        if(user){
            res.status(400).send({status:false,message:"Failed! this phone number is already in use"});
            return;
        }

        //check Email
        User.findOne({email:req.body.email}).exec((err,email)=>{
            if(err){
                res.status(500).send({message:err});
                return;
            }
            if(email){
                res.status(400).send({status:false,message:"Failed! Email is already in use!"});
                return;
            }
            next();
        })
    })
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;