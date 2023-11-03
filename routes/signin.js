var express = require("express");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var router = express.Router();
//เรียก schema
const Member = require("../models/member.schema")
const Partner = require("../models/partner.schema");
const Admin = require("../models/admin.schema")
const {default: axios} = require("axios")



async function checklogin(telephone,password){
  let bcryptpassword = ""
  const Memberdata = await Member.findOne({telephone:telephone})
  const Partnerdata = await Partner.findOne({telephone:telephone})
  const Admindata = await Admin.findOne({telephone:telephone})
  
  // เช็คค่า Member มีหรือเปล่า
  if(Memberdata){
      //เช็คค่า password ว่าในฐานข้อมูลตรงกันหรือเปล่า
     bcryptpassword = await bcrypt.compare(password,Memberdata.password)

      if(bcryptpassword){
        return  [Memberdata,"member"]
      }
      else{
        return ["Invalid Password",""]
      }
  }else if(Partnerdata){
    bcryptpassword = await bcrypt.compare(password,Partnerdata.password)
      if(bcryptpassword){
        return [Partnerdata,"partner"]
      }else{
        return ["Invalid Password",""]
      }
  }else if(Admindata){
    bcryptpassword = await bcrypt.compare(password,Admindata.password)
      if(bcryptpassword){
        return [Admindata,"admin"]
      }else{
        return ["Invalid Password",""]
      }
  }else{
    return  ["user not found",""]
  }
  

}

router.post('/', async(req,res)=>{
  try {
    const telephone = req.body.telephone
    const password = req.body.password
    const [checksignin,roles] = await checklogin(telephone,password).then((data)=>{
      return data
    })
    
    if(checksignin === "user not found"){
      return res.status(400).send({ status: false, message: "user not found" });
    } else if(checksignin === "Invalid Password"){
      return res.status(500).send({ status: false, message: "Invalid Password" })
    }
     //สร้าง signaturn
     const {privateKey,publicKey} = crypto.generateKeyPairSync('ec', {namedCurve: 'sect239k1'});
     const sign = crypto.createSign('SHA256')
     sign.write(`${checksignin}`)
     sign.end();
     var signature = sign.sign(privateKey, 'hex');
     const payload = {
      name: checksignin.name,
      roles : roles,
      signature: signature
     }
     const secretKey = process.env.SECRET_KEY
     const token = jwt.sign(payload,secretKey,{expiresIn:"4h"})
     req.session.users = payload
     req.session.save()
      if(roles == "admin"){
        return res.status(200).send({ status: true, data: payload, token: token})
      } else if (roles =="partner"){
        return res.status(200).send({ status: true, data: payload, token: token})
      } else{
        return res.status(200).send({ status: true, data: payload, token: token})
     }
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
});

// router.post("/admin", async (req, res) => {
//   const Membername = req.body.Membername;
//   const password = req.body.password;

//   const axios = require("axios");
//   let data = JSON.stringify({
//     Membername: Membername,
//     password: password,
//   });

//   let config = {
//     method: "post",
//     maxBodyLength: Infinity,
//     url: process.env.NBA_AUTH_API,
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: data,
//   };

//   axios
//     .request(config)
//     .then((response) => {
//       if (response.data.status) {
//         return res.status(200).send(response.data.token);
//       }
//     })
//     .catch((error) => {
//       return res.status(500).send(error.message);
//     });
// });

// router.post("/me", async (req, res) => {
//   const axios = require("axios");
//   const token = req.headers["token"];
//   let config = {
//     method: "get",
//     maxBodyLength: Infinity,
//     url: process.env.NBA_AUTH_API,
//     headers: {
//       token: token,
//     },
//   };

//   axios
//     .request(config)
//     .then((response) => {
//       console.log(JSON.stringify(response.data));
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

module.exports = router;
