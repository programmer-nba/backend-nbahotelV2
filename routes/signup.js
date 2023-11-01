var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");

const User = require("../models/user.schema");
const Role = require('../models/role.schema');

router.post("/", async (req, res) => {
  try {
    //manage user role
    let userRole;

    // if(req.body.roles == undefined || req.body.roles == null || req.body.roles == '') {
    //    const result =  await Role.findOne({name:"user"});
    //    if(result){
    //     userRole = result._id;
    //    }
    // }
    // else{
    //     const result = await Role.findOne({name:req.body.roles});
    //     if(result){
    //         userRole = result._id;
    //     }
    // }

    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      telephone: req.body.telephone,
      telephone_inviter: req.body.telephone_inviter,
      password: bcrypt.hashSync(req.body.password, 10),
      roles: req.body.roles,
    });

    user.save()
  } catch (error) {
    console.log(error);
    return res.status(500).send({status: false, message: error});
  }
});

module.exports = router;
