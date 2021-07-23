// Middlewares to check the role of the user to do some actions

const isParent = (req, res, next) => {
  if (req.session.loggedInUser.role != "parent") {
    next();
  } else {
    res.status(401).json({
      message: "Sorry, only a Ninja's parent can do it",
      code: 401,
    });
  }
};

const isTutor = (req, res, next) => {
  if (req.session.loggedInUser.role != "tutor") {
    next();
  } else {
    res.status(401).json({
      message: "Sorry, only a super tutor can do it !",
    });
  }
};

module.exports = {
  isParent,
  isTutor,
};
