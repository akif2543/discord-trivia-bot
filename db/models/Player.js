const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlayerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    server: {
      type: String,
      required: true,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    weekScore: {
      type: Number,
      default: 0,
    }
  }, {
      timestamps: true
  }
);

module.exports = Player = mongoose.model("player", PlayerSchema);
