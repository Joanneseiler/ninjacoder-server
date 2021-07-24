const { Schema, model } = require("mongoose");

const courseSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  tutor: { type: Schema.Types.ObjectId, ref: "Tutor" },
  price: { type: Number, required: true },
  minAge: { type: Number },
  image: { type: String, required: true },
  video: { type: String, required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  review: { type: Schema.Types.ObjectId, ref: "Review" },
});

const Course = model("Course", courseSchema);

module.exports = Course;
