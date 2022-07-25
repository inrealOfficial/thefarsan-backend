import mongoose from "mongoose";

const priceSchema = mongoose.Schema(
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

const Price = mongoose.model("Price", priceSchema);

export default Price;
