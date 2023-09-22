async function AOCaddtoken (res){

            const {AuthSessionSchema} = require("../../models/modelsAOC/authentication.session.schenma");            

            const axios = require('axios');
            let data = JSON.stringify({
            "username": process.env.AOC_USERNAME,
            "password": process.env.AOC_PASSWORD,
            "grantType": process.env.AOC_GRANTTYPE
            });

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${process.env.AOC_URL}/Token`,
  headers: { 
    'Content-Type': 'application/json', 
  },
  data : data
  };

  var responsedata ;
  
  axios.request(config)
  .then(response => {
  //save token to database
  const tokendata = {
        ...response.data,
        tokenname:process.env.AOC_TOKENNAME
  }
  const authsession = new AuthSessionSchema(tokendata);
  authsession.save((errors,data)=>{
    if(errors){
        return res.status(403).send({message:"บันทึกไม่สำเร็จ",errors:errors})
    }
    responsedata = data
  })
  
})
.catch((error) => {
  console.log(error);
  return res.status(403).send({message:"403",error:error})
});

return responsedata

}

module.exports = {AOCaddtoken}