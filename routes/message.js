var express = require('express');
var router = express.Router();
var adminAuth = require('../authentication/adminAuth');

//ยังไม่ได้ใช้
//send message
router.post('/message',adminAuth,(req,res)=>{
    var axios = require('axios');
var config = {
    method: 'post',
    url: 'https://portal-otp.smsmkt.com/api/send-message',
    headers: {
        "Content-Type":"application/json",
        "api_key":process.env.MESSAGE_API_KEY,
        "secret_key":process.env.MESSAGE_API_SECRET,
    },
    data:JSON.stringify({
        "message":req.body.message,
        "phone":req.body.phone_number,
        "sender":"admin",
        "send_date":new Date().toLocaleDateString(),
        "url":"",
        "campaign_name":req.body.campaign_name,
        "expire":"10:00",
    })
};
axios(config).then(function (response) {
    console.log(JSON.stringify(response.data));
    }).catch(function (error) {
        console.log(error);
    });
})


//send OTP

router.post('/OTP',adminAuth,(req,res)=>{

    var axios = require('axios');
    var config = {
        method: 'post',
        url: 'https://portal-otp.smsmkt.com/api/otp-send',
        headers: {
            "Content-Type":"application/json",
            "api_key":process.env.MESSAGE_API_KEY,
            "secret_key":process.env.MESSAGE_API_SECRET,
        },
        data:JSON.stringify({
            "project_key":process.env.MESSAGE_API_PROJECT_KEY,
            "phone":req.body.phone,
          
        })
    };
    axios(config).then(function (response) {
        if(response.data.code !=="000"){
            return res.send({status:false,error:response.data});
        }
        return res.send({status:true,data:response.data});
    }).catch(function (error) {
        return res.status(500).send({status:false,error:error.message})
    });

})


//Authentication
router.post('/OTP-AUTHENTICATE',adminAuth,(req,res)=>{
    var axios = require('axios');
var config = {
    method: 'post',
    url: 'https://portal-otp.smsmkt.com/api/otp-validate',
    headers: {
        "Content-Type":"application/json",
        "api_key":process.env.MESSAGE_API_KEY,
        "secret_key":process.env.MESSAGE_API_SECRET,
    },
    data:JSON.stringify({
        "token":req.body.token,
        "otp_code":req.body.otp_code,
       
    })
};
axios(config).then(function (response) {
    return res.send({status:true,data:response.data});
}).catch(function (error) {
    return res.status(500).send({status:false,error:error.message});
});
})

module.exports = router;