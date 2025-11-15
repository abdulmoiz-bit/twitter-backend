const User = require("../models/userModel");
const Tweet = require("../models/tweetModel");

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

exports.getUserTweets = async (req, res) => {
  //const user = await User.findById(req.params.id).populate('tweets');
  //const tweets = await Tweet.find({ user: req.params.id }).sort({ createdAt: -1 });
  const tweets = await Tweet.find({ user: req.params.id });
  res.status(200).json({
    status: "success",
    results: tweets.length,
    data: {
      tweets,
    },
  });
};

exports.getSpecificUserTweet = async (req, res) => {
  //const tweet = await Tweet.findOne({ _id: tweetId, user: userId });
  //const tweet = await Tweet.findOne({ _id: tweetId, user: userId });
  const tweet = await Tweet.findById(req.params.tweetId);
  res.status(200).json({
    status: "success",
    data: {
      tweet,
    },
  });
};

/*
exports.deleteUser = async(req, res)=> {

}
*/

exports.toggleFollow = async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user.id;

  if (targetUserId === currentUserId) {
    return res.status(400).json({
      status: "fail",
      message: "you cannot follow yourself",
    });
  }
  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);
  if (!targetUser) {
    return res.status(404).json({
      status: "fail",
      message: "target user not found",
    });
  }
  const isFollowing = currentUser.following.includes(targetUserId);
  if (isFollowing) {
    currentUser.following.pull(targetUserId);
    targetUser.followers.pull(currentUserId);
  } else {
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);
  }

  await currentUser.save();
  await targetUser.save();

  res.status(200).json({
    status: "success",
    message: isFollowing ? "Unfollowed successfully" : "Followed Successfully",
    data: {
      followingCount: currentUser.following.length,
      followersCount: targetUser.followers.length,
    },
  });
};


exports.getFollowers = async (req, res) => {
  const user = await User.findById(req.params.id).populate("followers", "name");
  res.status(200).json({
    status: "success",
    result: user.followers.length,
    data: {
      follower: user.followers
    }
  })
}


exportsgetFollowing = async(req,res) => {
  const user = await User.findById(req.params.id).populate("following", "name");
    res.status(200).json({
      status: "success",
      result: user.following.length,
      data: {
        following: user.following
      }
    })
}