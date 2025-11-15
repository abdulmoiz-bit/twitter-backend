const mongoose = require("mongoose");
const User = require("./userModel");
//const Reply = require("./Reply");

const tweetSchema = new mongoose.Schema({
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
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // who liked this tweet
    }
    /*
    {
      quantity: {
        type: Number,
        default: 0,
      }
    }
    */
  ],
});

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
