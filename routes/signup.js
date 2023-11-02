var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");

//เรียก schema  
const Admin = require("../models/admin.schema")
const Partner = require("../models/partner.schema")
const Member = require("../models/member.schema");
const Role = require('../models/role.schema');


//สร้าง function เช็คเลขโทรศัพท์ซ้ำ
async function Checktelephone(telephone){
  const checkAdmin = await Admin.findOne({telephone:telephone})
  if(checkAdmin) return true
  const checkPartner = await Partner.findOne({telephone:telephone})
  if(checkPartner) return true
  const checkMember = await Member.findOne({telephone:telephone})
  if(checkMember) return true    
  return false
}


// api เพิ่มข้อมูล member
router.post("/member", async (req, res) => {
  try {
    const telephone = req.body.telephone
    //เช็คเบอร์ซ้ำ
    const Check = await Checktelephone(telephone).then((status)=>{
      return status
    })
    if(Check === true){
      return res.status(400).send({status:false,message:`เบอร์ ${telephone} ซ้ำ กรุณาเปลี่ยนใหม่`})
    }
     
    // รับค่า req 
    const Memberdata = new Member({
      telephone: telephone,
      password: bcrypt.hashSync(req.body.password, 10),
      name : req.body.name,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      telephone_inviter: req.body.telephone_inviter,
      roles: req.body.roles,
    });
    //เพิ่มข้อมูล
    await Memberdata.save().then(savedMember=>{
      return res.status(200).send({status:true,message:'บันทึกผู้ใช้เรียบร้อย(member)',data:savedMember});
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({status: false, message: error});
  }
});
//เพิ่มข้อมูล partner
router.post("/partner", async (req, res) => {
  try {
    const telephone = req.body.telephone
    //เช็คเบอร์ซ้ำ
    const Check = await Checktelephone(telephone).then((status)=>{
      return status
    })
    if(Check === true){
      return res.status(400).send({status:false,message:`เบอร์ ${telephone} ซ้ำ กรุณาเปลี่ยนใหม่`})
    }
     
    // รับค่า req 
    const Partnerdata = new Partner({
      telephone: telephone,
      password: bcrypt.hashSync(req.body.password, 10),
      name: req.body.name,
      companyname: req.body.companyname,
      level : req.body.level,
    });
    //เพิ่มข้อมูล
    await Partnerdata.save().then(savedPartner=>{
      return res.status(200).send({status:true,message:'บันทึกผู้ใช้เรียบร้อย(Partner)',data:savedPartner});
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({status: false, message: error});
  }
});

//เพิ่มข้อมูล admin
router.post("/admin", async (req, res) => {
  try {
    const telephone = req.body.telephone
    //เช็คเบอร์ซ้ำ
    const Check = await Checktelephone(telephone).then((status)=>{
      return status
    })
    if(Check === true){
      return res.status(400).send({status:false,message:`เบอร์ ${telephone} ซ้ำ กรุณาเปลี่ยนใหม่`})
    }
     
    // รับค่า req 
    const Admindata = new Admin({
      telephone: telephone,
      password: bcrypt.hashSync(req.body.password, 10),
      name: req.body.name,
      roles : req.body.roles,
      level : req.body.level,
    });
    //เพิ่มข้อมูล
    await Admindata.save().then(savedAdmin=>{
      return res.status(200).send({status:true,message:'บันทึกผู้ใช้เรียบร้อย(admin)',data:savedAdmin});
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({status: false, message: error});
  }
});


module.exports = router;
