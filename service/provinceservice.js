const province = require('./src/province.json');

module.exports.getProvince = (req,res)=>{
    console.log(province);
    return res.send(province);
}