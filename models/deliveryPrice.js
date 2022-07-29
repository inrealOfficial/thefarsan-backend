import mongoose from "mongoose";

const deliveryPriceSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
  },
  {
    timestamps: true,
  }
);

const Price = mongoose.model("Price", deliveryPriceSchema);

export default Price;
