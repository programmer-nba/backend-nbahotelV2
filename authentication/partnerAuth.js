const jwt = require('jsonwebtoken');

//เช็ค token partner
verifyTokenpartner = async (req,res,next) => {
    try{

        let token = req.headers["token"]
        let secret = req.headers["secret"]
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'token หมดอายุ'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  await jwt.verify(token,secret)
        if(decoded.roles === "partner" || decoded.roles ==="admin"){
            req.users = decoded.data
            next();
        }else{
            res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
        
        
    }catch (err){
        console.log(err)
        return res.status(500).send({error:err})
    }
};

const authpartner = {
    verifyTokenpartner
};

module.exports = authpartner;