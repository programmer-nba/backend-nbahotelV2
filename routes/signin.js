var express = require('express');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var router = express.Router();
const User = require('../models/user.schema');

router.post('/',(req,res)=>{
  try {

    User.findOne({telephone:req.body.username}).populate("roles","-_V")
    .exec((err,user)=>{
        // console.log('user',user.roles);
        if(err){
            return res.status(403).send({status:false,message:err});
        }
        if(!user){
            return res.status(400).send({status:false,message:"User not found"});
        }
        //match password
        bcrypt.compare(req.body.password,user.password,(err,isMatch)=>{
            if(err){
                return res.status(403).send({status:false,message:err});
            }
            if(!isMatch){
                return res.status(500).send({status:false,message:"Invalid Password"});
            }
            const {privateKey,publicKey} = crypto.generateKeyPairSync('ec',{
                namedCurve:'sect239k1'
            });

            //gennerate  a signature of the payload
            const sign = crypto.createSign('SHA256');
            sign.write(`${user}`);
            sign.end();
            var signature = sign.sign(privateKey,'hex');

            const authorities =[];

            for (let i=0;i<user.roles.length;i++){
                console.log(user.roles[i].name);
                authorities.push('ROLE_'+user.roles[i].name.toUpperCase());
            }

            //payload
            const payload = {
                id:user._id,
                username:user.telephone,
                email:user.email,
                level:authorities,
                service_name:(user.service_name?user.service_name:''),
                service_id:(user.service_id?user.service_id:''),
                signature:signature,
                approved:user.approved
            }

            const secretKey = process.env.SECRET_KEY;
            const token = jwt.sign(payload,secretKey,{expiresIn:"12h"});

            req.session.user=payload;

            
            req.session.save((err)=>{
              if(err){
                console.log(err);
                return next(err)
                
              } 
 
            res.status(200).send({
                status:true,
                accessToken:token,
              })
            })
        })
    })
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
});

router.post('/admin',async (req,res)=>{

    const username = req.body.username;
    const password = req.body.password;


    const axios = require('axios');
    let data = JSON.stringify({
      "username": username,
      "password": password
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.NBA_AUTH_API,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
axios.request(config)
    .then((response) => {
    

        if(response.data.status){

        
            
            return res.status(200).send(response.data.token);
        }


    })
    .catch((error) => {
      return res.status(500).send(error.message);
    });


})

router.post('/me', async (req, res) => {
    const axios = require('axios');
    const token = req.headers['token'];
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: process.env.NBA_AUTH_API,
  headers: { 
    'token': token
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});

})

module.exports = router;