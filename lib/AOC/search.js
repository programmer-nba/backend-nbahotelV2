async function AOCsearch (req,res,access){
   //AOC Search API
   const axios = require('axios');
     
   let data = JSON.stringify({
       "tripType": req.body.tripType,
       "originCode": req.body.originCode,
       "destinationCode": req.body.destinationCode,
       "svcClass": req.body.svcClass,
       "directFlight": req.body.directFlight,
       "departDate": req.body.departDate,
       "returnDate": req.body.returnDate,
       "adult": req.body.adult,
       "child": req.body.child,
       "infant": req.body.infant,
       "languageCode": req.body.languageCode
     });

     let config = {
       method: 'post',
       maxBodyLength: Infinity,
       url: `${process.env.AOC_URL}/FlightSearchMultiTicket`,
       headers: { 
         'Content-Type': 'application/json', 
         'Authorization': `Bearer ${access}`, 
       },
       data : data
     };

    //  console.log ("access",access)

     let responsedata = {};
    await axios.request(config)
    .then(response => {
    const pgSearchOID = response.data.pgSearchOID;
    const mappedData = response.data.flights.map(flight => {
    const Details = (flight.Flight_SegRef1 || flight.Flight_SegRef2 || []).map(segment => {
      const flightDetail = segment.flightDetails[0]; // Assuming there's only one flight detail object
      //  console.log(flightDetail);
      return {
        refNumber: segment.refNumber,
        bookingCode: segment.bookingCode,
        depDisplayDateTime: flightDetail.departureDateTime,
        operatedAirline: flightDetail.operatedAirline,
        totaltime: segment.totalTime,
        timedep: flightDetail.depDisplayDateTime?.displayTime,
        depcity: flight.depCity,
        depCityname: flightDetail.depCity?.name,
        timearr: flightDetail.arrDisplayDateTime?.displayTime,
        arrcity: flight.arrCity,
        arrcityname: flightDetail.arrCity?.name,
      };
      
    });
    return {
      mainAirline: flight.mainAirline,
      depCity: flight.depCity,
      arrcity: flight.arrCity,
      Details,
      strikethroughTotalPrice: flight.fare.strikethroughTotalPrice,
      promotionText: flight.discountTag.promotionText,
      totalPrice: flight.fare.total,
      price: flight.price,
    };
  });
  
  //   response.data.flights.forEach(element => {
  //   element.price+=500;
  //    newresponsedata.push(element);
     
  //  });
 
      return res.status(200).send({message:"Search Successful",pgSearchOID,data:mappedData})

     })

     .catch((error) => {
       console.log(error);
       return res.status(403).send({message:"ERORR Search",errors:error})
     });
     return responsedata
     //END AOC Search API
}


module.exports = {AOCsearch}