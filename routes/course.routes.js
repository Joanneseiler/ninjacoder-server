const express = require("express");
const router = express.Router();

//require the needed model
const CourseModel = require("../models/Course.model");
const TutorModel = require("../models/Tutor.model");
const ParentModel = require("../models/Parent.model");

// require middlewares
// const { isLoggedIn } = require("../middlewares/loggedInMiddleware");
// const { isParent } = require("../middlewares/checkRoleMiddleware");
// const { isTutor } = require("../middlewares/checkRoleMiddleware");

// Show the list of courses to anyone
// to handle the GET requests to http:localhost:5005/api/courses
router.get("/courses", (req, res) => {
  CourseModel.find()
    .populate("tutorId")
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

//Show the course selected from course list, only user LoggedIn can see the detail of the course
// to handle the GET requests to http:localhost:5005/api/courses/:courseId

router.get("/courses/:courseId", (req, res) => {
  CourseModel.findById(req.params.courseId)
    .populate("tutorId")
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

//TO DO : routes for stripe-payment
router.get("/courses/:courseId/payment", (req, res) => {
  const { _id } = req.session.loggedInUser; // Parent id as only parents can buy courses
  ParentModel.findByIdAndUpdate(_id, {
    $addToSet: { coursesBooked: req.params.courseId }, // addToSet, avoid duplicates but doesn't throw error if a course already exists
  })
    .then((parent) => {
      res
        .status(200)
        .json({ message: "Your kido is going to be a NinjaCoder!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// Action can be done only by the tutor
// Get to tutor profile, to find all courses created by the tutor
// to handle the GET requests to http:localhost:5005/api/tutor/courses
router.get("/tutor/courses", (req, res) => {
  const { _id } = req.session.loggedInUser;
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
router.post("/tutor/courses/add", async (req, res) => {
  const { name, description, price, image, video, lessons, review } = req.body;
  const tutorId = req.session.loggedInUser._id;
  console.log(req.body);
  // need to check here if the user is a teacher
  try {
    let newCourse = await CourseModel.create({
      // wait for course to get created -> await otherwise Promise
      name,
      description,
      tutorId,
      price,
      image,
      video,
      lessons,
      review,
    });
    let updatedTutor = await TutorModel.findByIdAndUpdate(tutorId, {
      // wait for tutor to get updated -> await otherwise Promise
      //
      $push: { coursesAdded: newCourse._id },
    });
    res.status(200).json(updatedTutor);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong", message: err });
  }
});

// Action can be done only by the tutor
// Delete courses from database
// will handle all DELETE requests to http:localhost:5005/api/courses/:courseId
router.delete("/tutor/courses/:courseId", (req, res) => {
  const tutorId = req.session.loggedInUser._id;
  const courseId = req.params.courseId;
  Promise.all([
    // Make sure that all promises succeed. The course removed from courses and the teacher otherwise throw an error
    CourseModel.findByIdAndDelete(courseId),
    TutorModel.findByIdAndUpdate(tutorId, {
      $pull: { coursesAdded: courseId },
    }),
  ])
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
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
  const { name, description, price, image, video, lessons } = req.body;
  CourseModel.findByIdAndUpdate(
    courseId,
    {
      $set: { name, description, price, image, video, lessons },
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
