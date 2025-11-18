const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  video: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "user" }
    ],
  likeCount: {
    type: Number,
    default: 0,
  },
  foodpartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "foodpartner",
  },
});

const food = mongoose.model("food", foodSchema);

module.exports = food;
