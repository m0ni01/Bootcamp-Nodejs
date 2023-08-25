const Bootcamp = require("../models/Bootcamp");
// @des         get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamp.length, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false, msg: "error occured" });
  }
};

// @des         get single bootcamps
// @route       GET /api/v1/bootcamp/:id
// @access      Public

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res
        .status(404)
        .json({ success: false, data: `${req.params.id} not found` });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res
      .status(404)
      .json({ success: false, data: `${req.params.id} not found` });
  }
};

// @des         create bootcamp
// @route       POST /api/v1/bootcamp
// @access      PRIVATE

exports.createBootcamp = async (req, res, next) => {
  try {
    const createBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: createBootcamp });
  } catch (error1) {
    res.status(400).json({ success: false, error: error1 });
  }
};

// @des         UPdate bootcamp
// @route       PUT /api/v1/bootcamp/:id
// @access      PRIVATE

exports.updateBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return res.status(400).json({ success: false, data: bootcamp });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false, data: bootcamp });
  }
};

// @des         delete bootcamps
// @route       DELETE /api/v1/bootcamp/:ID
// @access      PRIVATE

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({ success: false, data: [] });
    }

    res.status(200).json({ success: true, data: [] });
  } catch (error) {
    res.status(400).json({ success: false, data: [] });
  }
};
