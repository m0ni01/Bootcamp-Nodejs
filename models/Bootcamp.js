const mongoose = require("mongoose");
const slugify = require("slugify");
const geoCoder = require("../utils/GeoCoder");

const Bootcampschema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 chareacter"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add discription !"],
      maxlength: [500, " Discription cant be more than 500 character"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^\S+@\S+\.\S+$/.test(value);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number no more than 20 characets."],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development", //        'Mobile Development',
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must be not more than 10"],
    },
    avearageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGurantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// creating bootcamp slug from the name

Bootcampschema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocoder
Bootcampschema.pre("save", async function (next) {
  const loc = await geoCoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // Do not save address in DB
  this.address = undefined;
  next();
});

//cascade delete courses when bootcamp is deleted
Bootcampschema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Document deleted s ${this.id}`);
    await this.model("Course").deleteMany({ bootcamp: this._id });
    next();
  }
);

//reverse poplulate the bootcamp with course
Bootcampschema.virtual("Courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
});

module.exports = mongoose.model("Bootcamp", Bootcampschema);
