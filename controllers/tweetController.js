//const express = require('express');
//const fs = require('fs');
//const tweetsdata
const Tweet = require("./../models/tweetModel");
const Reply = require("./../models/replyModel");
const User = require("../models/userModel");

exports.getAllTweets = async (req, res) => {
  const tweets = await Tweet.find();
  //console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    results: tweets.length,
    data: {
      tweets,
    },
    //requestedAt: req.requestTime,
  });
};

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/*
exports.setTweetId = (req, res, next) => {
  if (!req.body.tweet) req.body.tweet = req.tweet.id;
  next();
};  
*/

exports.postTweet = async (req, res) => {
  const newTweet = await Tweet.create(req.body);
  console.log(newTweet);
  res.status(201).json({
    status: "success",
    data: {
      tweet: newTweet,
    },
  });
};

exports.postReply = async (req, res, next) => {
  const { text } = req.body;
  const { tweetId } = req.params;
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    return res.status(404).json({
      status: "fail",
      message: "Tweet not found",
    });
  }
  const reply = await Reply.create({
    text,
    tweet: tweetId,
    user: req.user.id,
  });
  //const newTweetReply = await Reply.create(req.body);
  //console.log(newTweetReply);
  res.status(201).json({
    status: "success",
    data: { reply },
  });
};

exports.toggleLike = async (req, res, next) => {
  const userId = req.user.id;
  const tweetId = req.params.tweetId;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    return res.status(404).json({
      status: "fail",
      message: "Tweet not found",
    });
  }

  const alreadyLiked = tweet.likes.includes(userId);
  if (alreadyLiked) {
    tweet.likes.pull(userId);
  } else {
    tweet.likes.push(userId);
  }

  await tweet.save();
  res.status(200).json({
    status: "success",
    message: alreadyLiked ? "Tweet unliked" : "Tweet Liked",
    data: {
      likesCount: tweet.likes.length,
    },
  });
};

exports.getTweetLikes = async (req, res) => {
  const tweet = await Tweet.findById(req.params.tweetId).populate(
    "likes",
    "username"
  );
  res.status(200).json({
    status: "success",
    results: tweet.likes.length,
    data: { users: tweet.likes },
  });
};

/*
exports.deleteTweet = async (req, res) => {

}
*/

exports.getFeed = async (req, res) => {
  // 1. Find current user
  const currentUser = await User.findById(req.user.id);

  // 2. Get list of users to include in feed
  const usersToInclude = [req.user.id, ...currentUser.following];

  // 3. Find tweets from these users, sorted by creation date
  const tweets = (
    await Tweet.find({ user: { $in: usersToInclude } }).populate("user", "name")
  )
    .sort({ createdAt: -1 })
    .limit(50);
  res.status(200).json({
    status: "success",
    results: tweets.length,
    data: {
      tweets,
    },
  });
};
