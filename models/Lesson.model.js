const { Schema, model } = require("mongoose");

const lessonModel = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  media: { type: String, required: true },
  order: { type: Number, required: true },
});

const Lesson = model("Lesson", lessonModel);

module.exports = Lesson;
