const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add title"],
    maxlength: [50, "title can not be more then 50 character"],
  },
  description: {
    type: String,
    required: [true, "Please add description"],
    maxlength: [500, "Description can be more then 500 character"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add tution fee"],
  },

  minimumSkill: {
    type: String,
    required: [true, "Please add Minimum skill"],
    enum: ["beginner", "intermediate", "advance"],
  },

  scholorshipAvaible: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
    justOne: false,
  },
});

//static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log("calculating avg Cose".blue);
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  //Updating averageCost in DB
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.log(error);
  }

  console.log(obj);
};

//call getAverageCost after save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

//call getAverageCost before remove
CourseSchema.pre("deleteOne", { document: true, query: false }, function () {
  this.constructor.getAverageCost(this.bootcamp);
});
module.exports = mongoose.model("Course", CourseSchema);
