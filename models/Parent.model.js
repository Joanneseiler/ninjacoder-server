const { Schema, model } = require("mongoose");

// require("./Course.model")

const parentSchema = new Schema({
  username: {
    type: String, 
    required: true, 
    unique: true
  },
  kidAge: {
    type: Number, 
    required: true
  },
  password: {
    type: String, 
    required: true
  },
  email: {
    type: String, 
    required: true, 
    unique: true
  },
  secretWord: {
    type:String, 
    required:true
  },
  profilePic: {
    type: String
  },
  coursesBooked: [{
    type: Schema.Types.ObjectId, 
    ref: 'Course'
  }]
});

const Parent = model("Parent", parentSchema);

module.exports = Parent;
