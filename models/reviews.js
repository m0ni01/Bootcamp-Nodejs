const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { aggregate } = require("./users");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter title"],
    trim: true,
    maxlenght: 1000,
  },
  text: {
    type: String,
    required: [true, "Please Enter Text"],
    trim: true,
    maxlenght: 2000,
  },
  rating: {
    type: Number,
    required: [true, "Please add rating from 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});
ReviewSchema.index({ user: 1, bootcamp: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (bootcampID) {
  const obj = await this.aggregate([
    {
      $match: {
        bootcamp: bootcampID,
      },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampID, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.log(err);
  }
};

ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre("deleteOne", function () {
  this.constructor.getAverageRating(this.bootcamp);
});
module.exports = mongoose.model("Review", ReviewSchema);
