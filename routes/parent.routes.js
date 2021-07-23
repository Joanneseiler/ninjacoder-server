const express = require("express");
const router = express.Router();

const { isLoggedin } = require("../middlewares/loggedInMiddleware");
const { isParent } = require("../middlewares/checkRoleMiddleware");

const ParentModel = require("../models/Parent.model");

//Middleware : check if role === parent to do actions below
//is middleware for checking if LoggedIn is necessary here ? Since we already check it in the middleware above ?

//Check
router.get("/tutor");

module.exports = router;
