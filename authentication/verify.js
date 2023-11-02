const Member = require('../models/member.schema');

const checkDuplicateMembernameOrEmail = (req,res,next)=>{
    //check Membername 
    Member.findOne({telephone:req.body.telephone}).exec((err,Member)=>{
        if(err){
            res.status(500).send({message:err});
            return;
        }
        if(Member){
            res.status(400).send({status:false,message:"Failed! this phone number is already in use"});
            return;
        }

        //check Email
        Member.findOne({email:req.body.email}).exec((err,email)=>{
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
    checkDuplicateMembernameOrEmail,
};

module.exports = verifySignUp;