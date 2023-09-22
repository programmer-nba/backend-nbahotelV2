var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const {Partner} = require('../models/partner.schema');

module.exports.GetAll = async (req,res) => {
    try {
        const partner = await Partner.find();
        if(!partner){
            return res.status(404).send({message:'No partner found'});
        }
        return res.status(200).send(partner);

    } catch (error) {
        return res.status(500).send(error.message);
    }
}

//get by id
module.exports.GetById = async (req,res) => {
    const id = req.params.id;
    try {

        const partner = await Partner.findById(id);
        if(!partner){
            return res.status(404).send({message:'No partner found'});
        }
        return res.status(200).send(partner);
        
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


module.exports.Create = async (req,res) =>{


try {
            
            const data = {
                name:req.body.name,
                companyname:req.body.company,
                tel:req.body.tel,
                webhook:req.body.domainname,
            }

            const partner = new Partner(data);
            partner.save(async (err,data) =>{
                if(err){
                    return res.status(500).send(err.message);
                }

                //update partner data
                const {privateKey,publicKey} = crypto.generateKeyPairSync('ec',{
                    namedCurve:'sect239k1'
                });

                //gennerate  a signature of the payload
                const sign = crypto.createSign('SHA256');
                sign.write(`${req.body.domain}`);
                sign.end();
    
                var signature = sign.sign(privateKey,'hex');
    
                //sign payload (some partner ablilty)
                const payload ={
                    partner_id: data._id,
      
                    company:req.body.company,

                    signature:signature,
                    role:'APIPARTNER'
                }
    
                const secret = process.env.SECRET_KEY
                const token = jwt.sign(payload,secret)

                await Partner.findByIdAndUpdate(data._id,{token:token})
                
                return res.status(200).send(data);
            })

        } catch (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }

    }
