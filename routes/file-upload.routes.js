const express = require("express");
const router = express.Router();

const uploader = require("../middlewares/cloudinary.config.js");

// handles POST requests to /api/upload
router.post("/upload", uploader.single("imageUrl"), (req, res, next) => {
  console.log("file is: ", req.file);
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  //You will get the image url in 'req.file.path'
  //store that in the DB : you can do whatever you want => you can use the route to use information
  // so need to return the JSON which is an object
  res.status(200).json({
    image: req.file.path,
  });
});

module.exports = router;
