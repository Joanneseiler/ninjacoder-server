const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// const { isLoggedIn } = require("../middlewares/loggedInMiddleware");
// const { isParent } = require("../middlewares/checkRoleMiddleware");

const ParentModel = require("../models/Parent.model");
const CourseModel = require("../models/Course.model");
const ReviewModel = require("../models/Review.model");

//Middleware : check if role === parent to do actions below
//is middleware for checking if LoggedIn is necessary here ? Since we already check it in the middleware above ?

//Show the profile of the parent - only seen by the parent
router.get("/parent", (req, res) => {
  const parentId = req.session.loggedInUser._id;
  ParentModel.findById(parentId)
    .populate("coursesBooked")
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

//Parent can edit his profile
router.patch("/parent/edit", (req, res) => {
  const parentId = req.session.loggedInUser._id;
  let { username, email, password, secretWord, profilePic, kidAge } = req.body;
  let setObject = {
    username,
    email,
    secretWord,
    kidAge,
    password: createPasswordHash(password),
  };

  if (profilePic) {
    setObject.profilePic = profilePic;
  }

  ParentModel.findByIdAndUpdate(
    parentId,
    {
      $set: setObject,
    },
    { new: true }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: "Update profile failed", message: err });
    });
});

//Parent can delete his profile
router.delete("/parent/delete", (req, res) => {
  const parentId = req.session.loggedInUser._id;
  ParentModel.findByIdAndDelete(parentId)
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

//Parent can see the courses booked
router.get("/parent/courses", (req, res) => {
  const parentId = req.session.loggedInUser._id;
  ParentModel.findById(parentId)
    .populate("coursesBooked")
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

function createPasswordHash(password) {
  let salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

module.exports = router;
