import asyncHandler from "express-async-handler";
import twilio from "twilio";

const client = new twilio(
  "ACf1a2dac689f76091adc627ca404c3699",
  "b406b67fec39064923311c951bee8396"
);
const sendSMS = asyncHandler(async (req, res) => {
  const { number } = req.body;
  client.verify.v2
    .services("VAe2e2008db7ec70d23cd2a7cc3245b4db")
    .verifications.create({ to: number, channel: "sms" })
    .then((verification) => {
      console.log(verification.status);
      res.status(200);
      res.json({ message: "message send sucessfully" });
    })
    .catch((err) => {
      throw new Error("Message could not be send");
    });
  //   client.messages
  //     .create({
  //       body: "Hello from Node",
  //       to: number, // Text this number
  //       from: "+1 937 966 6165", // From a valid Twilio number
  //     })
  //     .then((message) => {
  //       console.log(message.sid);
  //       res.status(200);
  //       res.json({ message: "message send sucessfully" });
  //     })
  //     .catch((err) => {
  //       throw new Error("Message could not be send");
  //     });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { number, OTPcode } = req.body;

  client.verify.v2
    .services("VAe2e2008db7ec70d23cd2a7cc3245b4db")
    .verificationChecks.create({ to: number, code: OTPcode })
    .then((verification_check) => {
      console.log(verification_check.status);
      res.status(200);
      res.json(verification_check);
    })
    .catch((err) => {
      throw new Error("OTP Did not match");
    });
});

export { sendSMS, verifyOtp };
