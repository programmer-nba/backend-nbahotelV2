var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const Admin = require('../models/admin.schema');
var dayjs = require("dayjs");

module.exports.SignIn = (req, res) => {

    try {


        Admin.findOne({ email: req.body.email }, null, (err, admin) => {
            if (err) {
                return res.status(500).send({ error: err });
            }

            if (admin) {
                //match password
                bcrypt.compare(req.body.password, admin.password, (err, isMatch) => {
                    if (err) {
                        return res.send({ error: 'password mismatch' });
                    }
                    if (isMatch) {
                        //check token
                        const token = admin.token;
                        const secret = admin.signature;
                        jwt.verify(token, secret, (err, decoded) => {
                            if (err) {

                               return res.status(401).send({ message: "Unauthorized!" });
                            }
                            
                          return res.render('admin.jade',{title:"NBA hotel",email:decoded.email,token:token});
                    
                        })
                    }
                })
            }
            else{
                return res.status(404).send(`no admin found`);
            }
        })

    } catch (error) {
        return res.status(500).send({ error: error });
    }

}

exports.createAdmin = (req, res) => {
    try {
        const data = {
            username: req.body.username,
            password: req.body.password,
            roles: req.body.roles,
            timestamps: req.body.timestamps
        }
        const new_admin = new Admin(data);
        new_admin.save();
        if (new_admin) {
            console.log(new_admin);
        } else {
            console.log('Error')
        }
    } catch (error) {
        console.log(error)
    }
}