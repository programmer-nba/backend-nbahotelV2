var express = require('express');
var router = express.Router();
var axios = require('axios');
var formidable = require('formidable'),
  util = require('util');
  const { Storage } = require('megajs');
var fs = require('fs');
const checkType = require('../functions/check-mimetype');
const FormData = require('form-data');


/* GET home page. */
router.post('/', function (req, res, next) {

  console.log('upload in process:\n\n');

  var form = new formidable.IncomingForm();

  form.parse(req, async function (err, fields, files) {
    if (err) {

      // Check for and handle any errors here.
      console.error(err.message);
      return;
    }

    const buffer = fs.readFileSync(files.pic.filepath);
    const data = buffer.toString('base64');

    console.log(data);

    //axios 
    const api_key = '67601a7fd53632f7c4131a6ed83274fe';
    const url = `https://api.imgbb.com/1/upload?expiration=600&key=${api_key}`;

    const formdata = new FormData();
    formdata.append('image',data);

    const config = {
      method:'post',
      url:url,
      data:formdata,
      redirect:'follow'
    }
    await axios.post(config).then((response)=>{
      console.log(response);
      return res.send(response);
    })
    .catch((error)=>{
      return res.send(error);
    })

  });
  return;

});

module.exports = router;