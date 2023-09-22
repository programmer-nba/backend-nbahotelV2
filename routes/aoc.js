var express = require('express');
var router = express.Router();
const AocAPISearch = require('../controllers/aoc.open.flight/flightsearchmultiticket.controllers');
const AocAPIPricing = require('../controllers/aoc.open.flight/pricingmuktiticket.controllers');
const AocAPIFilter = require('../controllers/aoc.open.flight/filter.controllers');
const AocAPIBooking = require('../controllers/aoc.open.flight/bookingservice.controllers');

router.post('/search',AocAPISearch.search);
router.post('/pricing',AocAPIPricing.pricing);
router.post('/booking',AocAPIBooking.booking);
router.get('/countrycode/:language',AocAPIFilter.countrycode);
router.get('/citycode/:countrycode',AocAPIFilter.citycode);
router.get('/airportcode/:countrycode',AocAPIFilter.airportcode);
router.get('/airlinecode',AocAPIFilter.airlinecode);
router.get('/airportinfo',AocAPIFilter.airportinfo);
router.put('/updatecitycode/:code',AocAPIFilter.updatecitycode);
router.put('/updateairportcode/:code',AocAPIFilter.updateairportcode);
router.put('/updateairline/:code',AocAPIFilter.updateairline);


module.exports = router 