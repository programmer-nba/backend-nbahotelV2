const express = require('express');
const router = express.Router();

// ตรวจสอบสมาชิก
const adminAuth = require('../authentication/adminAuth');
// schema
const Admin = require("../models/admin.schema")
const Partner = require("../models/partner.schema")
const Member = require("../models/member.schema");

//เรียกข้อมูลทั้งหมด
router.get('/',adminAuth, async(req,res)=>{
    try{
        const partnerdata = await Partner.find()
        if(!partnerdata){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล partner"})
        }
        return res.status(200).send(partnerdata)
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})

//ค้นหาข้อมูลเฉพาะ telephone
router.get('/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id
        const partnerdata = await Partner.findOne({telephone:id})

        if(!partnerdata){
            return res.status(404).send({status:false,message:"หาข้อมูลไม่เจอ partner"})
        }
        return res.status(200).send(partnerdata)
    }
    catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})

//เรียกข้อมูลการอนุมัติ
router.get('/approve/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id
        const partnerdata = await Partner.find({approve:id})

        if(!partnerdata){
            return res.status(404).send({status:false,message:"หาข้อมูลไม่เจอ partner"})
        }
        return res.status(200).send(partnerdata)
    }
    catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})

//อนุมัติ ข้อมูลการเป็นpartner
router.put('/approve/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id
        const approvepartner = await Partner.findByIdAndUpdate(id,{approve:"อนุมัติ"},{ new: true })
        if(!approvepartner){
            return res.status(404).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล partner"})
        }
        return res.status(200).send({status:true,message:`ข้อมูล ${approvepartner.name} ได้รับการอนุมัติ`,update:approvepartner})

    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})

//ไม่อนุมัติ ข้อมูลการเป็นpartner
router.put('/unapprove/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id
        const approvepartner = await Partner.findByIdAndUpdate(id,{approve:"ไม่อนุมัติ"},{ new: true })
        if(!approvepartner){
            return res.status(404).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล partner"})
        }
        return res.status(200).send({status:true,message:`ข้อมูล ${approvepartner.name} ไม่ได้รับอนุมัติ`,update:approvepartner})

    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})

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

//แก้ไขข้อมูล partner
router.put('/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id
        const telephone = req.body.telephone
        //เช็คเลขซ้ำ

        const checkofpartner = await Partner.findOne({telephone:telephone})
        //ถ้าหา เบอร์โทรศัพท์ เหมือนกับที่ ส่งมาแสดงว่าตัวเดียวกัน
        if(telephone != checkofpartner.telephone)
        {
            const Check = await Checktelephone(telephone).then((status)=>{return status})
            if(Check === true){
                return res.status(400).send({status:false,message:`เบอร์ ${telephone} ซ้ำ กรุณาเปลี่ยนใหม่`})
            }
        }
        const password = req.body.password
        const name = req.body.name
        const companyname = req.body.companyname
        const level = req.body.level
        const approve = req.body.approve
        if(!telephone||!password||!name||!companyname||!level||!approve){
            return res.status(400).send({status:false,message:'คุณส่งข้อมูล partner มาไม่ครบ'})
        }
        const partnerdata = {
            telephone: telephone,
            password :password,
            name : name,
            companyname: companyname,
            level : level,
            approve: approve 
        }
        const editpartner = await Partner.findByIdAndUpdate(id,partnerdata,{ new: true })
        if(!editpartner){
            return res.status(404).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล partner"})
        }
        return res.status(200).send({status:true,message:`อัพเดทข้อมูล ${editpartner.name} สำเร็จ`,update:editpartner})

    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})


router.delete('/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id
        const checkofpartner = await Partner.findOne({_id:id})
        if(!checkofpartner)
        {
            return res.status(404).send({status:false,message:"หาข้อมูลไม่เจอ partner"})
        }
        const deletepartner = await Partner.deleteOne({_id:id})
        if(deletepartner){
            return res.status(200).send({status:true,message:"ลบข้อมูล partner สำเร็จ"})
        }
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})




module.exports = router;