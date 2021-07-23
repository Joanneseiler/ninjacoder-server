const express = require("express");
const router = express.Router();

// const { isLoggedIn } = require("../middlewares/loggedInMiddleware");
// const { isTutor } = require("../middlewares/checkRoleMiddleware");

const TutorModel = require("../models/Tutor.model");

//Middleware : check if role === tutor to do actions below
//is middleware for checking if LoggedIn is necessary here ? Since we already check it in the middleware above ?

//Show the profile of the tutor - only seen by the tutor
router.get("/tutor", (req, res) => {
  const tutorId = req.session.loggedInUser._id;
  TutorModel.findById(tutorId)
    .populate("coursesAdded") // get what an id references, the object linked with the id
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

//Tutor can edit his profile - only done by the tutor
router.patch("/tutor/edit", (req, res) => {
  const tutorId = req.session.loggedInUser._id;
  const { username, email, password, profilePic } = req.body;
  TutorModel.findByIdAndUpdate(
    tutorId,
    {
      $set: { username, email, password, profilePic },
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

//Tutor can delete his profile
router.delete("/tutor/delete", (req, res) => {
  const tutorId = req.session.loggedInUser._id;
  TutorModel.findByIdAndDelete(tutorId)
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
