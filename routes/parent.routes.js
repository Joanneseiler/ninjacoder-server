const express = require("express");
const router = express.Router();

// const { isLoggedIn } = require("../middlewares/loggedInMiddleware");
// const { isParent } = require("../middlewares/checkRoleMiddleware");

const ParentModel = require("../models/Parent.model");
const CourseModel = require("../models/Course.model");

//Middleware : check if role === parent to do actions below
//is middleware for checking if LoggedIn is necessary here ? Since we already check it in the middleware above ?

//Show the profile of the parent - only seen by the parent
router.get("/parent", (req, res) => {
  const { _id } = req.session.loggedInUser;
  ParentModel.findById(_id)
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
  const { _id } = req.session.loggedInUser;
  const { username, email, password, secretword, profilePic } = req.body;
  ParentModel.findByIdAndUpdate(
    _id,
    {
      $set: { username, email, password, secretword, profilePic },
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
  const { _id } = req.session.loggedInUser;
  ParentModel.findByIdAndDelete(_id)
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
  const { _id } = req.session.loggedInUser;
  console.log(_id);
  ParentModel.findById(_id)
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

module.exports = router;
