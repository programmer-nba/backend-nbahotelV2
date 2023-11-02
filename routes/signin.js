var express = require("express");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var router = express.Router();
const User = require("../models/user.schema");
const {default: axios} = require("axios");

router.post('/', async(req,res)=>{
  try {
     const userdata = await User.findOne({telephone: req.body.telephone})
  
     // เช็คค่า user มีหรือเปล่า
     if(!userdata){
      return res.status(400).send({ status: false, message: "User not found" });
     }
     //กำหนดตัวแปรpassword
     const password = await bcrypt.compare(req.body.password,userdata.password)
     //เช็คว่า password ตรงกันหรือเปล่า
     if(!password){
      return res.status(500).send({ status: false, message: "Invalid Password" });
     }
     //สร้าง signaturn
     const {privateKey,publicKey} = crypto.generateKeyPairSync('ec', {namedCurve: 'sect239k1'});
     const sign = crypto.createSign('SHA256')
     sign.write(`${userdata}`)
     sign.end();
     var signature = sign.sign(privateKey, 'hex');
     const payload = {
      id: userdata._id,
      firstname:userdata.firstname,
      username: userdata.telephone,
      roles : userdata.roles,
      signature: signature
      }
      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(payload,secretKey,{expiresIn:"12h"})
      req.session.user = payload
      req.session.save()
      if(userdata.roles == "admin"){
        return res.status(200).send({ status: true, data: payload, token: token})
        } else if (userdata.roles =="partner"){
        return res.status(200).send({ status: true, data: payload, token: token})
        } else{
        return res.status(200).send({ status: true, data: payload, token: token})
        }
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
});

router.post("/admin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const axios = require("axios");
  let data = JSON.stringify({
    username: username,
    password: password,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.NBA_AUTH_API,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      if (response.data.status) {
        return res.status(200).send(response.data.token);
      }
    })
    .catch((error) => {
      return res.status(500).send(error.message);
    });
});

router.post("/me", async (req, res) => {
  const axios = require("axios");
  const token = req.headers["token"];
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: process.env.NBA_AUTH_API,
    headers: {
      token: token,
    },
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
