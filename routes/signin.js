var express = require("express");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var router = express.Router();
const User = require("../models/user.schema");
const {default: axios} = require("axios");

router.post('/',(req,res)=>{
  try {
    User.findOne({ telephone: req.body.telephone})
  .then((user) => {
    if (!user) {
      return res.status(400).send({ status: false, message: "User not found" });
    }
    bcrypt.compare(req.body.password, user.password).then((isMatch)=>{
      if (!isMatch) {
        return res.status(500).send({ status: false, message: "Invalid Password" });
      }else{
        if(user.roles=="admin"){
          return res.status(200).send({ status: true, message:"ล็อคอินสำเร็จ admin" });
        } else if (user.roles=="partner"){
          return res.status(200).send({ status: true, message:"ล็อคอินสำเร็จ partner" });
        } else if (user.roles=="member"){
          return res.status(200).send({ status: true, message:"ล็อคอินสำเร็จ member" });
        }
        
      }

    })
    //bcrypt
    .catch((err) => {
      return res.status(403).send({ status: false, message: err });
    });
 
  })
  .catch((err) => {
    return res.status(403).send({ status: false, message: err });
  })
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
