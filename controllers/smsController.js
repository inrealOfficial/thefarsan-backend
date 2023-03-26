import asyncHandler from "express-async-handler";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = new twilio(process.env.AUTH_ID, process.env.AUTH_TOKEN);
const sendSMS = asyncHandler(async (req, res) => {
  const { number } = req.body;
  client.verify.v2
    .services("VAe2e2008db7ec70d23cd2a7cc3245b4db")
    .verifications.create({ to: number, channel: "sms" })
    .then((verification) => {
      res.status(200);
      res.json(verification);
    })
    .catch((err) => {
      throw new Error("Message could not be send");
    });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { number, OTPcode } = req.body;
  try {
    const value = await client.verify.v2
      .services("VAe2e2008db7ec70d23cd2a7cc3245b4db")
      .verificationChecks.create({ to: number, code: OTPcode });
    if (value.status === "approved") {
      res.status(200);
      res.json({ message: "phone number approved" });
    } else {
      res.status(400);
      throw new Error("Invalid OTP");
    }
  } catch (error) {
    res.status(400);
    throw new Error("There was some error");
  }
});

export { sendSMS, verifyOtp };
