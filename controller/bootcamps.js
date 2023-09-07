const ErrorResponse = require("../utils/ErrorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/asynchandler");
const geocoder = require("../utils/GeoCoder");
const fileUpload = require("express-fileupload");
const path = require("path");

// @des         get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  //copy of req query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ["select", "sort", "limit", "page"];

  //loopover removeFields to remove from req.query
  removeFields.forEach((params) => delete reqQuery[params]);

  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //crate query operator (greaterthn ...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr)).populate("Courses");

  //selecting
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //sorting
  if (req.query.sort) {
    const fields = req.query.sort.split(",").join(" ");
    query = query.sort(fields);
  } else {
    query = query.sort("-createAt");
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page > 0 ? page - 1 : 0) * limit;
  query = query.skip(startIndex).limit(limit);
  const endIndex = limit * page;
  const total = await Bootcamp.countDocuments();

  const bootcamp = await query;

  //pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      next: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.pre = {
      pre: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    pagination,
    count: bootcamp.length,
    data: bootcamp,
  });
});
// @des         get single bootcamps
// @route       GET /api/v1/bootcamp/:id
// @access      Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Course not found ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @des         create bootcamp
// @route       POST /api/v1/bootcamp
// @access      PRIVATE

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const createBootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: createBootcamp });
});

// @des         UPdate bootcamp
// @route       PUT /api/v1/bootcamp/:id
// @access      PRIVATE

exports.updateBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(new ErrorResponse(`Course not found ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @des         delete bootcamps
// @route       DELETE /api/v1/bootcamp/:ID
// @access      PRIVATE

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Course not found ${req.params.id}`, 404));
  }

  await bootcamp.deleteOne();
  res.status(200).json({ success: true, data: [] });
});

// @des         Get bootcamps within readius
// @route       GET /api/v1/bootcamp/radius/:zipcode/:distance
// @access      Public

exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  //getting zipcode and distance from req
  const { zipcode, distance } = req.params;

  //getting lan and lat
  const loc = await geocoder.geocode(zipcode);
  const lng = loc[0].longitude;
  const lat = loc[0].latitude;

  //cal raduis by dividing by earth radius
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    // location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  console.log(zipcode, distance, radius, lng, lat, loc, bootcamps);
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

//@des         Upload bootcamp image
//@route       PUT /api/v1/:bootcamp/photo //
//@access      PRIVATE

exports.uploadBootcampImg = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found ${req.params.id}`, 404));
  }

  //handling if file not uploaded
  if (!req.files) {
    return next(new ErrorResponse("Please upload file", 400));
  }
  //  res.status(200).json({ success: true, data: [] });
  const file = req.files.file;

  //checking if file type is image
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  //checking file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less then ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  const filename = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.PHOTO_UPLOAD_PATH}/${filename}`, async (err) => {
    console.log(err);
    return new ErrorResponse("Problem with file Upload", 500);
  });

  await Bootcamp.findByIdAndUpdate(bootcamp._id, { photo: file.name });
  res.status(200).json({
    success: true,
    data: filename,
  });
});

// exports.uploadBootcampImg = asyncHandler(async (req, res, next) => {
//   const bootcamp = await Bootcamp.findById(req.params.id);
//   if (!bootcamp) {
//     return next(new ErrorResponse(`Bootcamp not found ${req.params.id}`, 404));
//   }

//   //handling if file not uploaded
//   console.log(req.files.file);

//   if (!req.files) {
//     return next(new ErrorResponse("Please upload file", 400));
//   }
//   const file = req.files;
//   console.log(file);

//   //
// });
