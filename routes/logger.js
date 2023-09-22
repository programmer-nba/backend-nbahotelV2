var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
var adminAuth = require('../authentication/adminAuth');

router.get('/',adminAuth,async (req,res)=>{
    const logger_path = path.join(__dirname,'../log/access.log');
    fs.readFile(logger_path, 'utf8', function (err,result){
        if(err){
            return res.status(500).send(err.message);
        }
        res.status(200).send(result);
    })
});



module.exports = router;