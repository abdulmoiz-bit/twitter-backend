const mongoose = require("mongoose");
//const User = require("./userModel");
//const Tweet = require("./tweetModel");

const replySchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "a tweet must belong to a user"],
  },
   tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet",
    require: [true, "a reply tweet must belong to a tweet"],
  },
  text: {
    type: String,
    //required: [true, "a tweet must have a text"],
    maxlength: [500, "a tweet must have less or equal than 500 characters"],
    minlength: [1, "a tweet must have more or equal than 1 character"],
  },
  image: {
    type: String,
  },
  video: {
    type: String,
  },
  likesQuantity: {
    type: Number,
    default: 0,
  },
});

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
