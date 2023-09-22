const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next)=>{
    const token = req.headers['token'];
    const id = req.params.id;



    if(!token){
        return res.status(401).send({status: false, message: "Unauthorized"})
    }
    try{

        jwt.verify(token,process.env.NBA_AUTH_API_SECRET,(err,decoded)=>{


            if(err){

                
                const decoded = jwt.verify(token, `${process.env.SECRET_KEY}`);

                       
                if( req.method ==='GET' && decoded.level.includes('ROLE_PARTNER') && id === decoded.service_id ){
                    next();
                }
                else if((req.method === 'POST' && decoded.level.includes('ROLE_PARTNER') && (decoded.id === req.body.host_id || id === decoded.service_id))){
                    
                    next();
                }
                else if((req.method === 'PATCH' && decoded.level.includes('ROLE_PARTNER') && (decoded.id === req.params.userId || id === decoded.service_id))){
                    next();
                }
                else if((req.method === 'DELETE' && decoded.level.includes('ROLE_PARTNER') && ( id === decoded.service_id))){
                    next();
                }
                else{
  
                    return res.status(403).send('Unauthorized');
                }

            }
                else if( decoded && decoded.level==='admin'){
                    next();
                }
                else{
                    return res.status(403).send('Unauthorized');
                }
        })

    }catch(err){
        return res.status(401).send("Unauthorized")
    }

}

module.exports = verifyToken;