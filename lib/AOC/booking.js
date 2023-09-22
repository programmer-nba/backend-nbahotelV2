async function AOCbooking (req,res,access){
    //AOC Booking API

    const axios = require('axios');

    let data = JSON.stringify({
            "adtFare": req.body.adtFare,
            "chdFare": req.body.chdFare,
            "infFare": req.body.infFare,
            "depFlight": req.body.depFlight,
            "retFlight": req.body.retFlight,
            "multiFlight": req.body.multiFlight,
            "origin": req.body.origin,
            "destination": req.body.destination,
            "noOfAdults": req.body.noOfAdults,
            "noOfChildren": req.body.noOfChildren,
            "noOfInfants": req.body.noOfInfants,
            "svc_class": req.body.svc_class,
            "grandTotal": req.body.grandTotal,
            "refund": req.body.refund,
            "reissue": req.body.reissue,
            "isPassportRequired": req.body.isPassportRequired,
            "PNR": req.body.PNR,
            "iRoute": req.body.iRoute,
            "TransactionID": req.body.TransactionID,
            "bookingURN": req.body.bookingURN,
            "promotionGroupCode": req.body.promotionGroupCode,
            "statusPayment": req.body.statusPayment,
            "paymentMethod": req.body.paymentMethod,
            "paymentDate": req.body.paymentDate,
            "statusBooking": req.body.statusBooking,
            "paymentType": req.body.paymentType,
            "paymentValue": req.body.paymentValue,
            "bookingOID": req.body.bookingOID,
            "contactInfo": req.body.contactInfo,
            "adtPaxs": req.body.adtPaxs,
            "chdPaxs": req.body.chdPaxs,
            "infPaxs": req.body.infPaxs,
            "isPricingWithSegment": req.body.isPricingWithSegment,
            "bookingDate": req.body.bookingDate,
            "remarks": req.body.remarks,
            "sourceBy": req.body.sourceBy,
            "totalFare": req.body.totalFare,
            "totalCommission": req.body.totalCommission,
            "fareRules": req.body.fareRules,
            "isError": req.body.isError,
            "errorCode": req.body.errorCode,
            "errorMessage": req.body.errorMessage,
            "uuid": req.body.uuid,
            "userID": req.body.userID,
            "memberOID": req.body.memberOID,
            "source": req.body.source,
            "installmentMonthlyPaid": req.body.installmentMonthlyPaid,
            "installmentPlan": req.body.installmentPlan,
            "finalPrice": req.body.finalPrice,
            "promotionCode": req.body.promotionCode,
            "promotionName": req.body.promotionName,
            "promotionDiscount": req.body.promotionDiscount,
            "corporateCode": req.body.corporateCode,
            "isDomestic": req.body.isDomestic,
            "isTicketedComplete": req.body.isTicketedComplete,
            "TicketedDateTime": req.body.TicketedDateTime,
            "FlightBookingItineraryOID": req.body.FlightBookingItineraryOID,
            "pgSearchOID": req.body.pgSearchOID
        

    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.AOC_URL}/FlightBooking`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`,
        },
        data : data
    };

    axios.request(config)
    .then((response) => {
        return res.status(200).send({massage:"Booking Successful",data:response.data})
    })
    .catch((error) => {
    console.log(error);
    return res.status(403).send({message:"ERORR Booking",error:error})
    });
    //END AOC Booking API
}

module.exports = {AOCbooking}