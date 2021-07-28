// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const app = express();

// app.use(express.static('public'));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const session = require("express-session");
const MongoStore = require("connect-mongo");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // is in milliseconds.  expiring in 1 day
    },
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/NinjaCoder",
      ttl: 60 * 60 * 24, // is in seconds. expiring in 1 day
    }),
  })
);

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

const courseRoutes = require("./routes/course.routes");
app.use("/api", courseRoutes);

const parentRoutes = require("./routes/parent.routes");
app.use("/api", parentRoutes);

const tutorRoutes = require("./routes/tutor.routes");
app.use("/api", tutorRoutes);

const cloudinaryRoutes = require("./routes/file-upload.routes");
app.use("/api", cloudinaryRoutes);

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
