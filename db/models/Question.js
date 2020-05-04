const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

const Question = mongoose.model("question", QuestionSchema);

module.exports = Question;
