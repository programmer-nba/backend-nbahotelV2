const Invitation = require('../models/invitation.schema');
const Admin = require('../models/admin.schema');
const Role = require('../models/role.schema');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const sendmail = require('../functions/nodemailer');

module.exports.Create = async (req,res) =>{

    const role = await Role.findOne({name:req.body.role});
    if(!role){
        return res.status(404).send('Role not found');
    }

    var signature = process.env.INVITATION_SIGNATURE

    //payload
    const payload = {
        email:req.body.email,
        role:req.body.role,
    }

    const token = jwt.sign(payload,signature,{expiresIn:"1d"});

    try {
        const data = {
            email:req.body.email,
            role:req.body.role,
            invitationKey:token
        }

        const invitation = new Invitation(data);
        invitation.save((err,result)=>{
            if(err){
                return res.status(500).send({message:err});
            }
            return res.send(result);
        });

    } catch (error) {
        res.status(500).send({message:error});
    }
}

module.exports.Recieve = async (req,res) =>{
    const key = req.query.invitation_key;
    const secret = process.env.INVITATION_SECRET;
    if(!key){
        return res.satus(304).send("Not Authenticated")
    }
    else{

        jwt.verify(key,secret,async (err,decoded)=>{
            if(err){
                return res.status(500).send({message:err});

            }

            const currentAdmin = await Admin.findOne({email:decoded.email});

            if(currentAdmin){
                return res.send({message:`${currentAdmin.email} is already registered`});
            }

            const role_id = await Role.findOne({roles:decoded.role});
            const password = crypto.randomBytes(16).toString('hex');

            const {privateKey,publicKey} = crypto.generateKeyPairSync('ec',{
                namedCurve:'sect239k1'
            });
            //gennerate  a signature of the payload
            const sign = crypto.createSign('SHA256');
            sign.write(`${decoded.email}`);
            sign.end();

            var signature = sign.sign(privateKey,'hex');

            //sign payload (some admin ablilty)
            const payload ={
                email:decoded.email,
                role:decoded.role,
                signature:signature,
            }

            const token = jwt.sign(payload,secret)

            const data = {
                "email": decoded.email,
                "roles": [role_id._id],
                "password": bcrypt.hashSync(password,10),
                "token":token,  
                "signature":signature          
            }

            console.log(data);
            const admin= new Admin(data);

            admin.save((err,admin)=>{
                if(err){
                    return res.status(500).send({message:err});
                }
                sendmail(decoded.email,password)
                return res.status(200).send(admin);
            })
        })
    }

}