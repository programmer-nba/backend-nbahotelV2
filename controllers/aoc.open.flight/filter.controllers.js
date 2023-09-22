const CountryCode = require('../../models/modelsAOC/authentication.countrycode.schema');
const AirportCode = require('../../models/modelsAOC/authentication.airportcode.schema');
const CityCode = require('../../models/modelsAOC/authentication.citycode.schema');
const AirlineCode = require('../../models/modelsAOC/authentication.airlinecode.schema');
const AirportInfo = require('../../models/modelsAOC/authentication.airportinfo.schema');

const fs = require('fs');
const multer = require('multer');
const {google} = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN});
const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
});

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// API Get Countrycode
module.exports.countrycode = async(req, res) => {
    try{
        const countryCode = await CountryCode.find({Language:req.params.language});
        if(countryCode.length > 0){
            return res.status(200).send(countryCode);
        }
    }catch (error) {
        // console.error(error);
        return res.status(500).send({message:error.message})
    }
}// END API Get Countrycode

// API Update Citycode
module.exports.updatecitycode = (req,res) => {
    try {
        const query = {$and:[{Code:req.params.code},{Language:req.query.language}] }
        const data = {
            Name: req.body.Name,
        }
        
    CityCode.findOneAndUpdate(query,
    data,
    {returnDocument:'after'},
     (error,result) => {
        if(error){
            return res.status(403).send({message:error.message});
        }
           return res.send(result);
    })
        } catch (error) {
            console.error("error",error)
    return res.status(403).send({message:error.message});
}
}// END API Update Citycode

// API Get Airportcode
module.exports.airportcode = async(req, res) => {
    try{

        const airportCode = await AirportCode.find({$and:[{CountryCode:req.params.countrycode},{Language:req.query.language}]})
        if(airportCode.length > 0){
            return res.status(200).send(airportCode);
        }
    }catch (error) {
        console.error(error);
        return res.status(500).send({message:error.message})
    }
}// END API Get Airportcode

// API Update Airportcode
module.exports.updateairportcode  = (req,res) => {
    try {
        const query = {$and:[{Code:req.params.code},{Language:req.query.language}]}
        const data = {
            Name: req.body.Name,
        }
    AirportCode.findOneAndUpdate(query,
    data,
    {returnDocument:'after'},
    (error,result) => {
            if(error){
                return res.status(403).send({message:error.message});
            }
                return res.send(result);
        })
    }catch (error){
        console.error("error",error)
        return res.status(403).send({message:error.message});
}
}
//END API Update Airportcode

// API Get Citycode
module.exports.citycode = async(req, res) => {
    try{
        
        const cityCode = await CityCode.find({$and:[{CountryCode:req.params.countrycode},{Language:req.query.language}]});
        if(cityCode.length > 0){
            return res.status(200).send(cityCode);
        }
    }catch (error) {
         console.error(error);
        return res.status(500).send({message:error.message})
    }
}// END API Get Citycode

// API Get AirlineCode
module.exports.airlinecode = async(req, res) => {
    try{
        const airlineCode = await AirlineCode.find();
        if(airlineCode.length > 0){
            return res.status(200).send(airlineCode);
        }
    }catch (error){
        console.error(error);
        return res.status(500).send({message:error.message})
    }
}// END API Get AirlineCode

// API Update AirlineCode
module.exports.updateairline = async (req, res) => {
    try {

        let upload = multer({ storage:storage }).array("imgAirline", 20);
        upload(req, res, async function (err){
 
            if (err) {
                console.log(err)
                return res.status(403).send({ message: "มีบางอย่างผิดพลาด", err:err});
            } 
            const reqFiles = [];
            
            if (!req.files){
                return res.status(500).send({ message: "มีบางอย่างผิดพลาด",data: 'NO Request Files', status: false});
            }else{
          
                for (var i = 0; i < req.files.length; i++){
                    await uploadFileCreate(req.files, res, {i, reqFiles});
                }

            const query = {
                Code:req.params.code
            }

            const data = {
                imageUrl: reqFiles[0],
                Nameth: req.body.Nameth
            }

            if(reqFiles.length>0){

            

            AirlineCode.findOneAndUpdate(query,data,{returnDocument: 'after'},(err, result) =>{
                if (err) {

                    return res.status(403).send({ message: 'อัพเดทรูปภาพไม่สำเร็จ', err:err})
                }else{
                return res.status(200).send({
                    message: 'อัพเดทรูปภาพแล้วละ', 
                    data: {
                        imageUrl: result.imageUrl,
                        Nameth: result.Nameth
                    }
                })
            }
            })
        }
            
            }
        });
    }catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error"});
    }
}// END API Update AirlineCode

// API GET Airport info
module.exports.airportinfo = async(req,res) => {
    try{
        const airportInfo = await AirportInfo.find();
        if(airportInfo.length > 0){
            return res.status(200).send(airportInfo);
        }
    }catch (error){
        console.error(error);
        return res.status(500).send({message:error.message})
    }
}
// END API GET Airport info

//Update image
async function uploadFileCreate(req, res, { i, reqFiles }) {
    const filePath = req[i].path;
    let fileMetaData = {
      name: req.originalname,
      parents: [process.env.GOOGLE_DRIVE_AOC],
    };
    let media = {
      body: fs.createReadStream(filePath),
    };
    try {
      const response = await drive.files.create({
        resource: fileMetaData,
        media: media,
      });
      generatePublicUrl(response.data.id);
      reqFiles.push(response.data.id);
  
    } catch (error) {
        console.error(error);
      return res.status(500).send({ message: "Google drive Error" });
    }
  }
  async function generatePublicUrl(res) {
    console.log("generatePublicUrl");
    try {
      const fileId = res;
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
      const result = await drive.files.get({
        fileId: fileId,
        fields: "webViewLink, webContentLink",
      });
      console.log(result.data);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
//END Update image