const jwt = require('jsonwebtoken');

const Role = require('../models/role.schema');
const Admin = require('../models/admin.schema');

verifyToken = (req,res,next) => {
    let token = req.headers["x-access-token"];
    let secret = req.headers["x-access-signature"];

    if(!token){
        return res.status(403).send({message:'Unauthrized!'});
    }
    //check token
    jwt.verify(token,secret,(err,decoded)=>{
        if(err){
            res.status(401).send({message:"Unauthorized!"});
        }
        req.userId = decoded.id;
        next();
    })
};

isAdmin = (req,res,next)=>{
    Admin.findById(req.UserId).exec((err,user)=>{
        if(err){
            res.status(500).send({message:err});
            return;
        }
        Role.find({_id:{$in:user.roles}},(err,roles)=>{
            if(err){
                res.status(500).send({message:err});
                return;
            }
            for(let i = 0; i<roles.length; i++){
                if(roles[i].name === 'admin'){
                    next();
                    return;
                }
            }
            res.status(403).send({message:"Require Admin Role!"});
            return;
        })
    })
};

const authJwt = {
    verifyToken,
    isAdmin
};

module.exports = authJwt;