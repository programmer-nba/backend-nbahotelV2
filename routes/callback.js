var express = require('express');
var router = express.Router();
const {Partner} = require('../models/partner.schema') // api partner

router.post('/',async (req,res) => {

    var axios = require('axios');

    const partner = await Partner.distinct('webhook');
    
    console.log(partner);
    const data = {
        name:req.body.name.slice(0,100),
        description:req.body.description.slice(0,100)
    }
    console.log('body',data);

    partner.forEach(el=>{

        var config = {
            method: 'post',
            url: `https://${el}/callback`,
            headers: {
                "Content-Type":"application/json",
            },
            data:JSON.stringify(data)
        };
        axios(config).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.log(error.message);
        });
    })

        res.send('webhook send');
})

module.exports = router;