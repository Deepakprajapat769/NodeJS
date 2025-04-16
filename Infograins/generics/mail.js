// utils/mail.js

const nodemailer = require("nodemailer");

const sendVerificationEmail = async (to, token) => {
  const transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    service:"gmail",
    secure:true,
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: "Account Verification",
    text: `Click this link to verify your account: ${process.env.BASE_URL}/auth/verify/${token}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return reject(err);
      }
      console.log(info)
      resolve(info);
    });
  });
};

module.exports = {
  sendVerificationEmail,
};
