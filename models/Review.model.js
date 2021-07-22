const { Schema, model, SchemaType } = require("mongoose");

const reviewSchema = new Schema({
  rate: { type: Number, required: true },
  date: { type: Date, required: true },
  feedback: { type: String, required: true },
  courseId: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  userId: [{ type: Schema.Types.ObjectId, ref: "Parent" }],
});

const Review = model("Review", reviewSchema);

module.exports = Review;
