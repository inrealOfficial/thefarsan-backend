import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import orderShipped from "../Templates/orderShipped.js";

const sendAnCustomEmail = asyncHandler(async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@thefarsan.in", // generated ethereal user
      pass: "Thefarsan@info", // generated ethereal password
    },
  });
  let info = await transporter.sendMail(
    {
      from: '"The Farsan" <info@thefarsan.in>', // sender address
      to: `gurdevsinghkandhari@gmail.com`, // list of receivers
      subject: `Order Sucessfully Shipped #ORD62e50262ca8826612492fcd0`, // Subject line
      text: "Hello", // plain text body
      html: `${orderShipped}`, // html body
    },
    (err, info) => {
      if (err) {
        return console.log(err);
      } else {
        res.status(201);
        res.json({ message: "Email send" });
        console.log("Message sent: %s", info.messageId);
      }
    }
  );
});

export { sendAnCustomEmail };
