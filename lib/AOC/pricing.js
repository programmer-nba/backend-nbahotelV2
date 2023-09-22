async function AOCpricing (req,res,access){
    //AOC Pricing API

    const axios = require('axios');
    
    let data = JSON.stringify({
    "pgSearchOID": req.body.pgSearchOID,
    "tripType": req.body.tripType,
    "origin": req.body.origin,
    "destination": req.body.destination,
    "adult": req.body.adult,
    "child": req.body.child,
    "infant": req.body.infant,
    "svcClass": req.body.svcClass,
    "S1": req.body.S1,
    "S2": req.body.S2,
    "bMultiTicket_Fare": req.body.bMultiTicket_Fare,
    "languageCode": req.body.languageCode
    });

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.AOC_URL}/FlightMultiTicketPricing`,
    headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${access}`, 
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
        return res.status(200).send({massage:"Pricing Successful",data:response.data})
    })
    .catch((error) => {
    console.log(error);
    return res.status(403).send({message:"ERORR Pricing",error:error})
    });

    //END AOC Pricing API

    }

    module.exports = {AOCpricing}