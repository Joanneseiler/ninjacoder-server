const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const Tutor = require("../models/Tutor.model");
const Parent = require("../models/Parent.model");

router.post("/signup", (req, res) => {
  if (req.body.role === "parent") {
    handleParentSignUp();
  } else if (req.body.role === "tutor") {
    handleTutorSignUp();
  } else {
    // if role undefined because Postman never ends
    res.status(500).json({
      errorMessage: "role undefined",
    });
  }

  async function handleParentSignUp() {
    const { username, email, password, kidAge, secretWord } = req.body;

    if (
      !ensureParentFieldsAreSet(username, email, password, kidAge, secretWord)
    ) {
      return;
    }

    if (!validateEmailAndPassword(email, password)) {
      return;
    }

    let hash = createPasswordHash(password);

    try {
      let parent = await Parent.create({
        username,
        email,
        password: hash,
        kidAge,
        secretWord,
      });
      //parent.password = "***";
      req.session.loggedInUser = parent;
      res.status(200).json(parent);
      // need to send data if we want to use it in the state
      // if we want to send parent directly to profile save parent in session
      // you always have to send data, but if you don't need it, you can send an empty object {}
    } catch (err) {
      handleSignUpErrorCode(err, res);
    }
  }

  async function handleTutorSignUp() {
    const { username, email, password } = req.body;

    if (!ensureTutorFieldsAreSet(username, email, password)) {
      return;
    }

    if (!validateEmailAndPassword(email, password)) {
      return;
    }

    let hash = createPasswordHash(password);

    try {
      let tutor = await Tutor.create({ username, email, password: hash });
      tutor.password = "***";
      req.session.loggedInUser = tutor;
      res.status(200).json(tutor);
      // need to send data if we want to use it in the state
      // save tutor in session if we want to send parent directly to profile
      // you always have to send data, but if you don't need it, you can send an empty object {}
    } catch (err) {
      handleSignUpErrorCode(err, res);
    }
  }

  function handleSignUpErrorCode(err, res) {
    if (err.code === 11000) {
      res.status(500).json({
        errorMessage: "username or email already exists!",
        message: err,
      });
    } else {
      res.status(500).json({
        errorMessage: "Something went wrong!",
        message: err, // Doesn't show the error when something went wrong on Postman
      });
    }
  }

  function ensureParentFieldsAreSet(
    username,
    email,
    password,
    kidAge,
    secretWord
  ) {
    if (!username || !email || !password || !kidAge || !secretWord) {
      res.status(500).json({
        errorMessage: "Please fill in all the fields.",
      });

      return false;
    }

    return true;
  }

  function ensureTutorFieldsAreSet(username, email, password) {
    if (!username || !email || !password) {
      res.status(500).json({
        errorMessage: "Please fill in all the fields.",
      });

      return false;
    }

    return true;
  }

  function createPasswordHash(password) {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  function validateEmailAndPassword(email, password) {
    const myRegex = new RegExp(
      /^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/
    );
    if (!myRegex.test(email)) {
      res.status(500).json({
        errorMessage: "Email format not correct",
      });
      return false;
    }
    const myPassRegex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    );
    if (!myPassRegex.test(password)) {
      res.status(500).json({
        errorMessage:
          "Password needs to have 8 characters, a number and an uppercase alphabet",
      });
      return false;
    }

    return true;
  }
});

router.post("/signin", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    res.status(500).json({
      error: "Please enter email, password and role",
    });
    return;
  }

  if (role === "parent") {
    let parent;

    try {
      parent = await Parent.findOne({ email });
    } catch (err) {
      res.status(500).json({
        error: "Email does not exist",
        message: err,
      });
      return;
    }

    let passwordMatches = await bcrypt.compare(password, parent.password);

    if (!passwordMatches) {
      res.status(500).json({
        error: "Passwords don't match",
      });
      return;
      // TODO: return? Oder bricht res.status schon alles ab
    }

    parent.password = "***";
    req.session.loggedInUser = parent;
    res.status(200).json(parent);
  }

  /*
    const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!myRegex.test(email)) {
        res.status(500).json({
            error: 'Email format not correct',
        })
        return;  
    }*/
  if (role === "tutor") {
    let tutor = await Tutor.findOne({ email });

    if (tutor === null) {
        res.status(404).json({
            error: "Email does not exist",
        });
        return;
    }

    let passwordMatches = await bcrypt.compare(password, tutor.password);

    if (!passwordMatches) {
      res.status(400).json({
        error: "Passwords don't match",
      });
      return;
      // TODO: return? Oder bricht res.status schon alles ab
    }

    tutor.password = "***";
    req.session.loggedInUser = tutor;
    res.status(200).json(tutor);
  }

  /*
    const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!myRegex.test(email)) {
        res.status(500).json({
            error: 'Email format not correct',
        })
        return;  
    }*/
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(204).end();
});

const isLoggedIn = (req, res, next) => {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized user",
      code: 401,
    });
  }
};

router.get("/user", isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser);
});

module.exports = router;
