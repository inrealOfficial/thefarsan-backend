import mongoose from "mongoose";
import { boolean } from "webidl-conversions";

const courseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priceList: {
      twofiveG: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        price: {
          type: Number,
        },
      },
      fiveHunderedG: {
        price: {
          type: Number,
        },
      },
      oneKg: {
        price: {
          type: Number,
        },
      },
      twoKg: {
        price: {
          type: Number,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
