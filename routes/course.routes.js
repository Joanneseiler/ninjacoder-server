const express = require("express");
const router = express.Router();

//require the needed model
const CourseModel = require("../models/Course.model");

// Show the list of courses to anyone
// to handle the GET requests to http:localhost:5005/api/courses
router.get("/courses", (req, res) => {
  CourseModel.find()
    .populate("tutor")
    .then((courses) => {
      res.status(200).json(courses);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//Show the course selected from course list
// to handle the GET requests to http:localhost:5005/api/courses/:courseId
// middleware is needed here
router.get("/courses/:courseId", (req, res) => {
  CourseModel.findById(req.params.courseId)
    .then((course) => {
      res.status(200).json(course);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

router.post("/courses/:courseId/payment", (req, res) => {
  // when you click on pay
  res.status(200).json({ message: "payment success" });
});

// Action can be done only by the tutor
// Get to tutor profile, to find all courses created by the tutor
// to handle the GET requests to http:localhost:5005/api/tutor/courses
router.get("/tutor/courses", (req, res) => {
  //const { _id } = req.session.userInfo;
  //for testing with Postman
  const _id = "8785445";
  CourseModel.find({ tutor: _id })
    .then((course) => {
      res.status(200).json(course);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// Action can be done only by the tutor
// to handle the POST requests to http:localhost:5005/api/tutor/courses/add
router.post("/tutor/courses/add", (req, res) => {
  const {
    name,
    description,
    tutor,
    price,
    imageUrl,
    videoUrl,
    lessons,
    review,
  } = req.body;
  // need to check here if the user is a teacher
  CourseModel.create({
    name,
    description,
    tutor,
    price,
    imageUrl,
    videoUrl,
    lessons,
    review,
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong", message: err });
    });
});

// Action can be done only by the tutor
// Delete courses from database
// will handle all DELETE requests to http:localhost:5005/api/courses/:courseId
router.delete("/tutor/courses/:courseId", (req, res) => {
  CourseModel.findByIdAndDelete(req.params.courseId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// Action can be done only by the tutor
// Edit courses from database
//will handle all PATCH requests to http:localhost:5005/api/tutor/courses/:courseId
router.patch("/tutor/courses/:courseId", (req, res) => {
  let courseId = req.params.courseId;
  const { name, description, price, imageUrl, videoUrl, lessons } = req.body;
  CourseModel.findByIdAndUpdate(
    courseId,
    {
      $set: { name, description, price, imageUrl, videoUrl, lessons },
    },
    { new: true }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong", message: err });
    });
});
module.exports = router;
