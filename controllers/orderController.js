import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAdress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAdress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    let transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "ankita@thefarsan.in", // generated ethereal user
        pass: "Ankita@03", // generated ethereal password
      },
    });

    const createdOrder = await order.save();
    const userDetails = await User.findById(req.user._id).select("-password");
    // send mail with defined transport object
    let info = await transporter.sendMail(
      {
        from: '"Ankita Malik" <ankita@thefarsan.in>', // sender address
        to: `${userDetails.email}`, // list of receivers
        subject: "Order Sucessfull", // Subject line
        text: "Hello", // plain text body
        html: ` <h2>Hi ${userDetails.name}</h2>
        <h2>
          Thank you for choosing Farsan. This email contains important information
          about your order. Please save it for future reference.
        </h2>
        <div>
          <a href="https://thefarsan.in/"
            ><img
              style="width: 20em"
              src="https://i.ibb.co/t27NhR9/check-mark-correct-approved-icon-symbol-white-background-3d-illustration-removebg-preview.png"
              alt="check-mark-correct-approved-icon-symbol-white-background-3d-illustration-removebg-preview"
          /></a>
          <h1>Order Placed</h1>
          <div>
            <h2>Order No: ${createdOrder._id}</h2>
          </div>
          <h2>
            Warm Regards <br />
            Team The Farsan
          </h2>
          <a href="https://thefarsan.in/"
            ><img
              style="width: 5em"
              src="https://i.ibb.co/r4SscPz/The-Farsan.png"
              alt="The-Farsan"
          /></a>
        </div>
        `, // html body
      },
      (err, info) => {
        if (err) {
          return console.log(err);
        } else {
          console.log("Message sent: %s", info.messageId);
        }
      }
    );
    res.status(200);
    res.json(createdOrder);
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      OrderId: req.body.id,
      paymentId: req.body.paymentId,
      signature: req.body.signature,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  res.json(orders);
});

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders };
