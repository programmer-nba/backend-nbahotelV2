var jwt = require('jsonwebtoken');
const Session = require('../models/session.schema');

const sessionAuth = async (req,res,next) =>{
    const token = req.headers['token'];
    // const session = await Session.findById(req.sessionID);

    // if(!session){
    //     return res.status(403).send({status:false,message:'You not have permission to access'});
    // }

    // const user = JSON.parse(session.session).user;

    jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            return res.status(500).send(err);
        }

        if(decoded.level.includes('ROLE_PARTNER')){

    //      if(new Date(session.expires)< new Date() || !user || user.id !== decoded.id){
    //     return res.status(403).send({status:false,message:'Not logged in'});
             next();
         }
    })
   
}

module.exports= sessionAuth;