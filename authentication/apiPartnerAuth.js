var jwt = require('jsonwebtoken');

const apiPartnerAuth = async (req,res,next) =>{

    const token = req.headers['token'];

    if(!token){
        return res.status(401).send('ไม่ได้ส่ง token');
    }

    jwt.verify(token,process.env.NBA_AUTH_API_SECRET,(err,decoded)=>{

        if(decoded && decoded.level === 'admin'){
            console.log('admin access')
            next();
        }
        if(err){
            
            jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
                if(err){
    
                    switch (err.name) {
                        case "JsonWebTokenError":
                            
                           return res.status(406).send(err.message);
                    
                        default:
                          return res.status(406).send(err.message);
                    }
                    
                }
         
                if(decoded.role !== 'APIPARTNER'){
                    return res.status(403).send({message:'ไม่มีสิทธิเข้าถึง'});
                }
            next();
            })
        }
    })

    
}

module.exports = apiPartnerAuth;