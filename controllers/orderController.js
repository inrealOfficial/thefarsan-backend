import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";
import QRCode from "qrcode";
import orderCreated from "../Templates/orderCreated.js";
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAdress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    discountPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const generateQR = async (text) => {
    try {
      return await QRCode.toDataURL(text);
    } catch (error) {
      console.log(error);
    }
  };

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
      discountPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    createdOrder.qrCode = await generateQR(
      `https://thefarsan.in/order/${createdOrder._id}`
    );
    const updatedOrder = await createdOrder.save();

    // send mail with defined transport object

    res.status(200);
    res.json(updatedOrder);
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
    let transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "ankita@thefarsan.in", // generated ethereal user
        pass: "Ankita@03", // generated ethereal password
      },
    });
    const updatedOrder = await order.save();
    const userDetails = await User.findById(req.user._id).select("-password");
    let info = await transporter.sendMail(
      {
        from: '"The Farsan" <info@thefarsan.in>', // sender address
        to: `${userDetails.email}`, // list of receivers
        subject: `Order Sucessfully Placed #ORD${updatedOrder._id}`, // Subject line
        text: "Hello", // plain text body
        html: `${orderCreated(updatedOrder, userDetails.name)}`, // html body
      },
      (err, info) => {
        if (err) {
          return console.log(err);
        } else {
          console.log("Message sent: %s", info.messageId);
        }
      }
    );
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

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    await order.remove();
    res.json({ message: "Order deleted sucessfully" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliverdAt = Date.now();

    let transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "ankita@thefarsan.in", // generated ethereal user
        pass: "Ankita@03", // generated ethereal password
      },
    });
    const updatedOrder = await order.save();
    const userDetails = await User.findById(order.user).select("-password");
    let info = await transporter.sendMail(
      {
        from: '"The Farsan" <info@thefarsan.in>', // sender address
        to: `${userDetails.email}`, // list of receivers
        subject: `Order Sucessfully Delivered #ORD${updatedOrder._id}`, // Subject line
        text: "Hello", // plain text body
        html: `${orderCreated(updatedOrder, userDetails.name)}`, // html body
      },
      (err, info) => {
        if (err) {
          return console.log(err);
        } else {
          console.log("Message sent: %s", info.messageId);
        }
      }
    );
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const updateOrderStage = asyncHandler(async (req, res) => {
  const { stage } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.deliveryStage = stage;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered,
  updateOrderStage,
  deleteOrder,
};
