const nodemailer = require("nodemailer");

const sendemail = async (option) => {
  console.log(option.to);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  let message = {
    from: process.env.SMTP_NAME, // sender address
    to: option.to, // list of receivers
    subject: option.subject, // Subject line
    text: option.text, // plain text body
  };

  const info = await transporter.sendMail(message);
};

module.exports = sendemail;
