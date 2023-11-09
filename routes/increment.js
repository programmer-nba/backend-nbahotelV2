var express = require('express');
var router = express.Router();
const Increment = require('../models/increment.schema');

//ยังไม่ได้ใช้
router.post('/',async (req,res) => {
    try {
        
    
    const increment =  new Increment({name:req.body.name});

    increment.pre('save',()=>{
        
    })
  const add = await increment.save()
  return res.status(200).send(add)
} catch (error) {
        return res.status(500).send(error);
}
})



module.exports = router;