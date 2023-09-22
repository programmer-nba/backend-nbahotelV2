"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function Sendmail(address,password){

    try {
    
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'mohammad42@ethereal.email',
        pass: 'g53cVQMDUKVK3yTkT7'
    }
});

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Admin" <nba@adminnba.com>', // sender address
    to: address, // list of receivers
    subject: "Welcome Admin", // Subject line
    text: `
    Congratulation You have acepted to be an admin of nba hotel

    Email:${address}
    Password: ${password} 
    
    Please change your password after received this email`, // plain text body
    html:
     `
    <h1>Congratulation</h1> 
    <p>You have acepted to be an admin of nba hotel</p>
    <div>
    <p>email:${address}</p>
    <p>password: ${password} </p>
    </div>
    <p>Please change your password after received this email</p>

    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

} catch (error) {
    console.log(error);
}
}


module.exports = Sendmail;