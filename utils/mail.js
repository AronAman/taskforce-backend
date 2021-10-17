const nodemailer = require('nodemailer');


let transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});


const sendMail = (to, subject, html) => {
  const options = {
    from: 'process.env.EMAIL_USERNAME',
    to,
    subject,
    html
  };

  transport.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    }
    // console.log('Email sent:', info)
    return info;
  });
};


module.exports = sendMail;