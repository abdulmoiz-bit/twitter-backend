//const Tweet = require('../models/tweetModel.js');
//const User = require('../models/userModel.js');

/*
exports.getUserTweets  = async (req, res) => {
   const userTweets = await Tweet.find({user : req.params.id});
   res.status(200).json({
    status: "sucess",
    results : userTweets.length,
    data : {
        userTweets
    }
   })
}

exports.getUserTweet = async (req, res) => {
    const userTweet = await Tweet.findbyId(req.params.id);
    res.status(200).json({
     status: "sucess",
     data : {
         userTweet
     }
    })
}

exports.getTweetReplies = async(req, res) => {
    
}
/*
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};


exports.getAllTweets = async (req,res) => {
    const tweets = await Tweet.find();
    //console.log(req.requestTime);
    res.status(200).json({
        status: "success",
        results: tweets.length,
        data: {
            tweets
        }
        //requestedAt: req.requestTime,
    })
}
*/