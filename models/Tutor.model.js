const { Schema, model } = require("mongoose");

// require("./Course.model")

const tutorSchema = new Schema({
    username: {
        type: String, 
        required: true, 
        unique: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    profilePic: {
        type: String
    },
    coursesAdded: [{
        type: Schema.Types.ObjectId, 
        ref: 'Course'
    }]
  });

  const Tutor = model("Tutor", tutorSchema);

  module.exports = Tutor;