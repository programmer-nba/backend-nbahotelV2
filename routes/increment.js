var express = require('express');
var router = express.Router();
const Increment = require('../models/increment.schema');

router.post('/',async (req,res) => {
    try {
        
    
    const increment =  new Increment({name:req.body.name});

    increment.pre('save',()=>{
        
    })
  increment.save((err,data)=>{
    if(err){
        return res.status(500).send(err);
    }
    return res.status(200).send(data);

  });
       
} catch (error) {
        return res.status(500).send(error);
}
})



module.exports = router;