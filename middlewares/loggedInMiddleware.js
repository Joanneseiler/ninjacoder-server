// Middlewares to check if the user as tutor or as parent is logged in

const isLoggedIn = (req, res, next) => {
  console.log(req.session.loggedInUser);
  if (req.session.loggedInUser) {
    next();
  } else {
    res
      .status(401)
      .json({ message: "Sorry, you are not allowed to be here", code: 401 });
  }
};

module.exports = { isLoggedIn };
