// Middlewares to check if the user as tutor or as parent is logged in

const isLoggedIn = (req, res, next) => {
  if (req.session.loggedInUser) {
    net();
  } else {
    res
      .status(401)
      .json({ message: "Sorry, you are not allowed to be here", code: 401 });
  }
};

module.exports = { isLoggedIn };
