import Delivery from "../models/deliveryAdressModel.js";
import asyncHandler from "express-async-handler";

const addDeliverAdress = asyncHandler(async (req, res) => {
  const { name, adressOne, pincode, city, state, country } = req.body;
  if (!name && !pincode) {
    res.status(400);
    throw new Error("No adress Found");
    return;
  } else {
    const deliveryAdress = new Delivery({
      user: req.user._id,
      name,
      adressOne,
      pincode,
      city,
      state,
      country,
    });

    const createdAdress = await deliveryAdress.save();
    res.status(200);
    res.json(createdAdress);
  }
});

const getMyAdresses = asyncHandler(async (req, res) => {
  const adresses = await Delivery.find({ user: req.user._id });

  res.json(adresses);
});

const deleteAdress = asyncHandler(async (req, res) => {
  const adress = await Delivery.findById(req.params.id);
  if (adress) {
    await adress.remove();
    res.json({ message: "Adress deleted sucessfully" });
  } else {
    res.status(404);
    throw new Error("Adress not found");
  }
});

const updateAdress = asyncHandler(async (req, res) => {
  const adress = await Delivery.findById(req.params.id);
  if (adress) {
    (adress.name = req.body.name || adress.name),
      (adress.adressOne = req.body.adressOne || adress.adressOne),
      (adress.pincode = req.body.pincode || adress.pincode);
    adress.city = req.body.city || adress.city;
    adress.state = req.body.state || adress.state;
    adress.country = req.body.country || adress.country;

    const updatedAdress = await adress.save();
    const adresses = await Delivery.find({ user: req.user._id });

    res.json(adresses);
  } else {
    res.status(404);
    throw new Error("No Adress Found");
  }
});

export { addDeliverAdress, getMyAdresses, deleteAdress, updateAdress };
