import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import smsRoutes from "./routes/smsRoutes.js";
import couponRoutes from "./routes/couponsRoutes.js";
import deliveryAdressRoutes from "./routes/deliveryAdressRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import Razorpay from "razorpay";
import path from "path";
import nodemailer from "nodemailer";
import twilio from "twilio";

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
// ** MIDDLEWARE ** //
// const whitelist = ["http://localhost:3000", "https://thefarsan.in"];
// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log("** Origin of request " + origin);
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       console.log("Origin acceptable");
//       callback(null, true);
//     } else {
//       console.log("Origin rejected");
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

app.post("/send", async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "ankita@thefarsan.in", // generated ethereal user
      pass: "Ankita@03", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail(
    {
      from: '"Ankita Malik" <ankita@thefarsan.in>', // sender address
      to: "aryan23062001@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world? ", // plain text body
      html: "<b>Hello world?</b>", // html body
    },
    (err, info) => {
      if (err) {
        return console.log(err);
      } else {
        console.log("Message sent: %s", info.messageId);
      }
    }
  );
});
// app.use(cors(corsOptions));
app.use("/api/sms", smsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery", deliveryAdressRoutes);
app.use("/api/coupons", couponRoutes);
app.get("/api/config/razorpay", (req, res) =>
  res.send(process.env.RAZORPAY_KEY_ID)
);
app.post("/api/create-order", async (req, res) => {
  const { amount, receipt } = req.body;
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: amount + "00",
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    if (order) {
      res.send(order);
    } else {
      res.status(500);
      res.send("There was some error");
    }
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

app.get("/", (req, res) => {
  res.send("Api is running");
});
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(
  process.env.PORT || 5000,
  console.log("Server running on port 5000")
);
